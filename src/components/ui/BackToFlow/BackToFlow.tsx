import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./BackToFlow.module.scss";

type BackToFlowProps = {
  href?: string;
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
};

export default function BackToFlow({
  href = "/#other-works",
  children = "← назад",
  size = "md",
}: BackToFlowProps) {
  return (
    <div className={styles.wrapper}>
      <Link
        href={href}
        className={`${styles.link} ${styles[size]}`}
        aria-label="Вернуться к другим работам"
      >
        {children}
      </Link>
    </div>
  );
}
