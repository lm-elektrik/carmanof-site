import type { Metadata } from "next";
import PhotoCasesClient from "./PhotoCasesClient";
import { getPhotoCases, type PhotoCase } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Фото примеры работ | Carmanof",
  description:
    "Фото кейсы Carmanof: примеры выполненных работ с приборными панелями и визуальный результат.",
};

export default async function PhotoCasesPage() {
  let photoCases: PhotoCase[] = [];

  try {
    // Получаем кейсы из Sanity
    photoCases = await getPhotoCases();
  } catch (error) {
    // ❗ страница не падает даже при VPN / timeout
    console.error("PhotoCasesPage error:", error);
  }

  return <PhotoCasesClient photoCases={photoCases} />;
}
