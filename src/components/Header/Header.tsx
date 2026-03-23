"use client";

import styles from "./Header.module.scss";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container/Container";
import { useCallback } from "react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

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

  /* Логотип:
     - на главной скроллит в самое начало
     - на внутренних страницах не блокирует переход на "/" */
  const handleLogoClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return;

      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [pathname],
  );

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.inner}>
            {/* Логотип → на главной скролл вверх, на внутренних страницах переход на главную */}
            <Link
              href="/"
              className={styles.logo}
              aria-label="На главную"
              onClick={handleLogoClick}
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
                {navItems.map((item) => {
                  const linkHref =
                    pathname === "/" ? item.href : `/${item.href}`;

                  return (
                    <li key={item.href} className={styles.item}>
                      <Link
                        href={linkHref}
                        className="link-primary"
                        onClick={
                          pathname === "/"
                            ? (e) => handleScroll(e, item.href)
                            : undefined
                        }
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* CTA */}
            <div className={styles.action}>
              <Link
                href={pathname === "/" ? "#contact" : "/#contact"}
                className={styles.button}
                onClick={
                  pathname === "/"
                    ? (e) => handleScroll(e, "#contact")
                    : undefined
                }
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
