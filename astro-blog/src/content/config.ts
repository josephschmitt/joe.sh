import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    short: z.string().optional(),
    date: z.date(),
    status: z.enum(['Published', 'Draft']).default('Draft'),
    theme: z.enum(['blue', 'purple', 'red', 'green', 'yellow', 'white', 'gray', 'darkblue']).optional(),
    code: z.boolean().default(false),
    heroImage: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
