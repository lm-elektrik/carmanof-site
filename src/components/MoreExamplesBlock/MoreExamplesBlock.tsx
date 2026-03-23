"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./MoreExamplesBlock.module.scss";

/* Верхний ряд галереи: 2 крупные карточки */
const topImages = [
  {
    src: "/images/more-examples/example-01-v2.webp",
    alt: "Пример работы 1",
  },
  {
    src: "/images/more-examples/example-02-v2.webp",
    alt: "Пример работы 2",
  },
];

/* Нижний ряд галереи: 3 карточки */
const bottomImages = [
  {
    src: "/images/more-examples/example-03-v2.webp",
    alt: "Пример работы 3",
  },
  {
    src: "/images/more-examples/example-04-v2.webp",
    alt: "Пример работы 4",
  },
  {
    src: "/images/more-examples/example-05-v2.webp",
    alt: "Пример работы 5",
  },
];

/* Фотоблок: 2 карточки сверху и 3 снизу */
const MoreExamplesBlock = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  /* Собираем все изображения в один массив для модалки */
  const allImages = useMemo(() => [...topImages, ...bottomImages], []);

  useEffect(() => {
    /* Закрытие по клавише Esc */
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
    }

    if (activeIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  const activeImage = activeIndex !== null ? allImages[activeIndex] : null;

  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.galleryShell}>
            <div className={styles.gridTop}>
              {topImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  className={`${styles.card} ${styles.cardTop}`}
                  aria-label={image.alt}
                  onClick={() => setActiveIndex(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={styles.image}
                    sizes="(max-width: 991px) 100vw, 50vw"
                    priority={false}
                  />
                </button>
              ))}
            </div>

            <div className={styles.gridBottom}>
              {bottomImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  className={`${styles.card} ${styles.cardBottom}`}
                  aria-label={image.alt}
                  onClick={() => setActiveIndex(topImages.length + index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={styles.image}
                    sizes="(max-width: 640px) 100vw, (max-width: 991px) 50vw, 33vw"
                    priority={false}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {activeImage && (
        <div
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Закрыть изображение"
            onClick={() => setActiveIndex(null)}
          >
            ×
          </button>

          <div
            className={styles.modalContent}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalImageWrapper}>
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                className={styles.modalImage}
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MoreExamplesBlock;
