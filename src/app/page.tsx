import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HighlightSection } from "@/components/HighlightSection";
import { FeatureSection } from "@/components/FeatureSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { StatsSection } from "@/components/StatsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* Light half of the page */}
        <HighlightSection />
        <FeatureSection />
        <ProjectsSection />
        <StatsSection />
        <SkillsSection />
      </main>
      <Footer />
    </>
  );
}
