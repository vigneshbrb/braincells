# BrainCells

A static personal development streaming demo. Sign in uses local browser state; any valid email and a password of at least six characters work. Profiles, lists, ratings, and watch progress stay in that browser's local storage.

## Run locally

Requires Node.js 22 and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. To check the release path locally:

```sh
npm run test
npm run e2e
npm run build
```

Playwright needs Chromium installed once: `npx playwright install chromium`.

## Deploy

Host this project in a GitHub repository. In **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**. Push to `main`. The [release workflow](.github/workflows/release.yml) installs dependencies, runs unit and browser tests, builds for the repository's Pages path, then publishes `dist` only when those steps pass. Pull requests run the same checks without publishing.

The site URL is `https://<owner>.github.io/<repository>/`. The workflow copies `index.html` to `404.html` so refreshing a client-side route can load the app on GitHub Pages. Video URLs in the catalog point to external MP4 files; they are not bundled with the site.
