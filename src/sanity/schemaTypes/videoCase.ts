import React from "react";
import { defineField, defineType } from "sanity";
import { LimitedCaseBooleanInput } from "../components/caseControls";

const SANITY_API_VERSION = "2026-03-25";
const MAX_VISIBLE_VIDEO_CASES = 18;
const MAX_FEATURED_VIDEO_CASES = 3;

function getYoutubeThumbnail(youtubeId?: string) {
  if (!youtubeId) {
    return null;
  }

  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

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
      description:
        "Меньше число = выше в списке. Сайт сортирует кейсы по этому полю.",
      validation: (Rule) => Rule.required().integer().min(0),
    }),

    defineField({
      name: "isFeatured",
      title: "Показывать на главной",
      type: "boolean",
      description:
        "На главной показываются только отмеченные кейсы. Максимум 3.",
      initialValue: false,
      components: {
        input: (props) =>
          React.createElement(LimitedCaseBooleanInput, {
            ...props,
            documentType: "videoCase",
            fieldName: "isFeatured",
            limit: MAX_FEATURED_VIDEO_CASES,
            activeFilter: "isFeatured == true",
            enabledDescription: "Пока лимит не набран, переключатель доступен.",
            limitReachedDescription: "Лимит кейсов для главной уже достигнут.",
          }),
      },
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (value !== true) return true;

          const documentId = context.document?._id;
          if (!documentId) return true;

          const publishedId = documentId.replace(/^drafts\./, "");
          const draftId = `drafts.${publishedId}`;

          const client = context
            .getClient({ apiVersion: SANITY_API_VERSION })
            .withConfig({ perspective: "published" });

          const count = await client.fetch<number>(
            `
              count(
                *[
                  _type == "videoCase" &&
                  isFeatured == true &&
                  _id != $publishedId &&
                  _id != $draftId
                ]
              )
            `,
            { publishedId, draftId },
          );

          if (count >= MAX_FEATURED_VIDEO_CASES) {
            return `На главной уже ${MAX_FEATURED_VIDEO_CASES} кейса. Убери один перед добавлением нового.`;
          }

          return true;
        }),
    }),

    defineField({
      name: "isPublished",
      title: "Показывать в списках сайта",
      type: "boolean",
      description:
        "Максимум 18 кейсов одновременно могут быть показаны на сайте.",
      initialValue: true,
      components: {
        input: (props) =>
          React.createElement(LimitedCaseBooleanInput, {
            ...props,
            documentType: "videoCase",
            fieldName: "isPublished",
            limit: MAX_VISIBLE_VIDEO_CASES,
            activeFilter: "(!defined(isPublished) || isPublished == true)",
            enabledDescription: "Пока лимит не набран, переключатель доступен.",
            limitReachedDescription: "Лимит кейсов для сайта уже достигнут.",
          }),
      },
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          if (value !== true) return true;

          const documentId = context.document?._id;
          if (!documentId) return true;

          const publishedId = documentId.replace(/^drafts\./, "");
          const draftId = `drafts.${publishedId}`;

          const client = context
            .getClient({ apiVersion: SANITY_API_VERSION })
            .withConfig({ perspective: "published" });

          const count = await client.fetch<number>(
            `
              count(
                *[
                  _type == "videoCase" &&
                  (!defined(isPublished) || isPublished == true) &&
                  _id != $publishedId &&
                  _id != $draftId
                ]
              )
            `,
            { publishedId, draftId },
          );

          if (count >= MAX_VISIBLE_VIDEO_CASES) {
            return `На сайте уже ${MAX_VISIBLE_VIDEO_CASES} кейсов.`;
          }

          return true;
        }),
    }),
  ],

  preview: {
    select: {
      title: "title",
      youtubeId: "youtubeId",
      featured: "isFeatured",
      published: "isPublished",
      order: "order",
    },

    prepare({ title, youtubeId, featured, published, order }) {
      const meta: string[] = [];

      if (featured && published) {
        meta.push("🟣 На главной");
      } else if (published) {
        meta.push("🟢 На сайте");
      } else {
        meta.push("🟡 Скрыт");
      }

      meta.push(`№${order}`);

      const thumbnailUrl = getYoutubeThumbnail(youtubeId);

      return {
        title,
        subtitle: [`YouTube: ${youtubeId}`, ...meta].join(" • "),
        media: thumbnailUrl
          ? React.createElement("img", {
              src: thumbnailUrl,
              alt: "",
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              },
            })
          : undefined,
      };
    },
  },
});
