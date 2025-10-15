"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import { Download, FileDown, Eye, Edit, Palette } from "lucide-react"
import Lightbox from "yet-another-react-lightbox"
import EducationMinistryLogo from "@/assets/شعار_وزارة_التعليم_العالي__الكويت_.png"

export interface DocumentationData {
    title: string
    area: string
    school: string
    teacherGender: string
    teacherName: string
    department: string
    departmentManager?: string;
    departmentManagerGender?: string;
    place: string
    date: string
    managerGender: string
    managerName: string
    eventType: string
    targetGroup: string
    description: string
    images: File[] | string[]
    logoPicture?: File | string
    colors?: {
        headerBg?: string
        headerText?: string
        headerBorder?: string
        containerBg?: string
        containerText?: string
        containerBorder?: string
        inputBg?: string
        inputText?: string
        inputBorder?: string
        inputLabelText?: string
        titleText?: string
        titleBorder?: string
        titleBg?: string

        manager?: string;
        managerGender?: string;
        departmentManager?: string;
        departmentManagerGender?: string;
    }
}

const A4_WIDTH_PX = 1240

export default function ProjectDocumentationPreview({
    data,
    onRequestChange,
}: {
    data: DocumentationData
    onRequestChange: () => void
}) {
    const documentRef = useRef<HTMLDivElement>(null)
    const [isDownloading, setIsDownloading] = useState(false)
    const [previewImage, setPreviewImage] = useState<string>("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);

    // ✅ Extract colors with fallbacks
    const colors = {
        headerBg: data.colors?.headerBg || "#FFFFFF",
        headerText: data.colors?.headerText || "#8B4513",
        headerBorder: data.colors?.headerBorder || "#8B4513",

        containerBg: data.colors?.containerBg || "#F5F1E8",
        containerText: data.colors?.containerText || "#000000",
        containerBorder: data.colors?.containerBorder || "#8B4513",

        inputBg: data.colors?.inputBg || "#FFFFFF",
        inputText: data.colors?.inputText || "#000000",
        inputBorder: data.colors?.inputBorder || "#8B4513",
        inputLabelText: data.colors?.inputLabelText || "#8B4513",

        titleText: data.colors?.titleText || "#8B4513",
        titleBorder: data.colors?.titleBorder || "#8B4513",
        titleBg: data.colors?.titleBg || "#FFFFFF",

        // ✅ إضافات جديدة خاصة بالمديرين
        manager: data.colors?.manager || "#000000",
        managerGender: data.colors?.managerGender || "#8B4513",
        departmentManager: data.colors?.departmentManager || "#000000",
        departmentManagerGender: data.colors?.departmentManagerGender || "#8B4513",
    }


    const imageUrls = useMemo(() => {
        return data.images.map((value) => (typeof value === "string" ? value : URL.createObjectURL(value)))
    }, [data.images])

    const logoUrl = useMemo(() => {
        if (!data.logoPicture) return null
        return typeof data.logoPicture === "string" ? data.logoPicture : URL.createObjectURL(data.logoPicture)
    }, [data.logoPicture])

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "............"
        const d = new Date(dateStr)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        return `${year}/${month}/${day}`
    }

    const hasDescription = data.description && data.description.trim()
    const hasImages = imageUrls.length > 0;

    const generatePreview = async () => {
        if (!documentRef.current) return
        setIsGenerating(true)
        try {
            const canvas = await html2canvas(documentRef.current, {
                scale: 2,
                backgroundColor: colors.containerBg,
                logging: false,
            })
            setPreviewImage(canvas.toDataURL("image/png"))
        } catch (error) {
            console.error("Error generating preview:", error)
        } finally {
            setIsGenerating(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(generatePreview, 100)
        return () => clearTimeout(timer)
    }, [data, imageUrls, logoUrl])

    const downloadAsImage = async () => {
        if (!documentRef.current) return
        setIsDownloading(true)
        try {
            const canvas = await html2canvas(documentRef.current, {
                scale: 3,
                backgroundColor: colors.containerBg,
                logging: false,
            })
            const imgData = canvas.toDataURL("image/png")
            const link = document.createElement("a")
            link.href = imgData
            link.download = `${data.title || "documentation"}.png`
            link.click()
        } finally {
            setIsDownloading(false)
        }
    }

    const downloadAsPDF = async () => {
        if (!documentRef.current) return
        setIsDownloading(true)

        try {
            const canvas = await html2canvas(documentRef.current, {
                scale: 3,
                backgroundColor: colors.containerBg,
                logging: false,
            })
            const imgData = canvas.toDataURL("image/png")

            const pdf = new jsPDF("p", "mm", "a4")
            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()

            const imgWidthPx = canvas.width
            const imgHeightPx = canvas.height
            const pageRatio = pageWidth / pageHeight
            const imgRatio = imgWidthPx / imgHeightPx

            let renderWidth = pageWidth
            let renderHeight = pageHeight
            let offsetX = 0
            let offsetY = 0

            if (imgRatio > pageRatio) {
                renderHeight = (pageWidth / imgWidthPx) * imgHeightPx
                offsetY = (pageHeight - renderHeight) / 2
            } else {
                renderWidth = (pageHeight / imgHeightPx) * imgWidthPx
                offsetX = (pageWidth - renderWidth) / 2
            }

            pdf.addImage(imgData, "PNG", offsetX, offsetY, renderWidth, renderHeight)
            pdf.save(`${data.title || "documentation"}.pdf`)
        } finally {
            setIsDownloading(false)
        }
    }

    const exportColorsAsJSON = () => {
        const colorsToExport = {
            headerBg: colors.headerBg,
            headerText: colors.headerText,
            headerBorder: colors.headerBorder,
            containerBg: colors.containerBg,
            containerText: colors.containerText,
            containerBorder: colors.containerBorder,
            inputBg: colors.inputBg,
            inputText: colors.inputText,
            inputBorder: colors.inputBorder,
            inputLabelText: colors.inputLabelText,
            titleText: colors.titleText,
            titleBorder: colors.titleBorder,
            titleBg: colors.titleBg,

            manager: colors.manager,
            managerGender: colors.managerGender,
            departmentManager: colors.departmentManager,
            departmentManagerGender: colors.departmentManagerGender,
        }

        const jsonString = JSON.stringify(colorsToExport, null, 2)
        const blob = new Blob([jsonString], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${data.title || "documentation"}-colors.json`
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Buttons */}
                <div className="flex flex-col md:flex-row gap-3 justify-end mb-6 px-4">
                    <button
                        onClick={generatePreview}
                        disabled={isGenerating}
                        className="text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Eye className="w-5 h-5" />
                        <span>تحديث المعاينة</span>
                    </button>
                    <button
                        onClick={exportColorsAsJSON}
                        className="text-center px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                    >
                        <Palette className="w-5 h-5" />
                        <span>تصدير الألوان</span>
                    </button>
                    <button
                        onClick={downloadAsImage}
                        disabled={isDownloading}
                        className="text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        <span>تحميل صورة</span>
                    </button>
                    <button
                        onClick={downloadAsPDF}
                        disabled={isDownloading}
                        className="text-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                    >
                        <FileDown className="w-5 h-5" />
                        <span>تحميل PDF</span>
                    </button>
                </div>

                {/* تعديل */}
                <div className="px-4 mb-6">
                    <button
                        className="w-full px-6 py-4 flex items-center justify-center gap-2 rounded-xl font-medium bg-gradient-to-br from-[var(--color-primary)] via-primary/70 to-[var(--color-primary)] text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 ease-out hover:-translate-y-[2px] active:translate-y-0 disabled:opacity-50 cursor-pointer"
                        onClick={onRequestChange}
                    >
                        تعديل <Edit className="w-4 h-4" />
                    </button>
                </div>

                {/* معاينة */}
                {previewImage && (
                    <div className="bg-white p-4 rounded-xl shadow-2xl">
                        <img
                            src={previewImage || "/placeholder.svg"}
                            onClick={() => setIsLightBoxOpen(true)}
                            alt="Preview"
                            className="w-full h-auto cursor-pointer"
                        />
                    </div>
                )}

                {/* مستند الطباعة */}
                <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                    <div
                        ref={documentRef}
                        style={{
                            width: `${A4_WIDTH_PX}px`,
                            height: `${A4_WIDTH_PX * (297 / 210)}px`,
                            backgroundColor: colors.containerBg,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            direction: "rtl",
                            fontFamily: "Arial, sans-serif",
                            color: colors.containerText,
                        }}
                    >
                        <div
                            style={{
                                width: "96%",
                                height: "calc(1754px * 0.96)",
                                border: `5px solid ${colors.containerBorder}`,
                                borderRadius: "20px",
                                padding: "40px",
                                backgroundColor: colors.containerBg,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                gap: "25px",
                                overflow: "hidden",
                            }}
                        >
                            {/* Header */}
                            <div
                                style={{
                                    border: `2px solid ${colors.headerBorder}`,
                                    borderRadius: "15px",
                                    padding: "30px 70px",
                                    maxHeight: "278px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: colors.headerBg,
                                    marginTop: "20px",
                                    color: colors.headerText,
                                }}
                            >
                                <div className="flex flex-col items-center font-almaria">
                                    <img src={EducationMinistryLogo || "/placeholder.svg"} className="max-w-40" />
                                    <div style={{ textAlign: "center", fontSize: "25px", lineHeight: "1.8" }}>
                                        <div style={{ fontWeight: "bold" }}>وزارة التربية</div>
                                        <div>الإدارة العامة لمنطقة</div>
                                        <div>{data.area || "الجهراء"} التعليمية</div>
                                    </div>
                                </div>

                                <div
                                    className="font-almaria text-center"
                                    style={{
                                        fontSize: "56px",
                                        fontWeight: "bold",
                                        color: colors.headerText,
                                        flex: 1,
                                        textAlign: "center",
                                    }}
                                >
                                    {data.school || "مدرسة الاصمعي الثانوية"}
                                </div>

                                {logoUrl ? <img src={logoUrl || "/placeholder.svg"} className="max-w-60" /> : null}
                            </div>

                            {/* Title */}
                            <div
                                className="font-amiri"
                                style={{
                                    border: `2px solid ${colors.titleBorder}`,
                                    borderRadius: "12px",
                                    padding: "20px",
                                    textAlign: "center",
                                    fontSize: "44px",
                                    fontWeight: "bold",
                                    color: colors.titleText,
                                    backgroundColor: colors.titleBg,
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
                                    colors={colors}
                                />
                                <InfoBox label="القسم" value={data.department || "الإدارة"} colors={colors} />
                                <InfoBox label="المكان" value={data.place || "شارع مدرسة الاصمعي"} colors={colors} />
                                <InfoBox label="التاريخ" value={formatDate(data.date)} colors={colors} />
                                <InfoBox label="نوع الفعالية" value={data.eventType || "احتفال"} colors={colors} />
                                <InfoBox label="الفئة المستهدفة" value={data.targetGroup || "الصف الثالث"} colors={colors} />
                            </div>

                            {/* Description */}
                            {hasDescription && (
                                <div
                                    style={{
                                        maxWidth: `${A4_WIDTH_PX}px`,
                                        border: `2px solid ${colors.inputBorder}`,
                                        backgroundColor: colors.inputBg,
                                        borderRadius: "12px",
                                        padding: "20px 25px",
                                        lineHeight: "1.8",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {/* <div style={{ fontWeight: "bold", marginBottom: "10px", color: colors.inputLabelText }} className="font-alhoda text-4xl" >
                                        الشرح
                                    </div> */}
                                    <div style={{
                                        color: colors.inputText
                                    }}
                                        className="font-cairo text-4xl line-clamp-2 overflow-visible">
                                        {data.description}
                                    </div>

                                </div>
                            )}

                            {
                                hasImages && (
                                    <div
                                        className="mt-auto mb-auto"
                                        style={{
                                            display: "grid",
                                            gap: "15px",
                                            gridTemplateColumns: "repeat(2, 1fr)",
                                        }}
                                    >
                                        {imageUrls.map((img, index) => {
                                            let style: React.CSSProperties = {}

                                            switch (imageUrls.length) {
                                                case 1:
                                                    style = { gridColumn: "span 2", gridRow: "span 2" }
                                                    break
                                                case 2:
                                                    style = { gridColumn: "span 1", gridRow: "span 2" }
                                                    break
                                                case 3:
                                                    if (index < 2) {
                                                        style = { gridColumn: "span 1", gridRow: "span 1" }
                                                    } else {
                                                        style = { gridColumn: "span 2", gridRow: "span 1" }
                                                    }
                                                    break
                                                case 4:
                                                    style = { gridColumn: "span 1", gridRow: "span 2" }
                                                    break
                                                default:
                                                    style = { gridColumn: "span 1", gridRow: "span 1" }
                                            }

                                            return <img key={index} src={img} style={{ width: "100%", height: "100%", ...style, maxHeight: "250px" }} />
                                        })}
                                    </div>
                                )
                            }


                            {
                                ((!!data.managerGender && !!data.managerName) || (!!data.departmentManager && !!data.departmentManagerGender)) && (
                                    <div
                                        className="flex justify-between"
                                        style={{
                                            marginTop: hasImages ? "auto" : "",
                                            marginBottom: hasImages ? "auto" : ""
                                        }}
                                    >
                                        {/* ✅ مدير القسم */}
                                        {!!data.departmentManager && !!data.departmentManagerGender ? (
                                            <div
                                                className="text-[40px] flex flex-col items-center w-fit"

                                            >
                                                <span style={{ color: colors.departmentManagerGender }}>
                                                    {data.departmentManagerGender === "male" ? "رئيس القسم" : "رئيسة القسم"}
                                                </span>
                                                <span className="font-bold" style={{ color: colors.departmentManager }}>  {data.departmentManager}</span>
                                            </div>
                                        ) : <div></div>}

                                        {/* ✅ مدير المدرسة */}
                                        {!!data.managerGender && !!data.managerName && (
                                            <div
                                                className="text-[40px] flex flex-col items-center w-fit"
                                            >
                                                <span style={{ color: colors.managerGender }}>
                                                    {data.managerGender === "male" ? "مدير المدرسة" : "مديرة المدرسة"}
                                                </span>
                                                <span className="font-bold" style={{ color: colors.manager }}>{data.managerName}</span>
                                            </div>
                                        )}
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>

            <Lightbox open={isLightBoxOpen} close={() => setIsLightBoxOpen(false)} slides={[{ src: previewImage }]} />
        </div>
    )
}

function InfoBox({
    label,
    value,
    colors,
}: {
    label: string
    value: string
    colors: DocumentationData["colors"]
}) {
    return (
        <div
            style={{
                border: `2px solid ${colors?.inputBorder || "#8B4513"}`,
                borderRadius: "10px",
                padding: "20px",
                backgroundColor: colors?.inputBg || "#FFFFFF",
                fontSize: "40px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
            }}
        >
            <div style={{ fontWeight: "bold", color: colors?.inputLabelText }} className="font-alhoda whitespace-nowrap">
                {label} :
            </div>
            <div className="font-cairo whitespace-nowrap" style={{ color: colors?.inputText || "#000" }}>
                {value}
            </div>
        </div>
    )
}
