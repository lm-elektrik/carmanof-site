import type { Metadata } from "next";
import VideoCasesClient from "./VideoCasesClient";
import { getVideoCases, type VideoCase } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Видео примеры работ | Carmanof",
  description:
    "Видео кейсы Carmanof: примеры работ с приборными панелями, процесс и итоговый результат.",
};

export default async function VideoCasesPage() {
  let videoCases: VideoCase[] = [];

  try {
    videoCases = await getVideoCases();
  } catch (error) {
    console.error("VideoCasesPage error:", error);
  }

  return <VideoCasesClient videoCases={videoCases} />;
}
