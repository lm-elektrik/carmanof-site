"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.scss";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";

type IntroPhase = "idle" | "animating" | "done";
type DeviceMode = "mobile" | "desktop";

type HeroProps = {
  /**
   * Картинка Hero для обычного состояния ("до").
   * Если из Sanity ничего не пришло — используем локальный fallback.
   */
  defaultImageSrc?: string;

  /**
   * Картинка Hero для второго состояния ("после").
   * Если из Sanity ничего не пришло — используем локальный fallback.
   */
  hoverImageSrc?: string;
};

const HERO_IMAGE_SIZES =
  "(max-width: 640px) calc(100vw - 28px), (max-width: 1024px) calc(100vw - 64px), (max-width: 1240px) 480px, 520px";

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export default function Hero({
  defaultImageSrc = "/images/hero/hero-default.webp",
  hoverImageSrc = "/images/hero/hero-hover.webp",
}: HeroProps) {
  /**
   * По умолчанию держим mobile-сценарий:
   * одна финальная картинка, без анимации.
   * Это безопаснее для LCP и соответствует тому,
   * что ты хочешь видеть на touch-устройствах.
   */
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("mobile");
  const [introPhase, setIntroPhase] = useState<IntroPhase>("done");
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLoadHoverImage, setShouldLoadHoverImage] = useState(false);

  const introTimerRef = useRef<number | null>(null);
  const idleCallbackRef = useRef<number | null>(null);

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const isDesktopHoverDevice =
      hoverQuery.matches &&
      !reducedMotionQuery.matches &&
      window.innerWidth > 1024;

    /**
     * MOBILE / TOUCH:
     * - сразу финальная картинка
     * - без анимации
     * - без второй картинки
     */
    if (!isDesktopHoverDevice) {
      setDeviceMode("mobile");
      setIntroPhase("done");
      setShouldLoadHoverImage(false);
      return;
    }

    /**
     * DESKTOP:
     * - базовая картинка = default
     * - hover-картинку подгружаем позже
     * - затем запускаем intro-анимацию
     */
    setDeviceMode("desktop");
    setIntroPhase("idle");

    const idleWindow = window as IdleWindow;

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleCallbackRef.current = idleWindow.requestIdleCallback(() => {
        setShouldLoadHoverImage(true);

        introTimerRef.current = window.setTimeout(() => {
          setIntroPhase("animating");
        }, 400);
      });
    } else {
      introTimerRef.current = window.setTimeout(() => {
        setShouldLoadHoverImage(true);

        introTimerRef.current = window.setTimeout(() => {
          setIntroPhase("animating");
        }, 400);
      }, 2200);
    }

    return () => {
      if (introTimerRef.current) {
        window.clearTimeout(introTimerRef.current);
      }

      if (
        idleCallbackRef.current !== null &&
        typeof idleWindow.cancelIdleCallback === "function"
      ) {
        idleWindow.cancelIdleCallback(idleCallbackRef.current);
      }
    };
  }, []);

  function handleIntroTransitionEnd() {
    if (deviceMode === "desktop" && introPhase === "animating") {
      setIntroPhase("done");
    }
  }

  function handleMouseEnter() {
    if (deviceMode !== "desktop") {
      return;
    }

    setIsHovered(true);

    if (!shouldLoadHoverImage) {
      setShouldLoadHoverImage(true);
    }
  }

  function handleMouseLeave() {
    if (deviceMode !== "desktop") {
      return;
    }

    setIsHovered(false);
  }

  const mediaClassName = [
    styles.media,
    deviceMode === "desktop" && introPhase === "idle"
      ? styles.stateDefault
      : "",
    deviceMode === "desktop" && introPhase === "animating"
      ? styles.toHover
      : "",
    deviceMode === "desktop" && introPhase === "done" && isHovered
      ? styles.showDefaultOnHover
      : "",
    deviceMode === "desktop" && introPhase === "done" && !isHovered
      ? styles.showHoverIdle
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  /**
   * MOBILE:
   * - сразу финальный hover-вариант
   *
   * DESKTOP:
   * - сначала default-вариант
   */
  const mainImageSrc =
    deviceMode === "mobile" ? hoverImageSrc : defaultImageSrc;

  return (
    <section className={styles.hero} id="home">
      <Container>
        <div className={styles.card}>
          <div className={styles.content}>
            <div className={styles.textBlock}>
              <h1 className={styles.title}>
                ПРОФЕССИОНАЛЬНЫЙ <br />
                ТЮНИНГ ПРИБОРНЫХ <br />
                ПАНЕЛЕЙ АВТО
              </h1>

              <p className={styles.description}>
                Кастомные шкалы, идеальная точность, <br />
                эксклюзивный дизайн
              </p>

              <p className={styles.caption}>
                Работаем по всей России — отправка СДЭК
              </p>
            </div>

            <div className={styles.actions}>
              <Button href="#contact" variant="primary" size="sm">
                Узнать подробнее
              </Button>

              <Button href="#cases" variant="secondary" size="sm">
                Смотреть работы
              </Button>
            </div>
          </div>

          <div
            className={mediaClassName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.imageBase}>
              <Image
                src={mainImageSrc}
                alt="Пример тюнинга приборной панели Carmanof"
                fill
                priority
                fetchPriority="high"
                sizes={HERO_IMAGE_SIZES}
                className={styles.imageElement}
              />
            </div>

            {deviceMode === "desktop" && shouldLoadHoverImage ? (
              <div
                className={styles.imageHover}
                onTransitionEnd={handleIntroTransitionEnd}
              >
                <Image
                  src={hoverImageSrc}
                  alt=""
                  fill
                  sizes={HERO_IMAGE_SIZES}
                  className={styles.imageElement}
                />
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
