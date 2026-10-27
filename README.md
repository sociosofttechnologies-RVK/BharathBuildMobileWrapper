# BharathBuild Mobile (Android + iOS)

A Capacitor app that wraps the live BharathBuild website (`../site-source-deal`) in a native
Android and iOS shell. The web app uses SSR and server functions, so the mobile app loads the
**deployed site**. It cannot work from bundled files. Every change you publish to the website
appears in the app without a new store release.

## 1. One-time setup

| Need | For | Get it |
|---|---|---|
| Node.js 22 | everything | nodejs.org |
| Android Studio (includes JDK 21 + Android SDK) | Android | developer.android.com/studio |
| A Mac with the latest Xcode | iOS only | Mac App Store (iOS cannot be built on Windows) |

```bash
cd D:\SocioSoft\BharathBuild\mobile
npm install
```

## 2. Set your live URL (required)

Edit **`app.config.json`**:

```json
{
  "appUrl": "https://your-live-domain.com",
  "appId": "com.bharathbuild.app",
  "appName": "BharathBuild",
  "extraAllowedHosts": ["*.supabase.co", "*.lovable.app", "oauth.lovable.app"]
}
```

- `appUrl`: the published site (Lovable publish URL or your VPS domain from DEPLOYMENT.md). Must be HTTPS.
- `appId`: the permanent store ID. **Decide before the first Play Store / App Store upload**,
  because it cannot change later. If you change it, delete `android/` and `ios/` and run `npx cap add android` / `npx cap add ios` again.
- `extraAllowedHosts`: domains that stay inside the app. Every other link opens in the phone's own apps,
  including `tel:`, `mailto:`, Google Maps and other external sites.

Then run `npm run sync`. Run it after **every** change to `app.config.json` or `capacitor.config.ts`.

## 3. Daily commands

| Command | What it does |
|---|---|
| `npm run sync` | Push config into the Android/iOS projects |
| `npm run android` | Sync + open in Android Studio (press ▶ to run on phone/emulator) |
| `npm run run:android` | Sync + install straight onto a USB-connected phone |
| `npm run apk` | Build a debug APK → `android/app/build/outputs/apk/debug/app-debug.apk` |
| `npm run aab` | Build the Play Store bundle (needs signing, see §5) |
| `npm run ios` | Sync + open in Xcode (Mac only) |
| `npm run icons` | Regenerate all icons/splash from `resources/` |

## 4. Build an APK without installing Android Studio

Copy `ci/android-apk.yml` to `.github/workflows/android-apk.yml`, then push this folder to GitHub. **Actions → Build Android APK → Run workflow** builds the APK in the cloud.
You can type the live URL there, and the APK is available to download from the run.

## 5. Releasing to the stores

**Android (Play Store)**
1. Android Studio → Build → Generate Signed Bundle → create a keystore. **Back it up**, because you
   can't publish updates without it.
2. Raise `versionCode` / `versionName` in `android/app/build.gradle` for every release.
3. Upload the `.aab` to Play Console (one-time $25 developer fee).

**iOS (App Store)**: on a Mac, run `npm run ios`, then set Signing Team in Xcode and choose Product → Archive.
This needs an Apple Developer account ($99/yr).

> Store review note: Apple can reject apps that are "just a website" (guideline 4.2).
> Plan to add at least one native feature before submitting, for example push notifications for new leads or messages.
> Google Play is more lenient.

## 6. What's included

| Feature | How |
|---|---|
| App icon + splash | From `resources/` (BharathBuild "b" mark; full logo on splash) |
| Status bar | Brand navy `#0D2B45` |
| Offline screen | `www/offline.html`, with a Retry button that auto-reloads when the connection returns |
| Android back button | Goes back through pages, exits on the first page |
| Call / Email / Maps buttons | Open the phone dialer, mail app and Google Maps |
| Image upload (Create New Ad) | Camera + gallery permissions on both platforms |

## 7. Known limitation: Google sign-in

Google blocks sign-in inside embedded app browsers (`disallowed_useragent`), so the
**"Continue with Google"** button won't complete inside the app. Email/password login works.
To fix it, the website must open Google sign-in in the system browser and return to the app through a deep link.
That needs a small change in `site-source-deal`. Until then, consider hiding the Google button when the user-agent
contains `BharathBuildApp`, which the app adds to every request.

## 8. Supabase settings

Login, signup and password reset happen on your live domain, so no Supabase changes are needed beyond
what DEPLOYMENT.md §7 already lists.
