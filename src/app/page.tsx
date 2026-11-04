import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HighlightSection } from "@/components/HighlightSection";
import { FeatureSection } from "@/components/FeatureSection";
import { MarketCard } from "@/components/MarketCard";
import { MoreProjects, ProjectsSection } from "@/components/ProjectsSection";
import { CinematicSection } from "@/components/CinematicSection";
import { CommerceSlot } from "@/components/CommerceSlot";
import { CINEMATIC_ENABLED } from "@/content";
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
        <FeatureSection />
        {/* MarketCard is a server component, fetched and cached on the server
            and passed into the client ProjectsSection as a slot. */}
        <ProjectsSection sideCard={<MarketCard />} />
        {CINEMATIC_ENABLED && <CinematicSection preview={<CommerceSlot />} />}
        <MoreProjects />
        <StatsSection />
        <ResumeSection />
        <SkillsSection />
      </main>
      <Footer />
    </>
  );
}
