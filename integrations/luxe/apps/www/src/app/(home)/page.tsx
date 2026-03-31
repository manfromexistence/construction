import { Footer } from "../_components/Footer";
import { BottomBackground } from "./_components/BottomBackground";
import { ComponentsSection } from "./_components/components-section";
import { FeedbacksSection } from "./_components/feedbacks-section/FeedbacksSection";
import { HeroSection } from "./_components/hero-section";
import { SloganSection } from "./_components/slogan-section";
import { TopBackground } from "./_components/TopBackground";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="relative mt-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <HeroSection />
          <ComponentsSection />
          <FeedbacksSection />
          <SloganSection />
        </div>
        <Footer />
      </div>
      <BottomBackground />
      <TopBackground />
    </main>
  );
}
