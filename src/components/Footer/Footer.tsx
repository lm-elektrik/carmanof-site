import styles from "./Footer.module.scss";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.bottom}>
          {/* Лево */}
          <div className={styles.copy}>Карманов © {year}</div>

          {/* Центр */}
          <div className={styles.center}>
            <a href="/blog" className={styles.link}>
              Блог
            </a>
            <span className={styles.separator}>·</span>
            <a href="/privacy" className={styles.link}>
              Политика конфиденциальности
            </a>
          </div>

          {/* Право */}
          <div className={styles.designer}>design by @lm_design</div>
        </div>
      </div>
    </footer>
  );
}
