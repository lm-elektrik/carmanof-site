import Image from "next/image";
import styles from "./MoreExamplesBlock.module.scss";
import Container from "@/components/ui/Container/Container";
import Button from "@/components/ui/Button/Button";

type ExampleItem = {
  id: string;
  title: string;
  image: string;
};

const examples: ExampleItem[] = [
  {
    id: "bmw-e70",
    title: "BMW E70",
    image: "/images/more-examples/bmw-e70.webp",
  },
  {
    id: "audi-a5",
    title: "Audi A5",
    image: "/images/more-examples/audi-a5.webp",
  },
  {
    id: "mercedes-w168",
    title: "Mercedes W168",
    image: "/images/more-examples/mercedes-w168.webp",
  },
];

export default function MoreExamplesBlock() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>Еще примеры работ</h2>

          <div className={styles.cards}>
            {examples.map((item) => (
              <article key={item.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={352}
                    height={198}
                    className={styles.image}
                  />
                </div>

                <h3 className={styles.cardTitle}>{item.title}</h3>
              </article>
            ))}
          </div>

          <div className={styles.actions}>
            <Button
              href="#works"
              variant="secondary"
              size="sm"
              className={styles.button}
            >
              Смотреть все фото
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
