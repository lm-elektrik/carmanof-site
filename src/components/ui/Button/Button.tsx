"use client";

import styles from "./Button.module.scss";
import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => void;
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const classes =
    `${styles.button} ${styles[variant]} ${styles[size]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
