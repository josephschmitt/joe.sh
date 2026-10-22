import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';

// Configured to match what PHP Markdown Extra produced on the Kirby site:
// raw HTML allowed, no typographic replacements, no autolinking, and the
// footnote markup PHP Markdown Extra emits (fn:1, fnref:1, rel/rev attributes).
export const md = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  breaks: false,
  linkify: false,
  typographer: false,
}).use(footnote);

md.renderer.rules.footnote_ref = (tokens, idx) => {
  const n = tokens[idx].meta.id + 1;
  const sub = tokens[idx].meta.subId > 0 ? `:${tokens[idx].meta.subId}` : '';
  return `<sup id="fnref:${n}${sub}"><a href="#fn:${n}" rel="footnote">${n}</a></sup>`;
};
md.renderer.rules.footnote_block_open = () => '<div class="footnotes">\n<hr />\n<ol>\n\n';
md.renderer.rules.footnote_block_close = () => '</ol>\n</div>\n';
md.renderer.rules.footnote_open = (tokens, idx) => `<li id="fn:${tokens[idx].meta.id + 1}">\n`;
md.renderer.rules.footnote_close = () => '</li>\n\n';
md.renderer.rules.footnote_anchor = (tokens, idx) => {
  const n = tokens[idx].meta.id + 1;
  const sub = tokens[idx].meta.subId > 0 ? `:${tokens[idx].meta.subId}` : '';
  return `&#160;<a href="#fnref:${n}${sub}" rev="footnote">&#8617;</a>`;
};

export function markdown(text) {
  return md.render(String(text ?? ''));
}
