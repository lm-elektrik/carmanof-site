import Image from "next/image";
import styles from "./ProcessBlock.module.scss";
import Container from "@/components/ui/Container/Container";

type ProcessStep = {
  id: string;
  title: string;
  description: string;
};

const processSteps: ProcessStep[] = [
  {
    id: "send",
    title: "Отправка",
    description: "Отправляете приборку через СДЭК",
  },
  {
    id: "check",
    title: "Проверка",
    description: "Получаем и проверяем состояние",
  },
  {
    id: "work",
    title: "Работа",
    description: "Ремонтируем или изготавливаем заново",
  },
  {
    id: "return",
    title: "Возврат",
    description: "Отправляем готовую приборку обратно",
  },
];

export default function ProcessBlock() {
  return (
    <section className={styles.section} aria-labelledby="process-block-title">
      <Container>
        <div className={styles.wrapper}>
          <h2 id="process-block-title" className={styles.title}>
            Как проходит работа
          </h2>

          <div className={styles.steps}>
            {processSteps.map((step, index) => {
              const isLast = index === processSteps.length - 1;

              return (
                <div key={step.id} className={styles.stepGroup}>
                  <article className={styles.card}>
                    <h3 className={styles.cardTitle}>{step.title}</h3>

                    <p className={styles.cardDescription}>{step.description}</p>
                  </article>

                  {!isLast && (
                    <div className={styles.arrow} aria-hidden="true">
                      <Image
                        src="/icons/process-block/step-arrow.svg"
                        alt=""
                        width={44}
                        height={44}
                        className={styles.arrowIcon}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
