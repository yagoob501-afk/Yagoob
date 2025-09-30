import PrimaryFooter from "@/components/sections/Footer/PrimaryFooter"
import PrimaryHeader from "@/components/sections/Header/PrimaryHeader"
import PrimaryHeroSection from "@/components/sections/Hero/PrimaryHeroSection"
import PrimaryJoinUsSection from "@/components/sections/JoinUsSection/PrimaryJoinUsSection"
import PrimaryAdditionalToolsSection from "@/components/sections/Tools/PrimaryAdditionalToolsSection"
import PrimaryToolsSection from "@/components/sections/Tools/PrimaryToolsSection"

function HomePage() {
    return (
        <div className="grow">
            <PrimaryHeader />
            <PrimaryHeroSection />
            <PrimaryToolsSection />
            <PrimaryAdditionalToolsSection />
            <PrimaryJoinUsSection />
            <PrimaryFooter />
        </div>
    )
}

export default HomePage