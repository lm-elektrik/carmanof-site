"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/Header/Header";
import Intro from "@/components/Intro/Intro";

type LayoutChromeClientProps = {
  children: React.ReactNode;
  phone?: string;
};

export default function LayoutChromeClient({
  children,
  phone,
}: LayoutChromeClientProps) {
  const pathname = usePathname() || "/";

  const isStudioPage = pathname.startsWith("/studio");
  const isHomePage = pathname === "/";

  // ❗ критично: студию не трогаем
  if (isStudioPage) {
    return <>{children}</>;
  }

  return (
    <>
      {isHomePage ? <Intro /> : null}
      <Header phone={phone} />
      {children}
    </>
  );
}
