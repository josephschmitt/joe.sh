// One-off converter from the Kirby 1 content folder to the Eleventy source tree.
// Usage: node scripts/convert-content.mjs [website/public/content] [src]
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { parseKirbyDate } from '../lib/dates.js';

const SOURCE = process.argv[2] || 'website/public/content';
const DEST = process.argv[3] || 'src';
const IGNORED = new Set(['.DS_Store', 'Icon', 'Icon\r']);

function parseKirbyFile(file) {
  const content = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
  const data = {};
  for (const section of content.split(/[\r\n]+-{4,}/)) {
    const idx = section.indexOf(':');
    if (idx < 0) continue;
    const key = section.slice(0, idx).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
    if (!key) continue;
    data[key] = section.slice(idx + 1).trim();
  }
  return data;
}

function frontmatter(data, template) {
  const fm = {};
  const copy = (from, to = from) => { if (data[from] !== undefined && data[from] !== '') fm[to] = data[from]; };
  copy('title');
  copy('short');
  copy('subtitle');
  if (data.date) {
    const d = parseKirbyDate(data.date);
    if (!d) throw new Error(`Unparseable date "${data.date}"`);
    fm.date = d;
  }
  copy('status');
  copy('theme');
  if (data.code !== undefined) fm.code = data.code === 'true';
  copy('link');
  copy('description');
  if (template === 'gallery') fm.layout = 'layouts/gallery.njk';
  if (data.hero) fm.hero = data.hero;
  return fm;
}

function convertDir(srcDir, destDir) {
  const entries = fs.readdirSync(srcDir).filter((f) => !IGNORED.has(f));
  const contentFile = entries.find((f) => /^(default|gallery)\.md$/.test(f));
  if (!contentFile) return false;
  const data = parseKirbyFile(path.join(srcDir, contentFile));
  const template = path.basename(contentFile, '.md');

  const heroMeta = entries.find((f) => f === 'hero.jpg.md');
  if (heroMeta) {
    const meta = parseKirbyFile(path.join(srcDir, heroMeta));
    data.hero = Object.fromEntries(Object.entries(meta).filter(([, v]) => v !== ''));
  }

  fs.mkdirSync(destDir, { recursive: true });
  const fm = yaml.dump(frontmatter(data, template), { lineWidth: -1 });
  fs.writeFileSync(path.join(destDir, 'index.md'), `---\n${fm}---\n\n${data.text || ''}\n`);

  for (const f of entries) {
    if (f.endsWith('.md')) continue;
    fs.copyFileSync(path.join(srcDir, f), path.join(destDir, f));
  }
  return true;
}

// Numbered folders are the visible posts; a few named folders are standalone pages.
let posts = 0;
let pages = 0;
for (const entry of fs.readdirSync(SOURCE)) {
  const dir = path.join(SOURCE, entry);
  if (!fs.statSync(dir).isDirectory()) continue;
  if (/^\d+-/.test(entry)) {
    if (convertDir(dir, path.join(DEST, 'posts', entry))) posts++;
  } else if (['colophon', 'puerto-rico', 'sadie'].includes(entry)) {
    if (convertDir(dir, path.join(DEST, 'pages', entry))) pages++;
  }
}

const site = parseKirbyFile(path.join(SOURCE, 'site.md'));
fs.mkdirSync(path.join(DEST, '_data'), { recursive: true });
fs.writeFileSync(path.join(DEST, '_data', 'site.json'), JSON.stringify({
  url: 'https://joe.sh',
  title: site.title,
  author: site.author,
  description: site.description,
  keywords: site.keywords,
  copyright: site.copyright,
  mastodon: site.mastodon,
  bluesky: site.bluesky,
  twitter: site.twitter,
}, null, 2) + '\n');

const home = parseKirbyFile(path.join(SOURCE, 'home', 'home.md'));
fs.writeFileSync(path.join(DEST, '_data', 'home.json'), JSON.stringify({
  title: home.title,
  greeting: home.greeting,
  subtitle: home.subtitle,
}, null, 2) + '\n');

const feed = parseKirbyFile(path.join(SOURCE, 'feed', 'feed.md'));
fs.writeFileSync(path.join(DEST, '_data', 'feed.json'), JSON.stringify({
  title: feed.title,
  description: feed.description,
}, null, 2) + '\n');

console.log(`Converted ${posts} posts and ${pages} pages into ${DEST}/`);
