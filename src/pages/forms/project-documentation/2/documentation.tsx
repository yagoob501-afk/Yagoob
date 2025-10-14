import { useMemo, useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Download, FileDown, Eye } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import EducationMinistryLogo from "@/assets/شعار_وزارة_التعليم_العالي_(الكويت).jpeg";

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
    logoPicture?: File | string;
}

const A4_WIDTH_PX = 1240;

export default function ProjectDocumentationPreview({ data }: { data: DocumentationData }) {
    const documentRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);

    // ✅ Convert image arrays and logo
    const imageUrls = useMemo(() => {
        return data.images.map(value => (typeof value === "string" ? value : URL.createObjectURL(value)));
    }, [data.images]);

    const logoUrl = useMemo(() => {
        if (!data.logoPicture) return null;
        return typeof data.logoPicture === "string"
            ? data.logoPicture
            : URL.createObjectURL(data.logoPicture);
    }, [data.logoPicture]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "............";
        const d = new Date(dateStr);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}/${month}/${day}`;
    };

    const hasDescription = data.description && data.description.trim() && data.description !== "ss";
    const hasImages = imageUrls.length > 0;

    const generatePreview = async () => {
        if (!documentRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(documentRef.current, {
                scale: 2,
                backgroundColor: "#F5F1E8",
                logging: false,
            });
            setPreviewImage(canvas.toDataURL("image/png"));
        } catch (error) {
            console.error("Error generating preview:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(generatePreview, 100);
        return () => clearTimeout(timer);
    }, [data, imageUrls, logoUrl]);

    const downloadAsImage = async () => {
        if (!documentRef.current) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(documentRef.current, {
                scale: 3,
                backgroundColor: "#F5F1E8",
                logging: false,
            });
            const imgData = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = imgData;
            link.download = `${data.title || "documentation"}.png`;
            link.click();
        } finally {
            setIsDownloading(false);
        }
    };

    const downloadAsPDF = async () => {
        if (!documentRef.current) return;
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(documentRef.current, {
                scale: 3,
                backgroundColor: "#F5F1E8",
                logging: false,
            });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imgWidthPx = canvas.width;
            const imgHeightPx = canvas.height;
            const pageRatio = pageWidth / pageHeight;
            const imgRatio = imgWidthPx / imgHeightPx;

            let renderWidth = pageWidth;
            let renderHeight = pageHeight;
            let offsetX = 0;
            let offsetY = 0;

            if (imgRatio > pageRatio) {
                renderHeight = (pageWidth / imgWidthPx) * imgHeightPx;
                offsetY = (pageHeight - renderHeight) / 2;
            } else {
                renderWidth = (pageHeight / imgHeightPx) * imgWidthPx;
                offsetX = (pageWidth - renderWidth) / 2;
            }

            pdf.addImage(imgData, "PNG", offsetX, offsetY, renderWidth, renderHeight);
            pdf.save(`${data.title || "documentation"}.pdf`);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Action Buttons */}
                <div className="flex gap-3 justify-end mb-6">
                    <button
                        onClick={generatePreview}
                        disabled={isGenerating}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Eye className="w-5 h-5" />
                        <span>تحديث المعاينة</span>
                    </button>
                    <button
                        onClick={downloadAsImage}
                        disabled={isDownloading}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        <span>تحميل صورة</span>
                    </button>
                    <button
                        onClick={downloadAsPDF}
                        disabled={isDownloading}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                    >
                        <FileDown className="w-5 h-5" />
                        <span>تحميل PDF</span>
                    </button>
                </div>

                {/* Preview */}
                {previewImage && (
                    <div className="bg-white p-4 rounded-xl shadow-2xl">
                        <img
                            src={previewImage}
                            onClick={() => setIsLightBoxOpen(true)}
                            alt="Preview"
                            className="w-full h-auto cursor-pointer"
                        />
                    </div>
                )}

                {/* Hidden A4 Document */}
                <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                    <div
                        ref={documentRef}
                        style={{
                            width: `${A4_WIDTH_PX}px`,
                            height: "1754px",
                            backgroundColor: "#F5F1E8",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            direction: "rtl",
                            fontFamily: "Arial, sans-serif",
                        }}
                    >
                        {/* Outer Border */}
                        <div
                            style={{
                                width: "96%",
                                height: "96%",
                                border: "5px solid #8B4513",
                                borderRadius: "20px",
                                padding: "40px",
                                backgroundColor: "#F5F1E8",
                                display: "flex",
                                flexDirection: "column",
                                gap: "25px",
                                justifyContent: "center",
                            }}
                        >
                            {/* Header */}
                            <div
                                style={{
                                    border: "2px solid #8B4513",
                                    borderRadius: "15px",
                                    padding: "30px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: "#FFFFFF",
                                    marginTop: "40px",
                                }}
                            >
                                <div className="flex flex-col">
                                    <img src={EducationMinistryLogo} className="max-w-40" />
                                    <div style={{ textAlign: "center", fontSize: "16px", lineHeight: "1.8" }}>
                                        <div style={{ fontWeight: "bold", color: "#000" }}>وزارة التربية</div>
                                        <div>الإدارة العامة لمنطقة</div>
                                        <div>{data.area || "الجهراء"} التعليمية</div>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        fontSize: "44px",
                                        fontWeight: "bold",
                                        color: "#8B4513",
                                        flex: 1,
                                        textAlign: "center",
                                    }}
                                >
                                    {data.school || "مدرسة الاصمعي الثانوية"}
                                </div>

                                {/* ✅ Use custom logo if provided, otherwise hide */}
                                {logoUrl ? (
                                    <img src={logoUrl} className="max-w-40" />
                                ) : null}
                            </div>

                            {/* Title */}
                            <div
                                className="font-amiri"
                                style={{
                                    border: "2px solid #8B4513",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    textAlign: "center",
                                    fontSize: "44px",
                                    fontWeight: "bold",
                                    color: "#8B4513",
                                    backgroundColor: "#FFFFFF",
                                }}
                            >
                                {data.title || "عنوان التوثيق"}
                            </div>

                            {/* Info Grid */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "20px",
                                }}
                            >
                                <InfoBox
                                    label={data.teacherGender === "male" ? "المعلم" : "المعلمة"}
                                    value={data.teacherName || "يعقوب"}
                                />
                                <InfoBox label="القسم" value={data.department || "الإدارة"} />
                                <InfoBox label="المكان" value={data.place || "شارع مدرسة الاصمعي"} />
                                <InfoBox label="التاريخ" value={formatDate(data.date)} />
                                <InfoBox label="نوع الفعالية" value={data.eventType || "احتفال بالطلاب الناجحين"} />
                                <InfoBox label="الفئة المستهدفة" value={data.targetGroup || "الصف الثالث الثانوي"} />
                            </div>

                            {/* Description */}
                            {hasDescription && (
                                <div
                                    style={{
                                        border: "2px solid #8B4513",
                                        borderRadius: "12px",
                                        padding: "30px",
                                        backgroundColor: "#FFFFFF",
                                        fontSize: "18px",
                                        lineHeight: "2",
                                    }}
                                >
                                    <div style={{ fontWeight: "bold", marginBottom: "15px", fontSize: "20px" }}>الشرح</div>
                                    <div>{data.description}</div>
                                </div>
                            )}

                            {/* Images */}
                            {hasImages && (
                                <div
                                    style={{
                                        display: "grid",
                                        gap: "15px",
                                        gridTemplateColumns:
                                            imageUrls.length === 1
                                                ? "1fr"
                                                : imageUrls.length === 3
                                                    ? "1fr 1fr"
                                                    : "1fr 1fr",
                                        justifyItems: imageUrls.length === 3 ? "center" : "stretch",
                                    }}
                                >
                                    {imageUrls.map((img, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                border: "1px solid #ddd",
                                                borderRadius: "8px",
                                                overflow: "hidden",
                                                height: imageUrls.length <= 2 ? "300px" : "200px",
                                                gridColumn: imageUrls.length === 3 && i === 2 ? "1 / span 2" : "auto",
                                                width: imageUrls.length === 3 && i === 2 ? "50%" : "100%",
                                            }}
                                        >
                                            <img src={img} alt={`صورة ${i + 1}`} style={{ width: "100%", height: "100%" }} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Footer */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "end",
                                    alignItems: "center",
                                    textAlign: "center",
                                    fontSize: "32px",
                                    color: "#666",
                                    paddingTop: "20px",
                                    paddingLeft: "44px",
                                }}
                            >
                                <div>
                                    {data.managerGender === "male" ? "مدير المدرسة" : "مديرة المدرسة"}
                                    <br />
                                    <span style={{ fontWeight: "bold", color: "#000" }}>
                                        {data.managerName || "المدير محمود"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Lightbox open={isLightBoxOpen} close={() => setIsLightBoxOpen(false)} slides={[{ src: previewImage }]} />
        </div>
    );
}

function InfoBox({ label, value }: { label: string; value: string }) {
    return (
        <div
            style={{
                border: "2px solid #8B4513",
                borderRadius: "10px",
                padding: "20px",
                backgroundColor: "#FFFFFF",
                fontSize: "40px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
            }}
        >
            <div style={{ color: "#8B4513", fontWeight: "bold" }} className="font-alhoda whitespace-nowrap">{label} :</div>
            <div style={{ color: "#000", fontSize: "40px" }} className="font-cairo whitespace-nowrap">{value}</div>
        </div>
    );
}
