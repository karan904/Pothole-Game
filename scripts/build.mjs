// Static build: copies the game into dist/ and fills in the site URL used by
// link previews (og:url, og:image). No dependencies; runs anywhere Node runs.
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';

const env = process.env;
// Falls back to the published site so previews built elsewhere still point at the live game.
let site = env.SITE_URL || env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL || 'https://gaddha-game.vercel.app';
if (site && !/^https?:\/\//.test(site)) site = 'https://' + site;
site = site.replace(/\/$/, '');

mkdirSync('dist', { recursive: true });
copyFileSync('og.jpg', 'dist/og.jpg');
writeFileSync('dist/index.html', readFileSync('index.html', 'utf8').replaceAll('__SITE_URL__', site));
console.log(`Built dist/ with ${site ? 'site URL ' + site : 'relative URLs (set SITE_URL for absolute link previews)'}`);
