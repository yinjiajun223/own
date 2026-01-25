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

const leetcode = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    problemNumber: z.number(), // 题号
    tags: z.array(z.string()).optional(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
    leetcodeUrl: z.string().optional(),
    read: z.number().optional(),
  }),
});

export const collections = {
  blog,
  learning,
  leetcode,
};
