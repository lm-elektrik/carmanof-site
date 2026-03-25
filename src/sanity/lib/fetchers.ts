import { client } from "./client";
import {
  siteSettingsQuery,
  videoCasesQuery,
  photoCasesQuery,
  blogPostsQuery,
  blogPostBySlugQuery,
  blogPostSlugsQuery,
} from "./queries";

/* =========================
   TYPES
========================= */

export type SiteSettings = {
  phone?: string;
  email?: string;
  telegram?: string;
  vk?: string;
} | null;

export type SanityImageAsset = {
  _id?: string;
  url?: string;
};

export type BlogImage = {
  alt?: string;
  asset?: SanityImageAsset;
};

export type PhotoCaseImage = {
  alt?: string;
  asset?: SanityImageAsset;
};

export type VideoCase = {
  _id: string;
  title: string;
  description: string;
  youtubeId: string;
  order: number;
  isFeatured?: boolean;
};

export type PhotoCase = {
  _id: string;
  title: string;
  order: number;
  image?: PhotoCaseImage;
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: BlogImage;
};

export type BlogPostSlug = {
  slug: string;
};

export type PortableTextBlock = {
  _key?: string;
  _type: string;
  [key: string]: unknown;
};

export type BlogArticle = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  coverImage?: BlogImage;
  content?: PortableTextBlock[];
};

/* =========================
   SAFE FETCH
========================= */

async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  try {
    return await client.fetch<T>(query, params, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return fallback;
  }
}

/* =========================
   SITE SETTINGS
========================= */

export async function getSiteSettings(): Promise<SiteSettings> {
  return safeFetch<SiteSettings>(siteSettingsQuery, {}, null);
}

/* =========================
   VIDEO CASES
========================= */

export async function getVideoCases(): Promise<VideoCase[]> {
  return safeFetch<VideoCase[]>(videoCasesQuery, {}, []);
}

export async function getHomeVideoCases(): Promise<VideoCase[]> {
  const videoCases = await getVideoCases();

  const featuredCases = videoCases.filter((item) => item.isFeatured);

  if (featuredCases.length >= 3) {
    return featuredCases.slice(0, 3);
  }

  if (featuredCases.length > 0) {
    const featuredIds = new Set(featuredCases.map((item) => item._id));
    const fallbackCases = videoCases.filter(
      (item) => !featuredIds.has(item._id),
    );

    return [...featuredCases, ...fallbackCases].slice(0, 3);
  }

  return videoCases.slice(0, 3);
}

/* =========================
   PHOTO CASES
========================= */

export async function getPhotoCases(): Promise<PhotoCase[]> {
  return safeFetch<PhotoCase[]>(photoCasesQuery, {}, []);
}

/* =========================
   BLOG
========================= */

export async function getBlogPosts(): Promise<BlogPost[]> {
  return safeFetch<BlogPost[]>(blogPostsQuery, {}, []);
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogArticle | null> {
  return safeFetch<BlogArticle | null>(blogPostBySlugQuery, { slug }, null);
}

export async function getBlogPostSlugs(): Promise<BlogPostSlug[]> {
  return safeFetch<BlogPostSlug[]>(blogPostSlugsQuery, {}, []);
}
