import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type SanityWebhookBody = {
  _type?: string;
  slug?: {
    current?: string;
  };
};

/**
 * Секрет должен совпадать с тем, который будет указан в Sanity webhook.
 */
const secret = process.env.SANITY_REVALIDATE_SECRET;

/**
 * Точечный тег конкретной статьи.
 * Должен совпадать с логикой в fetchers.ts.
 */
function getBlogPostTag(slug: string) {
  return `blogPost:${slug}`;
}

/**
 * Маппинг типов документов Sanity на теги Next.js.
 * Эти теги должны совпадать с теми, которые уже используются в fetchers.ts.
 */
function getTagsByType(type?: string): string[] {
  switch (type) {
    case "siteSettings":
      return ["settings"];

    case "videoCase":
      return ["videoCases"];

    case "photoCase":
      return ["photoCases"];

    case "blogPost":
      return ["blogPosts", "blogPost", "blogSlugs"];

    default:
      return [];
  }
}

export async function POST(req: NextRequest) {
  if (!secret) {
    console.error("[sanity-revalidate] Missing SANITY_REVALIDATE_SECRET");

    return NextResponse.json(
      { ok: false, message: "Missing SANITY_REVALIDATE_SECRET" },
      { status: 500 },
    );
  }

  try {
    /**
     * parseBody() проверяет подпись webhook.
     */
    const { isValidSignature, body } = await parseBody<SanityWebhookBody>(
      req,
      secret,
    );

    if (!isValidSignature) {
      console.warn("[sanity-revalidate] Invalid signature");

      return NextResponse.json(
        { ok: false, message: "Invalid signature" },
        { status: 401 },
      );
    }

    const docType = body?._type;
    const slug = body?.slug?.current;
    const tags = getTagsByType(docType);
    const resolvedTags =
      docType === "blogPost" && slug ? [...tags, getBlogPostTag(slug)] : tags;

    const revalidatedPaths: string[] = [];

    /**
     * Лог входящего webhook.
     * Это главный диагностический лог:
     * видно тип документа, slug и какие теги пойдут на revalidation.
     */
    console.info("[sanity-revalidate] Webhook received", {
      type: docType ?? null,
      slug: slug ?? null,
      tags: resolvedTags,
    });

    /**
     * Tag-based revalidation:
     * сбрасывает кэш всех fetch-запросов, помеченных соответствующими тегами.
     *
     * "max" — безопасный режим для текущей версии Next.js,
     * чтобы сборка не падала из-за сигнатуры функции.
     */
    for (const tag of tags) {
      revalidateTag(tag, "max");
    }

    /**
     * Для blogPost дополнительно сбрасываем точечный тег конкретной статьи.
     * Это позволяет обновлять slug-страницу более адресно.
     */
    if (docType === "blogPost" && slug) {
      revalidateTag(getBlogPostTag(slug), "max");
    }

    /**
     * Path-based revalidation:
     * дополнительно помечаем связанные страницы на пересборку
     * при следующем запросе.
     */
    if (docType === "blogPost") {
      revalidatePath("/blog");
      revalidatedPaths.push("/blog");

      if (slug) {
        const articlePath = `/blog/${slug}`;
        revalidatePath(articlePath);
        revalidatedPaths.push(articlePath);
      }
    }

    if (docType === "videoCase") {
      revalidatePath("/");
      revalidatePath("/cases");
      revalidatePath("/cases/video");

      revalidatedPaths.push("/", "/cases", "/cases/video");
    }

    if (docType === "photoCase") {
      revalidatePath("/");
      revalidatePath("/cases");
      revalidatePath("/cases/photo");

      revalidatedPaths.push("/", "/cases", "/cases/photo");
    }

    if (docType === "siteSettings") {
      revalidatePath("/");
      revalidatedPaths.push("/");
    }

    /**
     * Итоговый лог:
     * видно, что именно реально было отправлено на revalidation.
     */
    console.info("[sanity-revalidate] Revalidation completed", {
      type: docType ?? null,
      slug: slug ?? null,
      tags: resolvedTags,
      paths: revalidatedPaths,
    });

    return NextResponse.json({
      ok: true,
      revalidated: true,
      type: docType ?? null,
      slug: slug ?? null,
      tags: resolvedTags,
      paths: revalidatedPaths,
      now: Date.now(),
    });
  } catch (error) {
    console.error("[sanity-revalidate] failed:", error);

    return NextResponse.json(
      { ok: false, message: "Revalidation failed" },
      { status: 500 },
    );
  }
}
