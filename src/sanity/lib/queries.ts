import { groq } from "next-sanity";

/* =========================
   SITE SETTINGS
========================= */

export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    phone,
    email,
    telegram,
    vk
  }
`;

/* =========================
   VIDEO CASES
========================= */

export const videoCasesQuery = groq`
  *[
    _type == "videoCase" &&
    (!defined(isPublished) || isPublished == true)
  ]
  | order(order asc){
    _id,
    title,
    description,
    youtubeId,
    order,
    isFeatured
  }
`;

/* =========================
   PHOTO CASES
========================= */

export const photoCasesQuery = groq`
  *[
    _type == "photoCase" &&
    (!defined(isPublished) || isPublished == true)
  ]
  | order(order asc){
    _id,
    title,
    order,
    image{
      alt,
      asset->{
        _id,
        url
      }
    }
  }
`;

/* =========================
   BLOG
========================= */

export const blogPostsQuery = groq`
  *[
    _type == "blogPost" &&
    defined(slug.current) &&
    defined(title) &&
    defined(excerpt) &&
    defined(publishedAt)
  ]
  | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage{
      alt,
      asset->{
        _id,
        url
      }
    }
  }
`;

export const blogPostSlugsQuery = groq`
  *[
    _type == "blogPost" &&
    defined(slug.current) &&
    defined(title) &&
    defined(excerpt) &&
    defined(publishedAt)
  ]{
    "slug": slug.current
  }
`;

export const blogPostBySlugQuery = groq`
  *[
    _type == "blogPost" &&
    slug.current == $slug &&
    defined(slug.current) &&
    defined(title) &&
    defined(excerpt) &&
    defined(publishedAt)
  ][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    seoTitle,
    seoDescription,
    coverImage{
      alt,
      asset->{
        _id,
        url
      }
    },
    content
  }
`;
