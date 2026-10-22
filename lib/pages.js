import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { imageSize } from 'image-size';

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif']);
const IGNORED = new Set(['.DS_Store', 'Icon', 'Icon\r']);

// "src/posts/20-tmux-ide/index.md" -> { dir, num: 20, slug: "tmux-ide" }
export function pageInfo(inputPath) {
  const dir = path.dirname(inputPath);
  const base = path.basename(dir);
  const m = base.match(/^(\d+)-(.+)$/);
  return {
    dir,
    num: m ? parseInt(m[1], 10) : null,
    slug: m ? m[2] : base,
  };
}

export function pageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => !IGNORED.has(f) && !f.endsWith('.md') && fs.statSync(path.join(dir, f)).isFile())
    .sort();
}

export function pageImages(dir, url) {
  return pageFiles(dir)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()) && f !== 'hero.jpg')
    .map((f) => {
      const { width, height } = imageSize(fs.readFileSync(path.join(dir, f)));
      return { file: f, url: `${url}${encodeURI(f)}`, width, height };
    });
}

// Kirby's tiny URL hash: base36 of the crc32 of the page uri.
export function tinyHash(uri) {
  return (zlib.crc32(uri) >>> 0).toString(36);
}

// Lists every page directory under src/posts and src/pages with its asset files,
// so the Eleventy config can map them to /<slug>/<file>.
export function pageAssetMap(root = 'src') {
  const map = {};
  for (const group of ['posts', 'pages']) {
    const groupDir = path.join(root, group);
    if (!fs.existsSync(groupDir)) continue;
    for (const entry of fs.readdirSync(groupDir)) {
      const dir = path.join(groupDir, entry);
      if (!fs.statSync(dir).isDirectory()) continue;
      const { slug } = pageInfo(path.join(dir, 'index.md'));
      for (const file of pageFiles(dir)) {
        map[path.join(dir, file)] = path.join(slug, file);
      }
    }
  }
  return map;
}
