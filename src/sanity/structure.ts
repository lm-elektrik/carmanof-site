import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Контент")
    .items([
      // === КЕЙСЫ (основной продающий контент) ===
      S.listItem()
        .title("Видео кейсы")
        .schemaType("videoCase")
        .child(
          S.documentTypeList("videoCase")
            .title("Видео кейсы")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),

      S.listItem()
        .title("Фото кейсы")
        .schemaType("photoCase")
        .child(
          S.documentTypeList("photoCase")
            .title("Фото кейсы")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),

      S.divider(),

      // === БЛОГ (SEO-инструмент, не основной продукт) ===
      S.listItem()
        .title("Статьи (SEO)")
        .schemaType("blogPost")
        .child(
          S.documentTypeList("blogPost")
            .title("Статьи")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),

      S.divider(),

      // === НАСТРОЙКИ (singleton) ===
      S.listItem()
        .title("Настройки сайта")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
    ]);
