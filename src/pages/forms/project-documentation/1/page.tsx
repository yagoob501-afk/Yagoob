import { useState } from "react";
import type { DocumentationData } from "./documentation";
// import ProjectDocumentationPreview from "./documentation";
import ProjectDocumentation1Form from "./form";
import ProjectDocumentationPreview from "./documentation";
// import "react-datepicker/dist/react-datepicker.css";

function ProjectDocumentation1() {
    const [fullData, setFullData] = useState(null as null | DocumentationData);


    return (
        <main className="container mx-auto grow flex items-center justify-center px-4 py-8">

            {fullData ? <ProjectDocumentationPreview data={fullData} /> : <ProjectDocumentation1Form onSubmit={setFullData} />}
        </main>
    );
}

export default ProjectDocumentation1;
