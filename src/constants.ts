export interface Game {
  id: string;
  title: string;
  image: string;
  tier: 1 | 2;
  category: string;
}

export const GAMES: Game[] = [
  {
    id: 'ludo',
    title: 'LUDO CLASSIC PRO',
    image: 'https://cdn.dribbble.com/userupload/46642195/file/d6d845019c8c232749926fd510a15fab.png?resize=752x&vertical=center',
    tier: 1,
    category: 'Board'
  },
  {
    id: 'carrom',
    title: 'CARROM BOARD ULTRA',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/c3/93/ab/c393ab98-5b34-36c9-5186-262d6eec522b/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/1200x630wa.png',
    tier: 1,
    category: 'Board'
  },
  {
    id: 'billiards',
    title: '8-BALL POOL ARENA',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/8_Ball_Pool_cover.jpg/250px-8_Ball_Pool_cover.jpg',
    tier: 1,
    category: 'Sport'
  },
  {
    id: 'cricket',
    title: 'T20 CRICKET MASTER',
    image: 'https://png.pngtree.com/png-clipart/20241230/original/pngtree-cricket-logo-vector-icon-design-png-image_18283456.png',
    tier: 1,
    category: 'Sport'
  },
  {
    id: 'racing',
    title: 'NITRO RACING PRO',
    image: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Asphalt_8_Airborne_cover.jpg',
    tier: 2,
    category: 'Racing'
  },
  {
    id: 'football',
    title: 'FOOTBALL STRIKER 24',
    image: 'https://e0.365dm.com/25/07/1600x900/skysports-eafc-bellingham-musiala_6966794.jpg?20250717093803',
    tier: 2,
    category: 'Sport'
  },
  {
    id: 'spin',
    title: 'SPIN & WIN FORTUNE',
    image: 'https://static.vecteezy.com/system/resources/previews/054/051/871/non_2x/green-lucky-wheel-of-fortune-with-ribbon-of-text-good-luck-and-set-icons-spin-for-st-patrick-day-lucky-spin-casino-banner-design-element-for-ui-game-vector.jpg',
    tier: 2,
    category: 'Luck'
  },
  {
    id: 'bubble',
    title: 'BUBBLE BLAST MASTER',
    image: 'https://play-lh.googleusercontent.com/pg-ilXN-5stlkN0tyntMaisElQM_WVY7gnfvfylibi6GrYSJhsPx_LILDlA88fUff0=w240-h480-rw',
    tier: 2,
    category: 'Arcade'
  }
];

export const BINANCE_PAY_ID = '987952229';
export const TELEGRAM_CHANNEL = 'https://t.me/muktarkhan7';
export const TELEGRAM_GROUP = 'https://t.me/+dLyp-Wjg_pUxMjNl';
