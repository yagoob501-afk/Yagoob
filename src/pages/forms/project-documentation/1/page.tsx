import { useState } from "react";
import type { DocumentationData } from "./documentation";
// import ProjectDocumentationPreview from "./documentation";
import ProjectDocumentation1Form from "./form";
import ProjectDocumentationPreview from "./documentation";
import PrimaryHeader from "@/components/sections/Header/PrimaryHeader";
import PrimaryFooter from "@/components/sections/Footer/PrimaryFooter";
// import "react-datepicker/dist/react-datepicker.css";

function ProjectDocumentation1() {
    const [fullData, setFullData] = useState(null as null | DocumentationData);


    return (
        <div className="grow flex flex-col">
            <PrimaryHeader />
            <main className="container mx-auto grow flex items-center justify-center px-4 py-8">

                {fullData ? <ProjectDocumentationPreview data={fullData} /> : <ProjectDocumentation1Form onSubmit={setFullData} />}
            </main>

            <PrimaryFooter />
        </div>
    );
}

export default ProjectDocumentation1;
