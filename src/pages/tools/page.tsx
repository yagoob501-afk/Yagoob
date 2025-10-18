import PrimaryFooter from "@/components/sections/Footer/PrimaryFooter"
import PrimaryHeader from "@/components/sections/Header/PrimaryHeader"
import PrimaryAdditionalToolsSection from "@/components/sections/Tools/PrimaryAdditionalToolsSection"
import PrimaryToolsSection from "@/components/sections/Tools/PrimaryToolsSection"

function ToolsPage() {
    return (
        <div className="grow">
            <PrimaryHeader />
            <PrimaryToolsSection hideNewestItems />
            <PrimaryAdditionalToolsSection />
            <div className="mt-10"></div>
            <PrimaryFooter />
        </div>
    )
}

export default ToolsPage