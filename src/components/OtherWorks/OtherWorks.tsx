import styles from "./OtherWorks.module.scss";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";

export default function OtherWorks() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.wrapper}>
          {/* Заголовок */}
          <h2 className={styles.title}>Другие работы</h2>

          {/* Контент (2 карточки) */}
          <div className={styles.cards}>
            {/* Карточка 1 */}
            <div className={styles.card}>
              <div className={styles.text}>
                <h3 className={styles.cardTitle}>Пересвет шкал</h3>

                <p className={styles.cardText}>
                  Замена штатной подсветки шкал на другой цвет или более яркий
                  вариант.
                </p>
              </div>

              <div className={styles.image} />
            </div>

            {/* Карточка 2 */}
            <div className={styles.card}>
              <div className={styles.text}>
                <h3 className={styles.cardTitle}>Ремонт шкал</h3>

                <p className={styles.cardText}>
                  Восстановление поврежденных шкал, исправление дефектов и
                  аккуратная замена элементов
                </p>
              </div>

              <div className={styles.image} />
            </div>
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
