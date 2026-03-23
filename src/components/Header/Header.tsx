"use client";

import styles from "./Header.module.scss";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container/Container";
import { useCallback } from "react";

/* Навигация */
const navItems = [
  { label: "Работы", href: "#cases" },
  { label: "Процесс", href: "#process" },
  { label: "Цены", href: "#prices" },
  { label: "Контакты", href: "#contact" },
];

/* 76 (header + отступ) + 96 (section margin) */
const SCROLL_OFFSET = 172;

export default function Header() {
  /* Скролл с учетом offset */
  const handleScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;

      e.preventDefault();

      const target = document.querySelector(href);
      if (!target) return;

      const top =
        target.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    },
    [],
  );

  /* Скролл в самое начало страницы */
  const handleScrollTop = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [],
  );

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.inner}>
            {/* Логотип → скролл вверх */}
            <Link
              href="/"
              className={styles.logo}
              aria-label="На главную"
              onClick={handleScrollTop}
            >
              <Image
                src="/images/logo.svg"
                alt="Карманов"
                width={64}
                height={64}
                priority
                className={styles.logoImage}
              />
            </Link>

            {/* Навигация */}
            <nav className={styles.nav} aria-label="Основная навигация">
              <ul className={styles.list}>
                {navItems.map((item) => (
                  <li key={item.href} className={styles.item}>
                    <Link
                      href={item.href}
                      className="link-primary"
                      onClick={(e) => handleScroll(e, item.href)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* CTA */}
            <div className={styles.action}>
              <Link
                href="#contact"
                className={styles.button}
                onClick={(e) => handleScroll(e, "#contact")}
              >
                Оставить заявку
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
