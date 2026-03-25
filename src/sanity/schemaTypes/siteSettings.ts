import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Настройки сайта",
  type: "document",
  fields: [
    defineField({
      name: "phone",
      title: "Телефон",
      type: "string",
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),

    defineField({
      name: "telegram",
      title: "Telegram",
      type: "url",
      description: "Ссылка на Telegram (например: https://t.me/username)",
    }),

    defineField({
      name: "vk",
      title: "VK",
      type: "url",
      description: "Ссылка на профиль VK",
    }),
  ],
});
