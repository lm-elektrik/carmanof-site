import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

/**
 * Берём тип источника изображения напрямую из сигнатуры builder.image().
 * Это самый устойчивый вариант:
 * - не завязаны на внутренние типы пакета
 * - не дублируем вручную форму объекта
 * - если библиотека обновит сигнатуру, TypeScript подхватит это автоматически
 */
export type SanityImageSource = Parameters<typeof builder.image>[0];

const DEFAULT_IMAGE_QUALITY = 80;

function isValidImageSource(
  source: SanityImageSource | undefined | null,
): source is SanityImageSource {
  return Boolean(source);
}

/**
 * Базовый helper для генерации URL через Sanity CDN.
 * Здесь держим единый quality и auto(format),
 * чтобы не раздувать логику по всему проекту.
 */
function buildOptimizedImageUrl(params: {
  source: SanityImageSource;
  width: number;
  height?: number;
  fit?: "crop" | "clip" | "fill" | "fillmax" | "max" | "scale" | "min";
}) {
  const { source, width, height, fit = "crop" } = params;

  let imageBuilder = builder
    .image(source)
    .width(width)
    .fit(fit)
    .auto("format")
    .quality(DEFAULT_IMAGE_QUALITY);

  if (height) {
    imageBuilder = imageBuilder.height(height);
  }

  return imageBuilder.url();
}

/**
 * Базовый builder для всех изображений Sanity.
 * Нужен там, где требуется ручная настройка в конкретном компоненте.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Hero:
 * визуальный блок 520x500,
 * для retina используем 2x.
 */
export function getHeroImageUrl(source: SanityImageSource | undefined | null) {
  if (!isValidImageSource(source)) {
    return "";
  }

  return buildOptimizedImageUrl({
    source,
    width: 1040,
    height: 1000,
    fit: "crop",
  });
}

/**
 * Верхний ряд MoreExamplesBlock:
 * 588x330 -> 2x = 1176x660
 */
export function getMoreExamplesTopImageUrl(
  source: SanityImageSource | undefined | null,
) {
  if (!isValidImageSource(source)) {
    return "";
  }

  return buildOptimizedImageUrl({
    source,
    width: 1176,
    height: 660,
    fit: "crop",
  });
}

/**
 * Нижний ряд MoreExamplesBlock:
 * 389x280 -> 2x = 778x560
 */
export function getMoreExamplesBottomImageUrl(
  source: SanityImageSource | undefined | null,
) {
  if (!isValidImageSource(source)) {
    return "";
  }

  return buildOptimizedImageUrl({
    source,
    width: 778,
    height: 560,
    fit: "crop",
  });
}

/**
 * Обложка статьи / крупный контент.
 */
export function getBlogCoverImageUrl(
  source: SanityImageSource | undefined | null,
) {
  if (!isValidImageSource(source)) {
    return "";
  }

  return buildOptimizedImageUrl({
    source,
    width: 1600,
    height: 900,
    fit: "crop",
  });
}

/**
 * Компактное изображение карточки.
 */
export function getCardImageUrl(source: SanityImageSource | undefined | null) {
  if (!isValidImageSource(source)) {
    return "";
  }

  return buildOptimizedImageUrl({
    source,
    width: 900,
    height: 675,
    fit: "crop",
  });
}
