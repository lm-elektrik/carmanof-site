import { defineField, defineType } from "sanity";

export const videoCaseType = defineType({
  name: "videoCase",
  title: "Видео кейс",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Название кейса",
      type: "string",
      description:
        "Короткий заголовок для карточки. Рекомендуется до 42 символов.",
      validation: (Rule) => Rule.required().min(10).max(42),
    }),

    defineField({
      name: "description",
      title: "Описание кейса",
      type: "text",
      rows: 3,
      description:
        "Короткое описание для страницы кейсов. Лучше держать текст компактным.",
      validation: (Rule) => Rule.required().min(20).max(160),
    }),

    defineField({
      name: "youtubeId",
      title: "YouTube ID",
      type: "string",
      description: "Например: ANEqU44lHDI (только ID, не ссылка целиком)",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "order",
      title: "Порядок отображения",
      type: "number",
      description: "Меньше число = выше в списке",
      validation: (Rule) => Rule.required().integer().min(0),
    }),

    defineField({
      name: "isFeatured",
      title: "Показывать на главной",
      type: "boolean",
      description:
        "Если отмечены кейсы с этим флагом, на главной будут показаны они. Если не отмечен ни один — сайт возьмёт первые 3 по порядку.",
      initialValue: false,
    }),

    defineField({
      name: "isPublished",
      title: "Показывать на сайте",
      type: "boolean",
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "youtubeId",
      featured: "isFeatured",
      published: "isPublished",
    },
    prepare({ title, subtitle, featured, published }) {
      const meta: string[] = [];

      if (featured) meta.push("Главная");
      if (!published) meta.push("Скрыт");

      return {
        title,
        subtitle: [`YouTube: ${subtitle}`, ...meta].join(" • "),
      };
    },
  },
});
