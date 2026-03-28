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

function isValidImageSource(
  source: SanityImageSource | undefined | null,
): source is SanityImageSource {
  return Boolean(source);
}

/**
 * Внутренний helper для единообразной генерации оптимизированных URL.
 * Так проще поддерживать формат, качество и fit в одном месте.
 */
function buildOptimizedImageUrl(params: {
  source: SanityImageSource;
  width: number;
  height?: number;
  fit?: "crop" | "clip" | "fill" | "fillmax" | "max" | "scale" | "min";
  quality?: number;
  format?: "webp" | "jpg" | "png";
}) {
  const {
    source,
    width,
    height,
    fit = "crop",
    quality = 80,
    format = "webp",
  } = params;

  let imageBuilder = builder.image(source).width(width).fit(fit);

  if (height) {
    imageBuilder = imageBuilder.height(height);
  }

  return imageBuilder.format(format).quality(quality).url();
}

/**
 * Базовый builder для всех изображений Sanity.
 * Оставляем универсальным, чтобы не ломать текущие места использования
 * в блоге, кейсах и других блоках.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Оптимизированный URL для Hero-изображений.
 *
 * Логика:
 * - визуальный размер блока: 520x500
 * - для retina-экранов отдаём 2x размер, чтобы картинка не выглядела мягкой
 * - формат webp уменьшает вес файла
 * - quality 80 даёт хороший баланс качества и размера
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
 * Верхний ряд MoreExamplesBlock.
 *
 * Реальный ratio карточки по SCSS:
 * 588 / 330 ≈ 1.7818
 *
 * Для чёткости на retina используем 2x:
 * 1176 / 660
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
 * Нижний ряд MoreExamplesBlock.
 *
 * Реальный ratio карточки по SCSS:
 * 389 / 280 ≈ 1.3893
 *
 * Для чёткости на retina используем 2x:
 * 778 / 560
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
 * Изображение обложки статьи / крупного контента.
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
