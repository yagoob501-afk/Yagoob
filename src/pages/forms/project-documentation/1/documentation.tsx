import { useTranslation } from "react-i18next";
import { Image as ImageIcon } from "lucide-react";

export interface DocumentationData {
    title: string;
    area: string;
    school: string;
    teacherGender: string;
    teacherName: string;
    department: string;
    place: string;
    date: string;
    managerGender: string;
    managerName: string;
    targetGroup: string;
    description: string;
    images: File[] | string[]; // could be File objects or URLs
}

function ProjectDocumentationPreview({ data }: { data: DocumentationData }) {
    const { t } = useTranslation();

    return (
        <div className="bg-white text-black p-10 max-w-4xl mx-auto shadow-md rounded-lg print:shadow-none print:rounded-none print:p-0 print:max-w-full">
            not implemented yet !
        </div>
    );
}

export default ProjectDocumentationPreview;
