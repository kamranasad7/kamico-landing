// Serves the prerendered output in build/ over HTTP — for `npm run preview` and for the
// acceptance checks in verify.mjs.
//
// This deliberately does not use `vite preview`. SvelteKit's preview server passes its static
// directory to sirv without `dev: true`, and sirv then indexes that directory once at startup and
// answers every later request from the snapshot rather than the filesystem. The build's JS
// filenames are content-hashed, so any rebuild while the server is up renames every entry and
// chunk, and the still-running server 404s all of them. The page keeps rendering — the prerendered
// HTML is already in the response — but the module graph never loads, so it silently never
// hydrates. That is a nasty failure mode for a preview server that outlives a build: an editor
// loop, or a long-lived QA server, sees a page that looks right and is dead.
//
// So this resolves every request against the filesystem instead of a boot-time index, which makes
// a rebuild visible to an already-running server. It also serves build/ itself — the artifact a
// static host actually deploys — rather than the intermediate .svelte-kit/output that vite preview
// serves.
//
// Usage: node scripts/preview.mjs [--port 4173] [--host localhost]
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);

/** Reads `--name value` or `--name=value`, so it takes flags the way `vite preview` did. */
const flag = (name, fallback) => {
	const index = argv.findIndex((arg) => arg === `--${name}` || arg.startsWith(`--${name}=`));
	if (index === -1) return fallback;
	const arg = argv[index];
	return (arg.includes('=') ? arg.slice(arg.indexOf('=') + 1) : argv[index + 1]) || fallback;
};

const port = Number(flag('port', '4173'));
const host = flag('host', 'localhost');
const root = resolve(fileURLToPath(new URL('../build', import.meta.url)));

if (!Number.isInteger(port) || port < 0 || port > 65535) {
	console.error(`Invalid --port ${flag('port', '')}`);
	process.exit(1);
}

// Serving nothing is indistinguishable from a site where every page 404s, so say which it is.
if (!existsSync(root)) {
	console.error(`No build to preview at ${root} — run \`npm run build\` first.`);
	process.exit(1);
}

const TYPES = {
	'.avif': 'image/avif',
	'.css': 'text/css; charset=utf-8',
	'.html': 'text/html; charset=utf-8',
	'.ico': 'image/x-icon',
	'.jpeg': 'image/jpeg',
	'.jpg': 'image/jpeg',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.map': 'application/json; charset=utf-8',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.txt': 'text/plain; charset=utf-8',
	'.webmanifest': 'application/manifest+json',
	'.webp': 'image/webp',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.xml': 'application/xml; charset=utf-8'
};

/**
 * The file in build/ a request path maps to, or null. Resolved per request rather than from a
 * cached listing — that is the whole point of this server.
 * @param {string} pathname a decoded URL path
 */
function resolveFile(pathname) {
	const target = resolve(root, `.${normalize(pathname)}`);
	// `..` segments, absolute paths and encoded separators must not escape build/.
	if (target !== root && !target.startsWith(root + sep)) return null;
	// adapter-static writes a route as either `<route>.html` or `<route>/index.html`, depending on
	// the trailingSlash it was prerendered with, so accept both spellings of a directory.
	const candidates = pathname.endsWith('/')
		? [join(target, 'index.html')]
		: [target, `${target}.html`, join(target, 'index.html')];
	for (const candidate of candidates) {
		// statSync, not existsSync: a directory must not be streamed as if it were a file.
		const stats = statSync(candidate, { throwIfNoEntry: false });
		if (stats?.isFile()) return { path: candidate, size: stats.size };
	}
	return null;
}

/**
 * Hashed assets are immutable and safe to cache forever. Everything else is revalidated on every
 * request, for the same reason the file listing is not cached: after a rebuild the served bytes
 * have changed, and a preview answered from the browser cache is as stale as one answered from a
 * boot-time index.
 */
const cacheControl = (pathname) =>
	pathname.startsWith('/_app/immutable/') ? 'public,max-age=31536000,immutable' : 'no-cache';

const server = createServer((req, res) => {
	const method = req.method ?? 'GET';
	if (method !== 'GET' && method !== 'HEAD') {
		res.writeHead(405, { allow: 'GET, HEAD', 'content-length': '0' });
		return res.end();
	}

	let pathname;
	try {
		pathname = decodeURIComponent(new URL(req.url ?? '/', `http://${host}`).pathname);
	} catch {
		// A malformed percent-escape is the client's fault, and must not read as a missing file.
		res.writeHead(400, { 'content-type': TYPES['.txt'], 'content-length': '12' });
		return res.end('Bad Request\n');
	}

	const file = resolveFile(pathname);
	if (!file) {
		console.log(`[404] ${method} ${pathname}`);
		const fallback = resolveFile('/404.html');
		const headers = { 'content-type': TYPES['.html'], 'cache-control': 'no-cache' };
		if (fallback) {
			res.writeHead(404, { ...headers, 'content-length': String(fallback.size) });
			return method === 'HEAD' ? res.end() : createReadStream(fallback.path).pipe(res);
		}
		const body = `Not found: ${pathname}\n`;
		res.writeHead(404, {
			'content-type': TYPES['.txt'],
			'content-length': String(Buffer.byteLength(body)),
			'cache-control': 'no-cache'
		});
		return res.end(method === 'HEAD' ? undefined : body);
	}

	res.writeHead(200, {
		'content-type': TYPES[extname(file.path).toLowerCase()] ?? 'application/octet-stream',
		'content-length': String(file.size),
		'cache-control': cacheControl(pathname)
	});
	if (method === 'HEAD') return res.end();

	const stream = createReadStream(file.path);
	// A read that dies mid-response is a real fault: say so loudly rather than hanging the socket.
	stream.on('error', (error) => {
		console.error(`Error streaming ${file.path}: ${error.message}`);
		res.destroy(error);
	});
	stream.pipe(res);
});

server.on('error', (error) => {
	if (/** @type {NodeJS.ErrnoException} */ (error).code === 'EADDRINUSE') {
		console.error(`Port ${port} is already in use — stop the process holding it, or pass --port.`);
		process.exit(1);
	}
	throw error;
});

// The harness kills the process group, but a plain SIGTERM to this process alone must also let go
// of the port, or the next preview cannot bind it.
for (const signal of ['SIGTERM', 'SIGINT']) {
	process.on(signal, () => server.close(() => process.exit(0)));
}

server.listen(port, host, () => {
	console.log(`  ➜  Local:   http://${host}:${port}/`);
	console.log(`  ➜  Serving: ${root} (read from disk per request, so a rebuild needs no restart)`);
});
