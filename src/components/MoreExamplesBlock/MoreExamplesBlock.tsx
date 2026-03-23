"use client";

import Image from "next/image";
import styles from "./MoreExamplesBlock.module.scss";

/* Верхний ряд галереи: 2 крупные карточки */
const topImages = [
  {
    src: "/images/more-examples/example-01.webp",
    alt: "Пример работы 1",
  },
  {
    src: "/images/more-examples/example-02.webp",
    alt: "Пример работы 2",
  },
];

/* Нижний ряд галереи: 3 карточки */
const bottomImages = [
  {
    src: "/images/more-examples/example-03.webp",
    alt: "Пример работы 3",
  },
  {
    src: "/images/more-examples/example-04.webp",
    alt: "Пример работы 4",
  },
  {
    src: "/images/more-examples/example-05.webp",
    alt: "Пример работы 5",
  },
];

/* Фотоблок: 2 карточки сверху и 3 снизу */
const MoreExamplesBlock = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.galleryShell}>
          <div className={styles.gridTop}>
            {topImages.map((image) => (
              <button
                key={image.src}
                type="button"
                className={`${styles.card} ${styles.cardTop}`}
                aria-label={image.alt}
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
            {bottomImages.map((image) => (
              <button
                key={image.src}
                type="button"
                className={`${styles.card} ${styles.cardBottom}`}
                aria-label={image.alt}
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
  );
};

export default MoreExamplesBlock;
