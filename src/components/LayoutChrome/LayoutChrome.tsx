import { getSiteSettings } from "@/sanity/lib/fetchers";
import LayoutChromeClient from "@/components/LayoutChrome/LayoutChromeClient";

type LayoutChromeProps = {
  children: React.ReactNode;
};

export default async function LayoutChrome({ children }: LayoutChromeProps) {
  const settings = await getSiteSettings();

  return (
    <LayoutChromeClient phone={settings?.phone}>{children}</LayoutChromeClient>
  );
}
