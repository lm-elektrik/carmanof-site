import Hero from "@/components/Hero/Hero";
import MainOffer from "@/components/MainOffer/MainOffer";
import OtherWorks from "@/components/OtherWorks/OtherWorks";
import AdditionalElements from "@/components/AdditionalElements/AdditionalElements";
import VideoCaseBlock from "@/components/VideoCaseBlock/VideoCaseBlock";
import MoreExamplesBlock from "@/components/MoreExamplesBlock/MoreExamplesBlock";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MainOffer />
      <OtherWorks />
      <AdditionalElements />
      <VideoCaseBlock />
      <MoreExamplesBlock />
    </>
  );
}
