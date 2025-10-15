import { useState } from "react";
import type { DocumentationData } from "./documentation";
import ProjectDocumentation1Form from "./form";
import ProjectDocumentationPreview from "./documentation";
import PrimaryHeader from "@/components/sections/Header/PrimaryHeader";
import PrimaryFooter from "@/components/sections/Footer/PrimaryFooter";

function ProjectDocumentation2() {
    const [fullData, setFullData] = useState(null as null | DocumentationData);
    const [isPreview, setIsPreview] = useState(false);
    return (
        <div className="grow flex flex-col">
            <PrimaryHeader />
            <main className="container mx-auto grow flex items-center justify-center px-4 py-8">
                {
                    isPreview ?
                        <ProjectDocumentationPreview data={fullData as any} onRequestChange={() => setIsPreview(false)} /> :
                        <ProjectDocumentation1Form
                            onSubmit={(data) => {
                                setFullData(data);
                                setIsPreview(true);
                            }}
                            initialData={fullData || undefined}
                        />
                }
            </main>

            <PrimaryFooter />
        </div>
    );
}

export default ProjectDocumentation2;
