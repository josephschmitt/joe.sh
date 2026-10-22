import { pageInfo, pageFiles, pageImages } from '../../lib/pages.js';

export default {
  layout: 'layouts/default.njk',
  eleventyComputed: {
    slug: (data) => pageInfo(data.page.inputPath).slug,
    num: (data) => pageInfo(data.page.inputPath).num,
    permalink: (data) => `/${pageInfo(data.page.inputPath).slug}/`,
    files: (data) => pageFiles(pageInfo(data.page.inputPath).dir),
    heroImage: (data) => {
      const { slug, dir } = pageInfo(data.page.inputPath);
      if (!pageFiles(dir).includes('hero.jpg')) return null;
      return { url: `/${slug}/hero.jpg`, ...(data.hero || {}) };
    },
    images: (data) => {
      if (data.kind !== 'gallery') return [];
      const { slug, dir } = pageInfo(data.page.inputPath);
      return pageImages(dir, `/${slug}/`);
    },
  },
};
