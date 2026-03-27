import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type SanityWebhookBody = {
  _type?: string;
  slug?: {
    current?: string;
  };
  secret?: string;
};

const secret = process.env.SANITY_REVALIDATE_SECRET;

function getBlogPostTag(slug: string) {
  return `blogPost:${slug}`;
}

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
    const requestClone = req.clone();

    /**
     * Сначала пробуем стандартную проверку настоящего webhook от Sanity.
     * Она срабатывает только если пришла корректная подпись.
     */
    const { isValidSignature, body } = await parseBody<SanityWebhookBody>(
      req,
      secret,
    );

    let resolvedBody = body;

    /**
     * Временный fallback для ручных тестов и локальных скриптов:
     * если подпись невалидна, но в JSON body передан правильный secret,
     * считаем запрос доверенным.
     *
     * Это удобно для диагностики endpoint через node-скрипты.
     */
    if (!isValidSignature) {
      let manualBody: SanityWebhookBody | null = null;

      try {
        manualBody = await requestClone.json();
      } catch {
        manualBody = null;
      }

      if (!manualBody || manualBody.secret !== secret) {
        console.warn(
          "[sanity-revalidate] Invalid signature and invalid manual secret",
        );

        return NextResponse.json(
          { ok: false, message: "Invalid signature" },
          { status: 401 },
        );
      }

      resolvedBody = manualBody;

      console.info("[sanity-revalidate] Manual secret fallback used", {
        type: resolvedBody?._type ?? null,
        slug: resolvedBody?.slug?.current ?? null,
      });
    }

    const docType = resolvedBody?._type;
    const slug = resolvedBody?.slug?.current;
    const tags = getTagsByType(docType);
    const resolvedTags =
      docType === "blogPost" && slug ? [...tags, getBlogPostTag(slug)] : tags;

    const revalidatedPaths: string[] = [];

    console.info("[sanity-revalidate] Webhook received", {
      type: docType ?? null,
      slug: slug ?? null,
      tags: resolvedTags,
    });

    for (const tag of resolvedTags) {
      revalidateTag(tag, "max");
    }

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
