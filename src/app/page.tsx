import Hero from "@/components/Hero/Hero";
import MainOffer from "@/components/MainOffer/MainOffer";
import OtherWorks from "@/components/OtherWorks/OtherWorks";
import AdditionalElements from "@/components/AdditionalElements/AdditionalElements";
import VideoCaseBlock from "@/components/VideoCaseBlock/VideoCaseBlock";
import MoreExamplesBlock from "@/components/MoreExamplesBlock/MoreExamplesBlock";
import ProcessBlock from "@/components/ProcessBlock/ProcessBlock";
import TrustBlock from "@/components/TrustBlock/TrustBlock";
import Prices from "@/components/Prices/Prices";
import FAQ from "@/components/FAQ/FAQ";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";

import {
  getHomeVideoCases,
  getPhotoCases,
  getSiteSettings,
  type PhotoCase,
  type SiteSettings,
  type VideoCase,
  type SanityImage,
  type FAQItem,
} from "@/sanity/lib/fetchers";
import {
  getHeroImageUrl,
  getMoreExamplesTopImageUrl,
  getMoreExamplesBottomImageUrl,
} from "@/sanity/lib/image";

/**
 * Fallback revalidation для главной страницы.
 * Даже если webhook не сработает — страница обновится сама.
 *
 * Важно:
 * - не заменяет tag-based revalidation
 * - работает как страховка
 */
export const revalidate = 120;

type MoreExamplesImageItem = {
  src: string;
  alt: string;
};

type PriceItem = {
  title: string;
  value: string;
};

function buildHeroImage(params: {
  image?: SanityImage;
  fallbackSrc: string;
}): string {
  const { image, fallbackSrc } = params;

  return image ? getHeroImageUrl(image) : fallbackSrc;
}

function buildMoreExamplesImage(params: {
  image?: SanityImage;
  fallbackSrc: string;
  fallbackAlt: string;
  row: "top" | "bottom";
}): MoreExamplesImageItem {
  const { image, fallbackSrc, fallbackAlt, row } = params;

  const optimizedSrc = image
    ? row === "top"
      ? getMoreExamplesTopImageUrl(image)
      : getMoreExamplesBottomImageUrl(image)
    : fallbackSrc;

  return {
    src: optimizedSrc,
    alt: image?.alt || fallbackAlt,
  };
}

function buildPriceItem(params: {
  title?: string;
  value?: string;
  fallbackTitle: string;
  fallbackValue: string;
}): PriceItem {
  const { title, value, fallbackTitle, fallbackValue } = params;

  return {
    title: title || fallbackTitle,
    value: value || fallbackValue,
  };
}

function buildFaqItem(params: {
  item?: FAQItem;
  fallbackQuestion: string;
  fallbackAnswer: string;
}): FAQItem {
  const { item, fallbackQuestion, fallbackAnswer } = params;

  return {
    question: item?.question || fallbackQuestion,
    answer: item?.answer || fallbackAnswer,
  };
}

export default async function HomePage() {
  /**
   * Используем Promise.allSettled вместо Promise.all:
   * если один запрос к Sanity временно упадёт,
   * остальные блоки страницы всё равно продолжат работать.
   */
  const [settingsResult, videoCasesResult, photoCasesResult] =
    await Promise.allSettled([
      getSiteSettings(),
      getHomeVideoCases(),
      getPhotoCases(),
    ]);

  const settings: SiteSettings =
    settingsResult.status === "fulfilled" ? settingsResult.value : null;

  const videoCases: VideoCase[] =
    videoCasesResult.status === "fulfilled" ? videoCasesResult.value : [];

  const photoCases: PhotoCase[] =
    photoCasesResult.status === "fulfilled" ? photoCasesResult.value : [];

  if (settingsResult.status === "rejected") {
    console.error("HomePage siteSettings error:", settingsResult.reason);
  }

  if (videoCasesResult.status === "rejected") {
    console.error("HomePage videoCases error:", videoCasesResult.reason);
  }

  if (photoCasesResult.status === "rejected") {
    console.error("HomePage photoCases error:", photoCasesResult.reason);
  }

  /**
   * Кнопка перехода в хаб кейсов должна быть активна,
   * если на сайте есть хотя бы один кейс любого типа:
   * видео или фото.
   */
  const hasCases = videoCases.length > 0 || photoCases.length > 0;

  /**
   * Hero-картинки:
   * - если поле заполнено в Sanity, отдаём оптимизированную версию
   *   через getHeroImageUrl()
   * - если поле пустое, используем локальный fallback из /public
   */
  const heroDefaultImageSrc = buildHeroImage({
    image: settings?.heroDefaultImage,
    fallbackSrc: "/images/hero/hero-default.webp",
  });

  const heroHoverImageSrc = buildHeroImage({
    image: settings?.heroHoverImage,
    fallbackSrc: "/images/hero/hero-hover.webp",
  });

  /**
   * 5 изображений блока MoreExamplesBlock.
   * Порядок фиксированный: 2 сверху и 3 снизу.
   * Верхний и нижний ряд используют разные пресеты кропа,
   * чтобы сетка выглядела аккуратнее при разном визуальном весе карточек.
   */
  const moreExamplesImages = [
    buildMoreExamplesImage({
      image: settings?.moreExamplesImage01,
      fallbackSrc: "/images/more-examples/example-01-v2.webp",
      fallbackAlt: "Пример работы 1",
      row: "top",
    }),
    buildMoreExamplesImage({
      image: settings?.moreExamplesImage02,
      fallbackSrc: "/images/more-examples/example-02-v2.webp",
      fallbackAlt: "Пример работы 2",
      row: "top",
    }),
    buildMoreExamplesImage({
      image: settings?.moreExamplesImage03,
      fallbackSrc: "/images/more-examples/example-03-v2.webp",
      fallbackAlt: "Пример работы 3",
      row: "bottom",
    }),
    buildMoreExamplesImage({
      image: settings?.moreExamplesImage04,
      fallbackSrc: "/images/more-examples/example-04-v2.webp",
      fallbackAlt: "Пример работы 4",
      row: "bottom",
    }),
    buildMoreExamplesImage({
      image: settings?.moreExamplesImage05,
      fallbackSrc: "/images/more-examples/example-05-v2.webp",
      fallbackAlt: "Пример работы 5",
      row: "bottom",
    }),
  ];

  /**
   * 3 позиции блока Prices.
   * В админке меняются только:
   * - вид работы
   * - число
   *
   * На сайте префикс "от" и символ "₽" добавляются в компоненте,
   * поэтому здесь держим только чистое значение.
   */
  const priceItems = [
    buildPriceItem({
      title: settings?.pricesItem01Title,
      value: settings?.pricesItem01Value,
      fallbackTitle: "Накладки",
      fallbackValue: "7 000",
    }),
    buildPriceItem({
      title: settings?.pricesItem02Title,
      value: settings?.pricesItem02Value,
      fallbackTitle: "Пересвет",
      fallbackValue: "3 500",
    }),
    buildPriceItem({
      title: settings?.pricesItem03Title,
      value: settings?.pricesItem03Value,
      fallbackTitle: "Ремонт",
      fallbackValue: "2 500",
    }),
  ];

  /**
   * FAQ:
   * - если в Sanity есть массив faqItems, берём его
   * - если массив пустой или не заполнен, используем fallback из 5 вопросов
   */
  const faqItems = [
    buildFaqItem({
      item: settings?.faqItems?.[0],
      fallbackQuestion:
        "Как отправить приборную панель и что нужно подготовить?",
      fallbackAnswer:
        "Перед отправкой свяжитесь с нами, уточните модель панели и аккуратно упакуйте её. После согласования подскажем, что приложить и куда отправлять.",
    }),
    buildFaqItem({
      item: settings?.faqItems?.[1],
      fallbackQuestion:
        "Можно ли изготовить шкалы по фото без отправки оригинала?",
      fallbackAnswer:
        "В некоторых случаях макет можно подготовить по фото, если хорошо видны детали. Но для точного совпадения по размерам иногда нужен оригинал.",
    }),
    buildFaqItem({
      item: settings?.faqItems?.[2],
      fallbackQuestion: "Сколько занимает работа и как согласовывается макет?",
      fallbackAnswer:
        "Срок зависит от задачи и состояния панели. Перед запуском мы согласовываем детали, чтобы вы понимали этапы работы и ожидаемый результат.",
    }),
    buildFaqItem({
      item: settings?.faqItems?.[3],
      fallbackQuestion:
        "Работаете ли вы по всей России и как происходит отправка?",
      fallbackAnswer:
        "Да, работаем по всей России. Отправка и возврат выполняются через СДЭК после согласования деталей и подтверждения работ.",
    }),
    buildFaqItem({
      item: settings?.faqItems?.[4],
      fallbackQuestion: "Можно ли сделать шкалы по индивидуальному дизайну?",
      fallbackAnswer:
        "Да, можем подготовить шкалы под конкретную модель, нужную графику и желаемый внешний вид. Перед запуском согласовываем макет, чтобы результат был ожидаемым.",
    }),
  ];

  return (
    <>
      <Hero
        defaultImageSrc={heroDefaultImageSrc}
        hoverImageSrc={heroHoverImageSrc}
      />
      <VideoCaseBlock videoCases={videoCases} />
      <MainOffer />
      <OtherWorks hasCases={hasCases} />
      <AdditionalElements />
      <ProcessBlock />
      <MoreExamplesBlock images={moreExamplesImages} />
      <TrustBlock />
      <Prices items={priceItems} />
      <FAQ items={faqItems} />
      <Contact settings={settings} />
      <Footer />
    </>
  );
}
