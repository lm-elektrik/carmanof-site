"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Intro from "@/components/Intro/Intro";

type LayoutChromeProps = {
  children: React.ReactNode;
  introPlayed: boolean;
};

export default function LayoutChrome({
  children,
  introPlayed,
}: LayoutChromeProps) {
  const pathname = usePathname() || "/";

  // Studio полностью изолирован
  const isStudioPage = pathname.startsWith("/studio");

  // Главная страница
  const isHomePage = pathname === "/";

  if (isStudioPage) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Intro только на главной */}
      {isHomePage && <Intro enabled={!introPlayed} />}

      <Header />

      {children}
    </>
  );
}
