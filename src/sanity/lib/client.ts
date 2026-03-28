import { createClient } from "next-sanity";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

const projectId = getRequiredEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");
const dataset = getRequiredEnv("NEXT_PUBLIC_SANITY_DATASET");
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-25";

/**
 * Основной клиент для серверных запросов сайта.
 * Здесь включён CDN, потому что базовая скорость важна,
 * а актуальность данных контролируется через Next.js cache tags
 * и revalidation в fetch-слое.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/**
 * Отдельный клиент без CDN.
 * Нужен для чувствительных к свежести запросов:
 * например slug-списки, конкретные статьи и настройки сайта,
 * где лучше получить самые свежие опубликованные данные.
 */
export const clientNoCdn = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});
