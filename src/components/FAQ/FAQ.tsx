"use client";

import { useState } from "react";
import styles from "./FAQ.module.scss";

const faqItems = [
  {
    question: "Как отправить приборную панель и что нужно подготовить?",
    answer:
      "Перед отправкой свяжитесь с нами, уточните модель панели и аккуратно упакуйте её. После согласования подскажем, что приложить и куда отправлять.",
  },
  {
    question: "Можно ли изготовить шкалы по фото без отправки оригинала?",
    answer:
      "В некоторых случаях макет можно подготовить по фото, если хорошо видны детали. Но для точного совпадения по размерам иногда нужен оригинал.",
  },
  {
    question: "Сколько занимает работа и как согласовывается макет?",
    answer:
      "Срок зависит от задачи и состояния панели. Перед запуском мы согласовываем детали, чтобы вы понимали этапы работы и ожидаемый результат.",
  },
  {
    question: "Работаете ли вы по всей России и как происходит отправка?",
    answer:
      "Да, работаем по всей России. Отправка и возврат выполняются через СДЭК после согласования деталей и подтверждения работ.",
  },
  {
    question: "Можно ли сделать шкалы по индивидуальному дизайну?",
    answer:
      "Да, можем подготовить шкалы под конкретную модель, нужную графику и желаемый внешний вид. Перед запуском согласовываем макет, чтобы результат был ожидаемым.",
  },
];

export default function FAQ() {
  // Первый вопрос открыт по умолчанию.
  const [activeIndex, setActiveIndex] = useState(0);

  const handleToggle = (index: number) => {
    // Всегда держим один пункт открытым.
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>Частые вопросы</div>

          <h2 id="faq-title" className={styles.visuallyHidden}>
            Частые вопросы и ответы
          </h2>

          <div className={styles.list}>
            {faqItems.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <article
                  key={item.question}
                  className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
                >
                  <button
                    type="button"
                    className={styles.trigger}
                    aria-expanded={isActive}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    onClick={() => handleToggle(index)}
                  >
                    <span className={styles.question}>{item.question}</span>

                    <span className={styles.icon} aria-hidden="true">
                      {isActive ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${index}`}
                    className={`${styles.panel} ${isActive ? styles.panelOpen : ""}`}
                  >
                    <div className={styles.panelInner}>
                      <p className={styles.answer}>{item.answer}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
