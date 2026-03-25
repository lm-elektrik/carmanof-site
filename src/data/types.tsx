export type VideoCase = {
  id: string;
  title: string;
  youtubeId: string;
};

export type PhotoCase = {
  id: string;
  title: string;
  imageSrc: string;
};

export type BlogArticleSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type BlogArticleContent = {
  intro: string;
  sections: BlogArticleSection[];
};

export type BlogArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  coverImage: string;
  content: BlogArticleContent;
};
