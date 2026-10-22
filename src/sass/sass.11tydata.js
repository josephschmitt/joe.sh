export default {
  eleventyExcludeFromCollections: true,
  permalink: (data) => `/assets/styles/${data.page.fileSlug}.css`,
};
