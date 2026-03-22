import Link from "next/link";
import styles from "./privacy.module.scss";

const privacyItems = [
  {
    title: "Какие данные мы получаем",
    text: "Обычно это имя, номер телефона и данные, которые вы сами указываете в сообщении или переписке. Ничего лишнего мы не запрашиваем.",
  },
  {
    title: "Зачем мы это используем",
    text: "Только чтобы связаться с вами, обсудить заказ, уточнить детали работы и ответить на ваши вопросы.",
  },
  {
    title: "Передаём ли мы данные кому-то ещё",
    text: "Нет, мы не продаём и не передаём ваши данные третьим лицам без необходимости и без вашего согласия.",
  },
  {
    title: "Как хранятся данные",
    text: "Данные могут храниться в переписке, почте или в рабочих сервисах, которые используются для связи с клиентом и ведения заказа.",
  },
  {
    title: "Как удалить данные",
    text: "Если хотите удалить свои данные, просто напишите нам удобным способом. Удалим их без лишних вопросов.",
  },
  {
    title: "Ничего лишнего",
    text: "Мы не собираем лишнюю личную информацию, не используем данные для спама и не передаём их рекламным сетям.",
  },
];

export const metadata = {
  title: "Политика конфиденциальности",
  description:
    "Кратко и понятно о том, какие данные мы получаем, зачем используем и как можно запросить удаление.",
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            На главную
          </Link>

          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Конфиденциальность</p>

            <h1 className={styles.title}>Политика конфиденциальности</h1>

            <p className={styles.description}>
              Кратко и по делу: какие данные мы получаем, зачем они нужны и как
              мы с ними обращаемся. Мы не собираем ничего лишнего и используем
              информацию только для связи с вами и работы по заказу.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {privacyItems.map((item) => (
              <article key={item.title} className={styles.card}>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardText}>{item.text}</p>
              </article>
            ))}
          </div>

          <div className={styles.noteBlock}>
            <h2 className={styles.noteTitle}>Если остались вопросы</h2>
            <p className={styles.noteText}>
              Если хотите уточнить, какие данные у нас есть, как они
              используются или попросить удалить информацию, просто свяжитесь с
              нами через форму на сайте или в удобном мессенджере.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
