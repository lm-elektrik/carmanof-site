"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./VideoCaseBlock.module.scss";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";

type VideoTheme = "bmw" | "audi" | "mercedes";

type VideoCase = {
  id: string;
  title: string;
  youtubeId: string;
  theme: VideoTheme;
};

const videoCases: VideoCase[] = [
  {
    id: "bmw-e60",
    title: "Кастомные шкалы BMW E60",
    youtubeId: "_Mt3SlSkAiM",
    theme: "bmw",
  },
  {
    id: "audi-a4",
    title: "Кастомные шкалы и обновлённый стиль приборной панели",
    youtubeId: "mrSF0nOEoXg",
    theme: "audi",
  },
  {
    id: "mercedes-w204",
    title: "Mercedes W204",
    youtubeId: "YQGjh8H50lk",
    theme: "mercedes",
  },
];

const PREVIEW_TEXT_LIMIT = 44;

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trimEnd()}…`;
}

function getYoutubeThumbnail(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

export default function VideoCaseBlock() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <section id="cases" className={styles.section}>
      <Container>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>Видео примеры работ</h2>

          <p className={styles.description}>
            Несколько примеров приборных панелей, с которыми мы уже работали.
          </p>

          <div className={styles.cards}>
            {videoCases.map((item) => {
              const isActive = activeVideoId === item.id;

              const previewThemeClass =
                item.theme === "bmw"
                  ? styles.themeBmw
                  : item.theme === "audi"
                    ? styles.themeAudi
                    : styles.themeMercedes;

              return (
                <article key={item.id} className={styles.card}>
                  {isActive ? (
                    <iframe
                      className={styles.iframe}
                      src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
                      title={item.title}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      className={`${styles.previewButton} ${previewThemeClass}`}
                      onClick={() => setActiveVideoId(item.id)}
                      aria-label={`Открыть видео: ${item.title}`}
                    >
                      <img
                        src={getYoutubeThumbnail(item.youtubeId)}
                        alt={item.title}
                        className={styles.previewImage}
                        loading="lazy"
                      />

                      <span className={styles.previewOverlay} />
                      <span className={styles.previewGlow} />

                      <span className={styles.previewMeta}>
                        <span className={styles.previewMetaBottom}>
                          {truncateText(item.title, PREVIEW_TEXT_LIMIT)}
                        </span>
                      </span>

                      <span className={styles.playButton}>
                        <Image
                          src="/icons/video-case-block/play.svg"
                          alt=""
                          width={96}
                          height={96}
                          className={styles.playIcon}
                        />
                      </span>
                    </button>
                  )}
                </article>
              );
            })}
          </div>

          <div className={styles.actions}>
            <Button href="/cases/video" variant="secondary" size="sm">
              Смотреть больше примеров
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
