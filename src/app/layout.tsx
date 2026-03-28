import type { Metadata } from "next";
import localFont from "next/font/local";

import LayoutChrome from "@/components/LayoutChrome/LayoutChrome";
import "./globals.scss";

const manrope = localFont({
  src: [
    {
      path: "./fonts/Manrope-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Manrope-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://carmanof-site.vercel.app"),
  applicationName: "Carmanof",
  title: {
    default: "Carmanof",
    template: "%s",
  },
  description:
    "Ремонт, восстановление и доработка приборных панелей. Примеры работ, подход и удобный способ связи.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Carmanof",
    description:
      "Ремонт, восстановление и доработка приборных панелей. Примеры работ, подход и удобный способ связи.",
    url: "/",
    siteName: "Carmanof",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Carmanof",
    description:
      "Ремонт, восстановление и доработка приборных панелей. Примеры работ, подход и удобный способ связи.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * Корневой layout не зависит от request-based данных.
   * Это уменьшает связанность с cookies() и помогает общей стратегии кэша.
   *
   * suppressHydrationWarning оставляем, потому что часть клиентской логики
   * может менять начальное состояние интерфейса после гидрации.
   */
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={manrope.variable}>
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  );
}
