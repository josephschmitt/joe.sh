import { md } from './markdown.js';

// A port of the Kirby 1 kirbytext parser plus the site's kirbytextExtended plugin.
// Tags look like (figure: file.jpg alt: text) and are expanded to HTML before the
// text is handed to markdown-it, exactly as the PHP version did.

const TAGS = ['gist', 'twitter', 'date', 'image', 'file', 'link', 'email', 'youtube', 'vimeo', 'forkme', 'heading', 'figure'];
const ATTRS = ['text', 'file', 'width', 'height', 'link', 'popup', 'class', 'title', 'alt', 'rel', 'lang', 'target', 'ribbon', 'el', 'id', 'caption', 'align', 'width', 'maxwidth'];
const VIDEO_WIDTH = 480;
const VIDEO_HEIGHT = 358;

const RIBBONS = {
  lightblue: 'forkme_right_lightblue_729dd6.png',
  purple: 'forkme_right_purple_C272ED.png',
  red: 'forkme_right_red_E3422F.png',
  green: 'forkme_right_green_72EDAD.png',
  yellow: 'forkme_right_yellow_CCE36D.png',
  white: 'forkme_right_white_ffffff.png',
  gray: 'forkme_right_gray_6d6d6d.png',
  darkblue: 'forkme_right_darkblue_121621.png',
  orange: 'forkme_right_orange_ff7600.png',
};

export function html(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function attrs(pairs) {
  return Object.entries(pairs)
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');
}

function target(params) {
  if (!params.popup && !params.target) return '';
  return params.popup ? ' target="_blank"' : ` target="${params.target}"`;
}

function encodeFile(name) {
  return encodeURI(name);
}

// ctx: { url: '/slug/', files: ['hero.jpg', ...] }
function resolveUrl(url, ctx) {
  if (/^(http|https):\/\//i.test(url)) return url;
  if (ctx?.files?.includes(url)) return `${ctx.url}${encodeFile(url)}`;
  return `/${url.replace(/^\/+/, '')}`;
}

const tags = {
  link(params, ctx) {
    const href = resolveUrl(params.link || '/', ctx);
    const a = attrs({ href, rel: params.rel, class: params.class, title: html(params.title) });
    const text = params.text || href;
    return `<a ${a}${target(params)}>${html(text)}</a>`;
  },

  image(params, ctx) {
    const src = resolveUrl(params.image || '', ctx);
    const alt = params.text || params.alt || params.title || '';
    const img = `<img ${attrs({ src, width: params.width, height: params.height, class: params.class, title: html(params.title), alt: html(alt) })} />`;
    if (!params.link) return img;
    const href = params.link === 'self' ? params.image : params.link;
    return `<a ${attrs({ href: resolveUrl(href, ctx), rel: params.rel, class: params.class, title: html(params.title) })}${target(params)}>${img}</a>`;
  },

  file(params, ctx) {
    const url = params.file || '';
    const text = params.text || url.replace(/_/g, '\\_');
    const cls = params.class ? ` class="${params.class}"` : '';
    const title = params.title ? ` title="${html(params.title)}"` : '';
    return `<a${target(params)}${title}${cls} href="${resolveUrl(url, ctx)}">${html(text)}</a>`;
  },

  date(params) {
    const format = (params.date || '').toLowerCase();
    return format === 'year' ? String(new Date().getUTCFullYear()) : String(new Date().getUTCFullYear());
  },

  email(params) {
    if (!params.email) return '';
    const text = params.text || params.email;
    return `<a${params.class ? ` class="${params.class}"` : ''}${params.title ? ` title="${html(params.title)}"` : ''} href="mailto:${params.email}">${html(text)}</a>`;
  },

  twitter(params) {
    if (!params.twitter) return '';
    const username = params.twitter.replace(/@/g, '');
    const cls = params.class ? ` class="${params.class}"` : '';
    const title = params.title ? ` title="${html(params.title)}"` : '';
    const text = params.text ? html(params.text) : `@${html(username)}`;
    return `<a${target(params)}${cls}${title} href="http://twitter.com/${username}">${text}</a>`;
  },

  youtube(params) {
    const url = params.youtube || '';
    const m = url.match(/youtube\.com\/embed\/([a-z0-9_-]+)/i) || url.match(/v=([a-z0-9_-]+)/i) || url.match(/youtu\.be\/([a-z0-9_-]+)/i);
    if (!m) return '';
    const cls = params.class ? ` class="${params.class}"` : '';
    return `<div class="video-container"><iframe${cls} width="${params.width || VIDEO_WIDTH}" height="${params.height || VIDEO_HEIGHT}" src="http://www.youtube.com/embed/${m[1]}" frameborder="0" allowfullscreen></iframe></div>`;
  },

  vimeo(params) {
    const m = (params.vimeo || '').match(/vimeo\.com\/([a-z0-9_-]+)/i);
    if (!m) return '';
    const cls = params.class ? ` class="${params.class}"` : '';
    return `<div class="video-container"><iframe${cls} src="http://player.vimeo.com/video/${m[1]}" width="${params.width || VIDEO_WIDTH}" height="${params.height || VIDEO_HEIGHT}" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>`;
  },

  gist(params) {
    let url = `${params.gist || ''}.js`;
    if (params.file) url += `?file=${params.file}`;
    return `<script src="${url}"></script>`;
  },

  forkme(params) {
    const repo = params.forkme || 'josephschmitt';
    const ribbon = RIBBONS[params.ribbon || 'lightblue'] || RIBBONS.lightblue;
    return `<a id="forkme" href="https://github.com/${repo}"><img src="/assets/images/gh_ribbons/${ribbon}" alt="Fork me on GitHub"></a>`;
  },

  heading(params) {
    const el = params.el || 'h2';
    const id = params.id || '';
    return `<${el} id="${id}"><a href="#${id}">${params.heading || ''}</a></${el}>`;
  },

  figure(params, ctx) {
    const name = params.figure || '';
    const src = ctx?.files?.includes(name) ? `${ctx.url}${encodeFile(name)}` : name;
    const width = params.width ? `width:${params.width};` : '';
    const maxwidth = params.maxwidth ? `max-width:${params.maxwidth};` : '';
    const style = width || maxwidth ? `style="${width}${maxwidth}"` : '';
    const alt = params.alt || params.caption || '';
    const align = params.align === undefined ? 'center' : params.align;
    let out = align ? `<figure style="text-align:${align};">` : '<figure>';
    out += `<img src="${src}" alt="${alt}" ${style} />`;
    if (params.caption) out += `<figcaption>${params.caption}</figcaption>`;
    return `${out}</figure>`;
  },
};

// Tags that produce block-level HTML get a blank line after them so markdown-it closes the HTML block there,
// the way PHP Markdown did, instead of swallowing the following paragraph into it.
const BLOCK_TAGS = new Set(['figure', 'heading', 'vimeo', 'youtube', 'gist']);

const TAG_RE = new RegExp(`\\((${TAGS.join('|')}):(.*?)\\)`, 'gi');
const ATTR_SPLIT_RE = new RegExp(`(${[...TAGS, ...ATTRS].join('|')}):`, 'i');

function parseTag(match, name) {
  const method = name.toLowerCase();
  if (!tags[method]) return match;
  const stripped = match.replace(/[()]/g, '');
  const parts = stripped.split(ATTR_SPLIT_RE).filter((p) => p !== '');
  const params = {};
  for (let i = 0; i + 1 < parts.length; i += 2) {
    params[parts[i].trim().toLowerCase()] = parts[i + 1].trim();
  }
  return params;
}

function codeBlock(code) {
  const lines = code.split('\n');
  const lang = (lines.shift() || '').trim();
  const body = lines.join('\n').trim();
  return `<pre class="${lang}"><code>${html(body)}</code></pre>`;
}

// Expands kirbytext tags and fenced code blocks; returns markdown.
export function kirbytextPreprocess(text, ctx = {}) {
  let out = String(text ?? '');
  out = out.replace(TAG_RE, (match, name) => {
    const params = parseTag(match, name);
    if (typeof params === 'string') return params;
    const method = name.toLowerCase();
    const out = tags[method](params, ctx);
    return BLOCK_TAGS.has(method) ? `${out}\n\n` : out;
  });
  out = out.replace(/`{3,}([\s\S]*?)`{3,}/g, (_, code) => codeBlock(code));
  return out;
}

export function kirbytext(text, ctx = {}) {
  return md.render(kirbytextPreprocess(text, ctx));
}

export function excerpt(text, chars = 140, ctx = {}) {
  let s = kirbytext(text, ctx).replace(/<[^>]*>/g, '').trim().replace(/\n/g, ' ');
  if (s.length <= chars) return s;
  if (chars === 0) return s;
  const cut = s.slice(0, chars);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}
