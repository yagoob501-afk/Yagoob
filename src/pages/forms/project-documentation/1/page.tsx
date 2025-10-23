import PrimaryHeader from "@/components/sections/Header/PrimaryHeader";
import PrimaryFooter from "@/components/sections/Footer/PrimaryFooter";

function ProjectDocumentation1() {

    return (
        <div className="grow flex flex-col">
            <PrimaryHeader />
            <iframe src={"https://teacher-yagoub.netlify.app/#/form"} className="min-h-full h-[230vh] lg:h-[150vh] w-full grow">

            </iframe>
            <PrimaryFooter />
        </div>
    );
}

export default ProjectDocumentation1;
