import type { CapacitorConfig } from '@capacitor/cli';
import { readFileSync } from 'node:fs';

// All app-specific values live in app.config.json — edit that file, not this one.
const app = JSON.parse(readFileSync(new URL('./app.config.json', import.meta.url), 'utf8'));
const APP_URL: string = process.env.BHARATH_URL || app.appUrl;
const host = new URL(APP_URL).hostname;

const NAVY = '#0D2B45';

const config: CapacitorConfig = {
  appId: app.appId,
  appName: app.appName,
  webDir: 'www',
  server: {
    url: APP_URL,
    cleartext: APP_URL.startsWith('http://'), // allow http only for local testing
    // Hosts allowed to load INSIDE the app. Everything else (tel:, mailto:, Google Maps,
    // other websites) opens in the phone's own apps / browser.
    allowNavigation: [host, `*.${host}`, ...(app.extraAllowedHosts || [])],
    errorPath: 'offline.html',
  },
  appendUserAgent: 'BharathBuildApp',
  backgroundColor: '#F8F9FB',
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#F8F9FB',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: NAVY,
      style: 'DARK',
    },
  },
};

export default config;
