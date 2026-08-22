export type Game = {
	title: string;
	installs: string;
	genre: string;
	sessions: string;
	rated: string;
	blurb: string;
	url: string;
	icon: string;
	shot: string;
};

/** Lifted from the design export, with the Play CDN artwork served from static/media. */
export const games: Game[] = [
	{
		title: 'Space Impact 3: Revamped',
		installs: '30K+ downloads',
		genre: 'Arcade',
		sessions: 'Single player',
		rated: 'Rated 7+',
		blurb:
			'A nostalgic revival of the 2D space shooter: stage bosses with their own weak points, power-ups, extra lives, and a mission objective on every stage.',
		url: 'https://play.google.com/store/apps/details?id=com.kamico.si3',
		icon: '/media/si3-icon.png',
		shot: '/media/si3-shot.png'
	},
	{
		title: 'Salary Day',
		installs: 'Board game',
		genre: '2–4 players',
		sessions: 'Pass and play',
		rated: 'Rated 3+',
		blurb:
			'A retro-inspired money board game across a 31-day month. Strike deals, open the mail, dodge surprise bills, and finish payday with the fattest wallet.',
		url: 'https://play.google.com/store/apps/details?id=com.kamico.salaryday',
		icon: '/media/salaryday-icon.png',
		shot: '/media/salaryday-shot.jpg'
	}
];
