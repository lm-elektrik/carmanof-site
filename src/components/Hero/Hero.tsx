"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.scss";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";

type IntroPhase = "idle" | "animating" | "done";

type HeroProps = {
  defaultImageSrc?: string;
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
  const [introPhase, setIntroPhase] = useState<IntroPhase>("idle");
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLoadHoverImage, setShouldLoadHoverImage] = useState(false);
  const [canUseHoverEffects, setCanUseHoverEffects] = useState(false);

  const autoTimerRef = useRef<number | null>(null);
  const idleCallbackRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const canHover =
      mediaQuery.matches &&
      !reducedMotionQuery.matches &&
      window.innerWidth > 1024;

    setCanUseHoverEffects(canHover);

    /**
     * 👉 MOBILE:
     * - нет hover
     * - показываем сразу финальную картинку
     * - никаких анимаций и второй загрузки
     */
    if (!canHover) {
      setIntroPhase("done");
      return;
    }

    /**
     * 👉 DESKTOP:
     * подгружаем hover-картинку в idle
     */
    const idleWindow = window as IdleWindow;

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleCallbackRef.current = idleWindow.requestIdleCallback(() => {
        setShouldLoadHoverImage(true);

        autoTimerRef.current = window.setTimeout(() => {
          setIntroPhase("animating");
        }, 400);
      });
    } else {
      autoTimerRef.current = window.setTimeout(() => {
        setShouldLoadHoverImage(true);

        autoTimerRef.current = window.setTimeout(() => {
          setIntroPhase("animating");
        }, 400);
      }, 2400);
    }

    return () => {
      if (autoTimerRef.current) {
        window.clearTimeout(autoTimerRef.current);
      }

      if (
        idleCallbackRef.current &&
        typeof idleWindow.cancelIdleCallback === "function"
      ) {
        idleWindow.cancelIdleCallback(idleCallbackRef.current);
      }
    };
  }, []);

  function handleIntroTransitionEnd() {
    if (introPhase === "animating") {
      setIntroPhase("done");
    }
  }

  function handleMouseEnter() {
    if (!canUseHoverEffects) return;

    setIsHovered(true);

    if (!shouldLoadHoverImage) {
      setShouldLoadHoverImage(true);
    }
  }

  function handleMouseLeave() {
    if (!canUseHoverEffects) return;

    setIsHovered(false);
  }

  const mediaClassName = [
    styles.media,
    introPhase === "idle" ? styles.stateDefault : "",
    introPhase === "animating" ? styles.toHover : "",
    introPhase === "done" && isHovered ? styles.showDefaultOnHover : "",
    introPhase === "done" && !isHovered ? styles.showHoverIdle : "",
  ]
    .filter(Boolean)
    .join(" ");

  /**
   * 🔥 КЛЮЧЕВАЯ ЛОГИКА:
   * на mobile используем сразу hoverImage как основную
   */
  const mainImageSrc = canUseHoverEffects ? defaultImageSrc : hoverImageSrc;

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
            {/* MAIN IMAGE */}
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

            {/* HOVER IMAGE ONLY DESKTOP */}
            {canUseHoverEffects && shouldLoadHoverImage ? (
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
