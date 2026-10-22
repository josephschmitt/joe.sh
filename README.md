# joe.sh

Personal website for Joseph Schmitt, built as a static site with [Eleventy](https://www.11ty.dev/).

## Working on the site

```
npm install
npm run serve     # builds and serves at http://localhost:8080 with live reload
npm run build     # writes the site to _site/
```

Drafts (posts whose `status` is not `Published`) are listed on the home page in `serve` mode only. The production build hides them from the home page and the feed, but still builds their pages.

## Layout

- `src/posts/NN-slug/index.md` – blog posts. The number orders them on the home page (highest first) and the slug becomes the URL (`/slug/`). Images and downloads live next to the post and are published at `/slug/<file>`.
- `src/pages/<slug>/index.md` – standalone pages (colophon, photo galleries).
- `src/_includes/layouts` and `src/_includes/partials` – Nunjucks templates.
- `src/_data` – site-wide settings (`site.json`), home page copy, feed metadata.
- `src/sass` – stylesheets, compiled to `/assets/styles/*.css` during the build.
- `src/scripts` – JavaScript sources. `npm run scripts` bundles and minifies them into `src/assets/scripts`.
- `src/assets` – fonts, images and the prebuilt script bundles, copied as-is.
- `src/tweets` – the static Twitter archive, copied as-is.
- `src/redirects.njk` – generates `_redirects` (Netlify / Cloudflare Pages format) with the old Kirby tiny URLs, old image paths and the feed location.
- `lib/kirbytext.js` – the `(figure: ...)`, `(heading: ...)`, `(forkme: ...)`, `(file: ...)`, `(link: ...)` and `(vimeo: ...)` content tags carried over from Kirby.

See `CLAUDE.md` for the post format and writing guide.

## Deploying

The build output in `_site/` is plain files. Point any static host (Cloudflare Pages, Netlify, GitHub Pages) at the repository with build command `npm run build` and output directory `_site`. The `_redirects` file is honoured by Cloudflare Pages and Netlify.

## History

The site ran on Kirby 1 and PHP from 2012 until 2026. The previous source is kept under `website/` until the static site is live, and `scripts/convert-content.mjs` is the one-off converter that produced `src/posts` and `src/pages` from the Kirby content folder.
