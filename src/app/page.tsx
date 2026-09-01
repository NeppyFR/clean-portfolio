import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HighlightSection } from "@/components/HighlightSection";
import { FeatureSection } from "@/components/FeatureSection";
import { MarketCard } from "@/components/MarketCard";
import { ProjectsSection } from "@/components/ProjectsSection";
import { StatsSection } from "@/components/StatsSection";
import { ResumeSection } from "@/components/ResumeSection";
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
        {/* MarketCard is a server component, fetched and cached on the server
            and passed into the client FeatureSection as a slot. */}
        <FeatureSection sideCard={<MarketCard />} />
        <ProjectsSection />
        <StatsSection />
        <ResumeSection />
        <SkillsSection />
      </main>
      <Footer />
    </>
  );
}
