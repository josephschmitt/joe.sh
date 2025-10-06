import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const publishedPosts = posts
    .filter(post => post.data.status === 'Published')
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Joe Schmitt',
    description: 'Hi, my name is Joe, I build things with my mind.',
    site: context.site!,
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.subtitle || '',
      pubDate: post.data.date,
      link: `/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
