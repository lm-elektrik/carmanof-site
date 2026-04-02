import { groq } from "next-sanity";

/* =========================
   SITE SETTINGS
========================= */

export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    phone,
    email,
    telegram,
    whatsapp,
    vk,

    heroDefaultImage{
      alt,
      asset->{
        _id,
        url
      }
    },
    heroHoverImage{
      alt,
      asset->{
        _id,
        url
      }
    },

    moreExamplesImage01{
      alt,
      asset->{
        _id,
        url
      }
    },
    moreExamplesImage02{
      alt,
      asset->{
        _id,
        url
      }
    },
    moreExamplesImage03{
      alt,
      asset->{
        _id,
        url
      }
    },
    moreExamplesImage04{
      alt,
      asset->{
        _id,
        url
      }
    },
    moreExamplesImage05{
      alt,
      asset->{
        _id,
        url
      }
    },

    pricesItem01Title,
    pricesItem01Value,
    pricesItem02Title,
    pricesItem02Value,
    pricesItem03Title,
    pricesItem03Value,

    faqItems[]{
      question,
      answer
    }
  }
`;

/* =========================
   VIDEO CASES
========================= */

/**
 * Для страницы видео-кейсов ограничиваем выдачу первыми 18 элементами.
 * Главная страница отдельно выбирает 3 кейса через fetchers.ts.
 *
 * defined(order) добавлен для стабильной сортировки:
 * записи без order не должны случайно попадать в верх списка.
 */
export const videoCasesQuery = groq`
  *[
    _type == "videoCase" &&
    (!defined(isPublished) || isPublished == true) &&
    defined(order)
  ]
  | order(order asc)[0...18]{
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

/**
 * Для страницы фото-кейсов ограничиваем выдачу первыми 18 элементами.
 * Это лимит отображения на сайте, а не запрет на создание документов в Sanity.
 *
 * defined(order) нужен для предсказуемого порядка карточек.
 */
export const photoCasesQuery = groq`
  *[
    _type == "photoCase" &&
    (!defined(isPublished) || isPublished == true) &&
    defined(order)
  ]
  | order(order asc)[0...18]{
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

/**
 * Облегчённый запрос только для проверки:
 * есть ли вообще хотя бы один фото-кейс.
 *
 * Используем count(), чтобы не тянуть список карточек,
 * когда на главной нужна только булевая проверка.
 */
export const photoCasesExistQuery = groq`
  {
    "hasItems": count(
      *[
        _type == "photoCase" &&
        (!defined(isPublished) || isPublished == true) &&
        defined(order)
      ]
    ) > 0
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

/**
 * Явная сортировка нужна, чтобы generateStaticParams / slug-списки
 * были детерминированными и не "плавали" между запросами.
 */
export const blogPostSlugsQuery = groq`
  *[
    _type == "blogPost" &&
    defined(slug.current) &&
    defined(title) &&
    defined(excerpt) &&
    defined(publishedAt)
  ]
  | order(publishedAt desc){
    "slug": slug.current
  }
`;

/**
 * Даже если в CMS по ошибке появится дубль slug,
 * сортировка перед [0] делает выбор предсказуемым.
 */
export const blogPostBySlugQuery = groq`
  *[
    _type == "blogPost" &&
    slug.current == $slug &&
    defined(slug.current) &&
    defined(title) &&
    defined(excerpt) &&
    defined(publishedAt)
  ]
  | order(publishedAt desc)[0]{
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
