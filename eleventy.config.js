import path from 'node:path';
import * as sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import * as esbuild from 'esbuild';
import { md, markdown } from './lib/markdown.js';
import { kirbytext, kirbytextPreprocess, excerpt, html } from './lib/kirbytext.js';
import { phpDate } from './lib/dates.js';
import { pageInfo, pageFiles, pageAssetMap, tinyHash } from './lib/pages.js';

export default function (eleventyConfig) {
  eleventyConfig.setLibrary('md', md);
  eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: false });
  eleventyConfig.ignores.add('src/tweets/**');

  // Static assets, the old Twitter archive, and every file that sits next to a post
  // (images, downloads) published at /<slug>/<file>, as Kirby did under /content/.
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets', 'src/tweets': 'tweets' });
  eleventyConfig.addPassthroughCopy(pageAssetMap('src'));

  // Sass: src/sass/*.scss compiles to /assets/styles/*.css (see src/sass/sass.11tydata.js),
  // then runs through autoprefixer for the browsers in package.json's browserslist.
  eleventyConfig.addTemplateFormats('scss');
  eleventyConfig.addExtension('scss', {
    outputFileExtension: 'css',
    compile(inputContent, inputPath) {
      const parsed = path.parse(inputPath);
      if (parsed.name.startsWith('_')) return;
      const result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir],
        style: 'compressed',
        quietDeps: true,
      });
      this.addDependencies(inputPath, result.loadedUrls);
      return async () => {
        const processed = await postcss([autoprefixer]).process(result.css, { from: undefined });
        return processed.css;
      };
    },
  });

  // JavaScript: each file in src/scripts is an esbuild entry point, bundled and minified
  // into /assets/scripts/<name>.js.
  eleventyConfig.addWatchTarget('src/scripts/');
  eleventyConfig.on('eleventy.before', async ({ dir }) => {
    await esbuild.build({
      entryPoints: ['src/scripts/gallery.js'],
      bundle: true,
      minify: true,
      target: 'es2018',
      outdir: path.join(dir.output, 'assets/scripts'),
    });
  });

  // Kirby content tags like (figure: ...) are expanded before markdown rendering.
  eleventyConfig.addPreprocessor('kirbytext', 'md', (data, content) => {
    const { slug, dir } = pageInfo(data.page.inputPath);
    return kirbytextPreprocess(content, { url: `/${slug}/`, files: pageFiles(dir) });
  });

  eleventyConfig.addFilter('kirbytext', (text, url, files) => kirbytext(text, { url, files }));
  eleventyConfig.addFilter('markdown', (text) => markdown(text));
  eleventyConfig.addFilter('excerpt', (text, chars = 140) => excerpt(text, chars));
  eleventyConfig.addFilter('html', (text) => html(text));
  eleventyConfig.addFilter('xml', (text) => html(text).replace(/'/g, '&#039;'));
  eleventyConfig.addFilter('date', (date, format) => phpDate(date, format));
  eleventyConfig.addFilter('tinyhash', (uri) => tinyHash(uri));
  eleventyConfig.addFilter('absoluteUrls', (content, base) =>
    String(content).replace(/(src|href)="\/(?!\/)/g, `$1="${base}/`));

  const showDrafts = process.env.ELEVENTY_RUN_MODE === 'serve' || process.env.SHOW_DRAFTS === '1';

  eleventyConfig.addCollection('posts', (api) =>
    api.getFilteredByGlob('src/posts/*/index.md').sort((a, b) => b.data.num - a.data.num));
  eleventyConfig.addCollection('published', (api) =>
    api.getFilteredByGlob('src/posts/*/index.md')
      .filter((p) => p.data.status === 'Published')
      .sort((a, b) => b.data.num - a.data.num));
  eleventyConfig.addCollection('menu', (api) =>
    api.getFilteredByGlob('src/posts/*/index.md')
      .filter((p) => showDrafts || p.data.status === 'Published')
      .sort((a, b) => b.data.num - a.data.num));
  eleventyConfig.addCollection('redirectable', (api) =>
    api.getFilteredByGlob(['src/posts/*/index.md', 'src/pages/*/index.md']));

  eleventyConfig.addGlobalData('buildTime', () => new Date());

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    markdownTemplateEngine: false,
    htmlTemplateEngine: 'njk',
    templateFormats: ['md', 'njk', 'html'],
  };
}
