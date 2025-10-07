import HeroSection from "@/components/about/hero-section"
import QualificationsSection from "@/components/about/qualifications-section"
import ExperienceTimeline from "@/components/about/experience-timeline"
import SkillsSection from "@/components/about/skills-section"
import VisionSection from "@/components/about/vision-section"
import StatsSection from "@/components/about/stats-section"
import CTASection from "@/components/about/cta-section"
import PrimaryHeader from "@/components/sections/Header/PrimaryHeader"
import PrimaryFooter from "@/components/sections/Footer/PrimaryFooter"
import SpecialTeacherSection from "@/components/about/special-teacher-section"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg-layout)]">
            <PrimaryHeader />
            <HeroSection />
            <QualificationsSection />
            <SpecialTeacherSection />
            <ExperienceTimeline />
            <SkillsSection />
            <VisionSection />
            <StatsSection />
            <CTASection />
            <PrimaryFooter />
        </main>
    )
}
