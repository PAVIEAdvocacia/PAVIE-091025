// src/content/config.ts
import { defineCollection } from "astro:content";
import { postsCollection } from "./schemas/post";

export const collections = {
  posts: postsCollection,
};
