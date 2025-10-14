import { useMemo, useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Download, FileDown, Eye } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import EducationMinistryLogo from "@/assets/شعار_وزارة_التعليم_العالي_(الكويت).jpg";

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

const A4_WIDTH_PX = 1240;

export default function ProjectDocumentationPreview({ data }: { data: DocumentationData }) {
    const documentRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);

    const imageUrls = useMemo(() => {
        return data.images.map(value => {
            if (typeof value === "string") return value;
            return URL.createObjectURL(value);
        });
    }, [data]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "............";
        const d = new Date(dateStr);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
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
                backgroundColor: '#F5F1E8',
                logging: false
            });

            const imgData = canvas.toDataURL("image/png");
            setPreviewImage(imgData);
        } catch (error) {
            console.error("Error generating preview:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            generatePreview();
        }, 100);
        return () => clearTimeout(timer);
    }, [data, imageUrls]);

    const downloadAsImage = async () => {
        if (!documentRef.current) return;
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(documentRef.current, {
                scale: 3,
                backgroundColor: '#F5F1E8',
                logging: false
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
                backgroundColor: '#F5F1E8',
                logging: false
            });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * pageWidth) / canvas.width;

            if (imgHeight <= pageHeight) {
                pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            } else {
                pdf.addImage(imgData, "PNG", 0, 0, imgWidth, pageHeight);
            }

            pdf.save(`${data.title || "documentation"}.pdf`);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                {/* Action Buttons */}
                <div className="flex gap-3 justify-end mb-6">
                    <button
                        onClick={generatePreview}
                        disabled={isGenerating}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Eye className="w-5 h-5" />
                        <span>تحديث المعاينة</span>
                    </button>
                    <button
                        onClick={downloadAsImage}
                        disabled={isDownloading}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        <span>تحميل صورة</span>
                    </button>
                    <button
                        onClick={downloadAsPDF}
                        disabled={isDownloading}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                            style={{ maxWidth: '100%' }}
                        />
                    </div>
                )}

                {/* Hidden A4 Document */}
                <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                    <div
                        ref={documentRef}
                        style={{
                            width: `${A4_WIDTH_PX}px`,
                            minHeight: 'auto',
                            backgroundColor: '#F5F1E8',
                            padding: '60px',
                            boxSizing: 'border-box',
                            direction: 'rtl',
                            fontFamily: 'Arial, sans-serif'
                        }}
                    >
                        {/* Outer Border */}
                        <div style={{
                            width: '100%',
                            border: '3px solid #8B4513',
                            borderRadius: '20px',
                            padding: '30px',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '25px'
                        }}>
                            {/* Header Section */}
                            <div style={{
                                border: '2px solid #8B4513',
                                borderRadius: '15px',
                                padding: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#FFFFFF'
                            }}>
                                <img src={EducationMinistryLogo} className="max-w-40" />
                                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8B4513', flex: 1, textAlign: 'center' }}>
                                    {data.school || "مدرسة الاصمعي الثانوية"}
                                </div>
                                <div style={{ textAlign: 'center', fontSize: '16px', lineHeight: '1.8' }}>
                                    <div style={{ fontWeight: 'bold', color: '#000' }}>وزارة التربية</div>
                                    <div>الإدارة العامة لمنطقة</div>
                                    <div>{data.area || "الجهراء"} التعليمية</div>
                                </div>

                            </div>

                            {/* Title */}
                            <div style={{
                                border: '2px solid #8B4513',
                                borderRadius: '12px',
                                padding: '20px',
                                textAlign: 'center',
                                fontSize: '26px',
                                fontWeight: 'bold',
                                color: '#8B4513',
                                backgroundColor: '#FFFFFF'
                            }}>
                                {data.title || "عنوان التوثيق"}
                            </div>

                            {/* Info Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px'
                            }}>
                                <InfoBox
                                    label={data.teacherGender === "male" ? "المعلم" : "المعلمة"}
                                    value={data.teacherName || "يعقوب"}
                                />
                                <InfoBox
                                    label="القسم"
                                    value={data.department || "الإدارة"}
                                />
                                <InfoBox
                                    label="المكان"
                                    value={data.place || "شارع مدرسة الاصمعي"}
                                />
                                <InfoBox
                                    label="التاريخ"
                                    value={formatDate(data.date)}
                                />
                                <InfoBox
                                    label="نوع الفعالية"
                                    value={data.eventType || "احتفال بالطلاب الناجحين"}
                                />
                                <InfoBox
                                    label="الفئة المستهدفة"
                                    value={data.targetGroup || "الصف الثالث الثانوي"}
                                />
                            </div>

                            {/* Description - only if exists */}
                            {hasDescription && (
                                <div style={{
                                    border: '2px solid #8B4513',
                                    borderRadius: '12px',
                                    padding: '30px',
                                    backgroundColor: '#FFFFFF',
                                    fontSize: '18px',
                                    lineHeight: '2'
                                }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '20px' }}>الشرح</div>
                                    <div>{data.description}</div>
                                </div>
                            )}

                            {/* Images Section - only if exists */}
                            <div
                                style={{
                                    display: 'grid',
                                    gap: '15px',
                                    gridTemplateColumns:
                                        imageUrls.length === 1
                                            ? '1fr'
                                            : imageUrls.length === 3
                                                ? '1fr 1fr' // صفين اثنين، الثالث سيكون في صف جديد
                                                : '1fr 1fr',
                                    justifyItems: imageUrls.length === 3 ? 'center' : 'stretch',
                                }}
                            >
                                {imageUrls.map((img, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            height:
                                                imageUrls.length <= 2
                                                    ? '300px'
                                                    : '200px',
                                            gridColumn:
                                                imageUrls.length === 3 && i === 2
                                                    ? '1 / span 2' // يجعل الصورة الثالثة في صف جديد بمنتصف العرض
                                                    : 'auto',
                                            width: imageUrls.length === 3 && i === 2 ? '50%' : '100%',
                                        }}
                                    >
                                        <img
                                            src={img}
                                            alt={`صورة ${i + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                // objectFit: 'cover',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>


                            {/* Footer */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '16px',
                                color: '#666',
                                paddingTop: '20px'
                            }}>
                                <div>
                                    {data.managerGender === "male" ? "مدير المدرسة" : "مديرة المدرسة"}
                                    <br />
                                    <span style={{ fontWeight: 'bold', color: '#000' }}>
                                        {data.managerName || "المدير محمود"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Lightbox
                open={isLightBoxOpen}
                close={() => setIsLightBoxOpen(false)}
                slides={[{ src: previewImage }]}
            />

        </div>
    );
}

function InfoBox({ label, value }: { label: string; value: string }) {
    return (
        <div style={{
            border: '2px solid #8B4513',
            borderRadius: '10px',
            padding: '20px',
            backgroundColor: '#FFFFFF',
            fontSize: '18px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
        }}>
            <div style={{ color: '#8B4513', fontWeight: 'bold' }}>
                {label}:
            </div>
            <div style={{ color: '#000', fontSize: '20px' }}>
                {value}
            </div>
        </div>
    );
}