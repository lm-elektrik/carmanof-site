import styles from "./OtherWorks.module.scss";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";

type OtherWorkItem = {
  title: string;
  text: string;
  imageSrc: string;
};

const otherWorksItems: OtherWorkItem[] = [
  {
    title: "Пересвет шкал",
    text: "Замена штатной подсветки шкал на другой цвет или более яркий вариант.",
    imageSrc: "/images/other-works/other-work-01.webp",
  },
  {
    title: "Ремонт шкал",
    text: "Восстановление поврежденных шкал, исправление дефектов и аккуратная замена элементов.",
    imageSrc: "/images/other-works/other-work-02.webp",
  },
];

export default function OtherWorks() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.wrapper}>
          {/* Заголовок */}
          <h2 className={styles.title}>Другие работы</h2>

          {/* Контент (2 карточки) */}
          <div className={styles.cards}>
            {otherWorksItems.map((item) => (
              <div key={item.title} className={styles.card}>
                <div className={styles.text}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>

                  <p className={styles.cardText}>{item.text}</p>
                </div>

                <div
                  className={styles.image}
                  style={{ backgroundImage: `url(${item.imageSrc})` }}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>

          {/* Кнопка */}
          <div className={styles.actions}>
            <Button href="/cases" variant="secondary" size="sm">
              Посмотреть примеры работ
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
