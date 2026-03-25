import { defineField, defineType } from "sanity";

export const photoCaseType = defineType({
  name: "photoCase",
  title: "Фото кейс",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Название кейса",
      type: "string",
      validation: (Rule) => Rule.required().min(10).max(120),
    }),

    defineField({
      name: "image",
      title: "Изображение",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt текст",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
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
      name: "isPublished",
      title: "Показывать на сайте",
      type: "boolean",
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title,
        media,
      };
    },
  },
});