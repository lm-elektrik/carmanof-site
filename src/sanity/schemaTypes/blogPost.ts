import { defineArrayMember, defineField, defineType } from "sanity";

export const blogPostType = defineType({
  name: "blogPost",
  title: "Статья блога",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Заголовок",
      type: "string",
      description:
        "Основной заголовок статьи под поисковый запрос. Желательно ясно отвечать на вопрос пользователя.",
      validation: (Rule) => Rule.required().min(10).max(120),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      description:
        "URL статьи. Должен быть понятным, коротким и формироваться от заголовка.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Краткое описание",
      type: "text",
      rows: 3,
      description:
        "Короткий лид статьи. Используется в списке статей и как запасной description, если SEO description не заполнен.",
      validation: (Rule) => Rule.required().min(50).max(220),
    }),

    defineField({
      name: "publishedAt",
      title: "Дата публикации",
      type: "datetime",
      description: "Дата публикации статьи для сортировки и индексации.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "coverImage",
      title: "Обложка статьи",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt текст",
          type: "string",
          description:
            "Краткое описание изображения для доступности и поисковых систем.",
          validation: (Rule) => Rule.required().min(5).max(140),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      description:
        "Необязательно. Если пусто, на сайте будет использован основной заголовок статьи.",
      validation: (Rule) => Rule.max(70),
    }),

    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      description:
        "Необязательно. Если пусто, на сайте будет использован excerpt.",
      validation: (Rule) => Rule.max(160),
    }),

    defineField({
      name: "content",
      title: "Содержимое статьи",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Обычный текст", value: "normal" },
            { title: "Заголовок H2", value: "h2" },
            { title: "Заголовок H3", value: "h3" },
            { title: "Цитата", value: "blockquote" },
          ],
          lists: [
            { title: "Маркированный список", value: "bullet" },
            { title: "Нумерованный список", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Жирный", value: "strong" },
              { title: "Курсив", value: "em" },
            ],
            annotations: [],
          },
        }),
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alt текст",
              type: "string",
              description:
                "Обязателен для изображений внутри статьи. Кратко описывает, что на картинке.",
              validation: (Rule) => Rule.required().min(5).max(140),
            }),
            defineField({
              name: "caption",
              title: "Подпись",
              type: "string",
              description:
                "Необязательно. Короткая подпись под изображением, если она нужна по смыслу.",
              validation: (Rule) => Rule.max(180),
            }),
          ],
        }),
      ],
      validation: (Rule) =>
        Rule.required().min(1).error("Добавьте содержимое статьи."),
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "coverImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString("ru-RU")
          : "Без даты публикации",
        media,
      };
    },
  },
});
