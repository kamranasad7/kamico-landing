export type Theme = 'dark' | 'light';

const storageKey = 'kamico-theme';

class ThemeState {
	/** Mirrors `<html data-theme>`. Starts dark, the theme the prerendered HTML ships with. */
	value = $state<Theme>('dark');

	/** Picks up the theme the inline script in app.html applied before first paint. */
	sync() {
		this.value = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
	}

	toggle() {
		this.value = this.value === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = this.value;
		try {
			localStorage.setItem(storageKey, this.value);
		} catch (e) {
			// Storage can be blocked; the theme still applies for this page view.
		}
	}
}

export const theme = new ThemeState();
