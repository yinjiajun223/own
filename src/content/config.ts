import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    img: z.string().optional(),
    img_alt: z.string().optional(),
    read: z.number().optional(),
  }),
});

const learning = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    read: z.number().optional(),
  }),
});

export const collections = {
  blog,
  learning,
};
