import { useMemo, useRef } from "react";
// import { useTranslation } from "react-i18next";
import ministryLogo from "@/assets/شعار_وزارة_التعليم_العالي__الكويت_-removebg-preview.png";
import { format } from "date-fns-tz";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
    eventType: string;
    targetGroup: string;
    description: string;
    images: File[] | string[];
}

function ProjectDocumentationPreview({ data }: { data: DocumentationData }) {
    // const { t } = useTranslation();
    const componentRef = useRef<HTMLDivElement>(null);

    const imageUrls = useMemo(() => {
        return data.images.map(value => {
            if (typeof value === "string") return value;
            return URL.createObjectURL(value);
        });
    }, [data]);

    // ---- Download as Image ----
    // ---- Download as Image (fit to A4) ----
    const downloadAsImage = async () => {
        if (!componentRef.current) return;
        const originalCanvas = await html2canvas(componentRef.current, { scale: 2 });

        // مقاس A4 بالبيكسل على 96dpi تقريباً
        const a4Width = 1123; // px
        const a4Height = 794; // px

        // Canvas جديد مقاس A4
        const a4Canvas = document.createElement("canvas");
        a4Canvas.width = a4Width;
        a4Canvas.height = a4Height;
        const ctx = a4Canvas.getContext("2d");

        if (!ctx) return;

        // حساب نسبة التصغير عشان يحافظ على الابعاد
        let imgWidth = a4Width;
        let imgHeight = (originalCanvas.height * imgWidth) / originalCanvas.width;

        if (imgHeight > a4Height) {
            imgHeight = a4Height;
            imgWidth = (originalCanvas.width * imgHeight) / originalCanvas.height;
        }

        const x = (a4Width - imgWidth) / 2;
        const y = (a4Height - imgHeight) / 2;

        ctx.fillStyle = "#ffffff"; // خلفية بيضاء
        ctx.fillRect(0, 0, a4Width, a4Height);
        ctx.drawImage(originalCanvas, x, y, imgWidth, imgHeight);

        const imgData = a4Canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `${data.title || "documentation"}.png`;
        link.click();
    };


    // ---- Download as PDF ----
    // ---- Download as PDF (fit all in one page) ----
    const downloadAsPDF = async () => {
        if (!componentRef.current) return;
        const canvas = await html2canvas(componentRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // calculate aspect ratio to fit the content in one page
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let finalWidth = imgWidth;
        let finalHeight = imgHeight;

        if (imgHeight > pageHeight) {
            finalHeight = pageHeight;
            finalWidth = (canvas.width * finalHeight) / canvas.height;
        }

        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
        pdf.save(`${data.title || "documentation"}.pdf`);
    };


    return (
        <div className="flex flex-col gap-4">
            {/* Action buttons */}
            <div className="flex gap-2 justify-end">
                <button
                    onClick={downloadAsImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    تحميل صورة
                </button>
                <button
                    onClick={downloadAsPDF}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                    تحميل PDF
                </button>
            </div>

            {/* Content to export */}
            <div
                ref={componentRef}
                className="bg-white text-black max-w-4xl p-10 w-full mx-auto shadow-md rounded-lg print:shadow-none print:rounded-none print:p-0 print:max-w-full flex flex-col gap-4"
            >
                <div className="border border-primary rounded-xl flex flex-col p-10">
                    <img src={ministryLogo} alt="Logo" className="max-w-30" />
                    <p>
                        الادارة العامة لمنطقة
                        <br />
                        <span>{data.area || " ....... "}</span>
                        <span> التعليمية</span>
                    </p>
                    <h1 className="text-center text-text-heading">
                        {data.title || "...."}
                    </h1>
                </div>

                <div className="flex justify-center items-center p-10">
                    <p className="border px-2 py-4 rounded-md border-primary-active w-full max-w-[70%] text-center">
                        {data.description || "الوصف"}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <p className="border px-7 py-4 rounded-md border-primary-active w-full">
                        {data.teacherGender === "male" ? "معلم" : "معلمة"}
                        <br />
                        {data.teacherName || "..."}
                    </p>

                    <p className="border px-7 py-4 rounded-md border-primary-active w-full">
                        قسم
                        <br />
                        {data.department || "..."}
                    </p>

                    <p className="border px-7 py-4 rounded-md border-primary-active w-full">
                        المكان
                        <br />
                        {data.place || "..."}
                    </p>

                    <p className="border px-7 py-4 rounded-md border-primary-active w-full">
                        التاريخ
                        <br />
                        {data.date ? format(data.date, "yyyy/MM/dd") : "..."}
                    </p>

                    <p className="border px-7 py-4 rounded-md border-primary-active w-full">
                        نوع الفعالية
                        <br />
                        {data.eventType || "..."}
                    </p>

                    <p className="border px-7 py-4 rounded-md border-primary-active w-full">
                        الفئة المستهدفة
                        <br />
                        {data.targetGroup || "..."}
                    </p>
                </div>

                <div className="p-4 rounded-xl border-2 border-primary flex flex-col gap-2 min-h-64">
                    <h2>الصور المرفقة</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {imageUrls.length ? (
                            imageUrls.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    className="max-h-32 object-contain w-full"
                                />
                            ))
                        ) : (
                            "لا توجد صور مرفقة"
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectDocumentationPreview;
