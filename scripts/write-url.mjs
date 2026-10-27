// Copies the app URL from app.config.json into www/app-url.js (used by the offline screen).
import { readFileSync, writeFileSync } from 'node:fs';
const app = JSON.parse(readFileSync(new URL('../app.config.json', import.meta.url), 'utf8'));
const url = process.env.BHARATH_URL || app.appUrl;
if (url.includes('REPLACE-ME')) {
  console.warn('\n⚠  app.config.json still has the placeholder URL. Set "appUrl" to your live site.\n');
}
writeFileSync(new URL('../www/app-url.js', import.meta.url), `window.APP_URL = ${JSON.stringify(url)};\n`);
console.log('App URL ->', url);
