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

export default function Hero({
  defaultImageSrc = "/images/hero/hero-default.webp",
  hoverImageSrc = "/images/hero/hero-hover.webp",
}: HeroProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("mobile");
  const [introPhase, setIntroPhase] = useState<IntroPhase>("done");
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLoadHoverImage, setShouldLoadHoverImage] = useState(false);

  const introTimerRef = useRef<number | null>(null);

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
     * - сохраняем привычную механику
     * - default картинка видна сразу
     * - hover картинку подключаем
     * - анимация стартует через 1.2с, как было задумано
     */
    setDeviceMode("desktop");
    setIntroPhase("idle");
    setShouldLoadHoverImage(true);

    introTimerRef.current = window.setTimeout(() => {
      setIntroPhase("animating");
    }, 1200);

    return () => {
      if (introTimerRef.current) {
        window.clearTimeout(introTimerRef.current);
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
   * - сразу показываем финальный hover-вариант
   *
   * DESKTOP:
   * - основной первый кадр = default
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
