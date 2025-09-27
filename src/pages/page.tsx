import PrimaryHeader from "@/components/sections/Header/PrimaryHeader"
import PrimaryHeroSection from "@/components/sections/Hero/PrimaryHeroSection"
import PrimaryToolsSection from "@/components/sections/Tools/PrimaryToolsSection"

function HomePage() {
    return (
        <div className="grow">
            <PrimaryHeader />
            <PrimaryHeroSection />
            <PrimaryToolsSection />
        </div>
    )
}

export default HomePage