import styles from "./Footer.module.scss";

const menuItems = [
  { label: "Главная", href: "#" },
  { label: "Работы", href: "#" },
  { label: "Процесс", href: "#" },
  { label: "Контакты", href: "#" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Верхняя строка */}
        <div className={styles.top}>
          <nav className={styles.menu}>
            {menuItems.map((item) => (
              <a key={item.label} href={item.href} className={styles.link}>
                {item.label}
              </a>
            ))}
          </nav>

          <a href="/privacy" className={styles.link}>
            Политика конфиденциальности
          </a>
        </div>

        {/* Нижняя строка */}
        <div className={styles.bottom}>
          <div className={styles.copy}>Карманов © {year}</div>

          <div className={styles.designer}>design by @lm_design</div>
        </div>
      </div>
    </footer>
  );
}
