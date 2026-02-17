"use client"

import type React from "react"

import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import { type DocumentationData, DocumentationTemplateViewer, SAMPLE_DATA } from "./documentation"
import "react-datepicker/dist/react-datepicker.css"
import { ChevronDown } from "lucide-react"
import "./datepicker-style.css";

interface Props {
    onSubmit?: (data: DocumentationData) => void
    initialData?: Partial<DocumentationData>
}

const defaultColors = {
    headerBg: "#FFFFFF",
    headerText: "#3E2C1C", // --color-text-base
    headerBorder: "#C19A6B", // --color-primary
    containerBg: "#F5F5DC", // --color-bg-base
    containerBorder: "#C19A6B", // --color-primary
    inputBg: "#FFFFFF", // --color-bg-container
    inputText: "#3E2C1C", // --color-text-base
    inputBorder: "#C19A6B", // --color-primary
    inputLabelText: "#6B4F3B", // --color-text-secondary
    titleText: "#3E2C1C", // --color-text-base
    titleBorder: "#C19A6B", // --color-primary
    titleBg: "#FFFFFF",
    manager: "#3E2C1C",
    managerGender: "#C19A6B",
    departmentManager: "#3E2C1C",
    departmentManagerGender: "#C19A6B",
};


const PREMIUM_TEMPLATES = [
    {
        id: "classic_premium",
        name: "Classic Premium",
        colors: {
            headerBg: "#FFFFFF",
            headerText: "#3E2C1C", // --color-text-base
            headerBorder: "#C19A6B", // --color-primary
            containerBg: "#F5F5DC", // --color-bg-base
            containerBorder: "#C19A6B", // --color-primary
            inputBg: "#FFFFFF", // --color-bg-container
            inputText: "#3E2C1C", // --color-text-base
            inputBorder: "#C19A6B", // --color-primary
            inputLabelText: "#6B4F3B", // --color-text-secondary
            titleText: "#3E2C1C", // --color-text-base
            titleBg: "#FFFFFF",
            titleBorder: "#C19A6B", // --color-primary
            manager: "#3E2C1C",
            managerGender: "#C19A6B",
            departmentManager: "#3E2C1C",
            departmentManagerGender: "#C19A6B",
        }
    },
    {
        id: "midnight",
        name: "Midnight Professional",
        colors: {
            headerBg: "#1A1B26",
            headerText: "#A9B1D6",
            headerBorder: "#24283B",
            containerBg: "#16161E",
            containerBorder: "#24283B",
            inputBg: "#1A1B26",
            inputText: "#C0CAF5",
            inputBorder: "#414868",
            inputLabelText: "#7AA2F7",
            titleText: "#7AA2F7",
            titleBg: "#1A1B26",
            titleBorder: "#7AA2F7",
            manager: "#C0CAF5",
            managerGender: "#7AA2F7",
            departmentManager: "#C0CAF5",
            departmentManagerGender: "#7AA2F7",
        }
    },
    {
        id: "royal",
        name: "Royal Gold",
        colors: {
            headerBg: "#111827",
            headerText: "#FCD34D",
            headerBorder: "#F59E0B",
            containerBg: "#1F2937",
            containerBorder: "#F59E0B",
            inputBg: "#374151",
            inputText: "#F3F4F6",
            inputBorder: "#F59E0B",
            inputLabelText: "#FCD34D",
            titleText: "#111827",
            titleBg: "#FCD34D",
            titleBorder: "#F59E0B",
            manager: "#F3F4F6",
            managerGender: "#FCD34D",
            departmentManager: "#F3F4F6",
            departmentManagerGender: "#FCD34D",
        }
    },
    {
        id: "corporate",
        name: "Corporate Blue",
        colors: {
            headerBg: "#1E3A8A",
            headerText: "#FFFFFF",
            headerBorder: "#60A5FA",
            containerBg: "#EFF6FF",
            containerBorder: "#1E3A8A",
            inputBg: "#FFFFFF",
            inputText: "#1E3A8A",
            inputBorder: "#BFDBFE",
            inputLabelText: "#1E40AF",
            titleText: "#1E3A8A",
            titleBg: "#DBEAFE",
            titleBorder: "#2563EB",
            manager: "#1E3A8A",
            managerGender: "#2563EB",
            departmentManager: "#1E3A8A",
            departmentManagerGender: "#2563EB",
        }
    },
    {
        id: "forest",
        name: "Emerald Executive",
        colors: {
            headerBg: "#064E3B",
            headerText: "#ECFDF5",
            headerBorder: "#34D399",
            containerBg: "#F0FDF4",
            containerBorder: "#059669",
            inputBg: "#FFFFFF",
            inputText: "#064E3B",
            inputBorder: "#6EE7B7",
            inputLabelText: "#047857",
            titleText: "#065F46",
            titleBg: "#D1FAE5",
            titleBorder: "#059669",
            manager: "#064E3B",
            managerGender: "#059669",
            departmentManager: "#064E3B",
            departmentManagerGender: "#059669",
        }
    },
    {
        id: "minimal",
        name: "Modern Slate",
        colors: {
            headerBg: "#0F172A",
            headerText: "#F8FAFC",
            headerBorder: "#334155",
            containerBg: "#F8FAFC",
            containerBorder: "#334155",
            inputBg: "#FFFFFF",
            inputText: "#0F172A",
            inputBorder: "#CBD5E1",
            inputLabelText: "#334155",
            titleText: "#0F172A",
            titleBg: "#E2E8F0",
            titleBorder: "#475569",
            manager: "#0F172A",
            managerGender: "#475569",
            departmentManager: "#0F172A",
            departmentManagerGender: "#475569",
        }
    },
    {
        id: "warm",
        name: "Luxury Warmth",
        colors: {
            headerBg: "#431407",
            headerText: "#FFEDD5",
            headerBorder: "#FB923C",
            containerBg: "#FFF7ED",
            containerBorder: "#9A3412",
            inputBg: "#FFFFFF",
            inputText: "#431407",
            inputBorder: "#FDBA74",
            inputLabelText: "#9A3412",
            titleText: "#431407",
            titleBg: "#FFEDD5",
            titleBorder: "#EA580C",
            manager: "#431407",
            managerGender: "#C2410C",
            departmentManager: "#431407",
            departmentManagerGender: "#C2410C",
        }
    }
];

function MiniFormPreview({ colors }: { colors: typeof defaultColors }) {
    // scale = card width / A4 width
    // Card width approx 150px? A4 = 1240px. 
    // 150 / 1240 ~= 0.12
    const scale = 0.13;

    return (
        <div className="w-full h-full overflow-hidden bg-gray-50 flex items-start justify-center relative">
            <div
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top center",
                    width: "1240px", // Match A4_WIDTH_PX
                    height: "1754px", // Match calculated height in viewer
                    direction: "rtl", // Ensure RTL layout for correct positioning
                    flexShrink: 0, // Prevent container from shrinking in flex layout
                }}
            >
                <DocumentationTemplateViewer
                    data={SAMPLE_DATA}
                    colors={colors}
                    imageUrls={[]}
                    logoUrl={null}
                />
            </div>
        </div>
    )
}


function ProjectDocumentation1Form({ onSubmit, initialData }: Props) {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState<Date | null>(null)
    const [images, setImages] = useState<File[]>([])
    const [logoPicture, setLogoPicture] = useState<File | null>(null)
    const [showColorSettings, setShowColorSettings] = useState(false)
    const [activeTab, setActiveTab] = useState<'custom' | 'templates'>('custom')

    const [colors, setColors] = useState<typeof defaultColors>(() => {
        // عند التحميل، نحاول قراءة الألوان من localStorage
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("projectColors")
            if (saved) {
                try {
                    return JSON.parse(saved)
                } catch (err) {
                    return defaultColors
                }
            }
        }
        return defaultColors
    })

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("projectColors", JSON.stringify(colors))
        }
    }, [colors]);

    useEffect(() => {
        if (initialData?.date) {
            setDate(new Date(initialData.date))
        }
        if (initialData?.images && Array.isArray(initialData.images)) {
            setImages(initialData.images.filter((i): i is File => i instanceof File))
        }
        if (initialData?.logoPicture && initialData.logoPicture instanceof File) {
            setLogoPicture(initialData.logoPicture)
        }
    }, [initialData])

    const handleColorChange = (key: string, value: string) => {
        setColors((prev: typeof defaultColors) => ({ ...prev, [key]: value }))
    }

    const exportToJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(colors, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "colors_template.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)
        formData.set("date", date?.toISOString() || "")
        images.forEach((img) => formData.append("images[]", img))
        if (logoPicture) formData.append("logoPicture", logoPicture)

        const data: any = Object.fromEntries(formData.entries())
        data.images = images
        data.date = date
        data.logoPicture = logoPicture
        data.colors = colors

        onSubmit?.(data)
        setLoading(false)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        setImages((prev: File[]) => [...prev, ...files])
    }

    const removeImage = (index: number) => {
        setImages((prev: File[]) => prev.filter((_, i) => i !== index))
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setLogoPicture(file)
    }

    // New helper to detect active template
    const getActiveTemplateId = () => {
        // Simple distinct color check (e.g. headerBg) to find match or return null
        const match = PREMIUM_TEMPLATES.find(t =>
            t.colors.headerBg === colors.headerBg &&
            t.colors.containerBg === colors.containerBg &&
            t.colors.inputBg === colors.inputBg
        );
        return match?.id;
    }

    const activeTemplateId = getActiveTemplateId();

    return (
        <form onSubmit={handleSubmit} className="bg-form-bg shadow-md rounded-2xl p-7 w-full max-w-4xl space-y-6">
            <div className="border border-form-border rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50">
                <button
                    type="button"
                    onClick={() => setShowColorSettings(!showColorSettings)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800">{t("documentation.colorsSettings")} </h3>
                    </div>
                    <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${showColorSettings ? "rotate-180" : ""
                            }`}
                    />
                </button>

                <div
                    className={`transition-all duration-300 ease-in-out ${showColorSettings ? "opacity-100 pb-6" : "max-h-0 opacity-0"
                        } overflow-hidden`}
                >
                    {/* Tab Switcher */}
                    <div className="px-6 pb-4">
                        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                            <button
                                type="button"
                                onClick={() => setActiveTab('custom')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'custom'
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                تطوير خاص
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('templates')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'templates'
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                قوالب جاهزة
                            </button>
                        </div>
                    </div>

                    {activeTab === 'custom' ? (
                        <div className="p-6 pt-2 flex flex-col gap-6">
                            {/* استيراد ملف JSON */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        استيراد الألوان من ملف JSON
                                    </label>

                                    <div className="relative group">
                                        <input
                                            id="importColors"
                                            type="file"
                                            accept="application/json"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                const reader = new FileReader();
                                                reader.onload = (ev) => {
                                                    try {
                                                        const imported = JSON.parse(ev.target?.result as string);
                                                        setColors((prev: typeof defaultColors) => ({ ...prev, ...imported }));
                                                        setTimeout(() => {
                                                            alert("تم استيراد الالوان بنجاح")
                                                        }, 300);
                                                    } catch (err) {
                                                        alert("ملف JSON غير صالح!");
                                                    }
                                                };
                                                reader.readAsText(file);
                                            }}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />

                                        <div className="h-14 rounded-lg border-2 border-gray-200 group-hover:border-purple-400 transition-all duration-200 flex items-center gap-3 px-4 bg-white shadow-sm group-hover:shadow-md">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 4v16m8-8H4"
                                                    />
                                                </svg>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium select-none group-hover:text-purple-600">
                                                اختر ملف JSON
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        تصدير الألوان الحالية
                                    </label>
                                    <button
                                        type="button"
                                        onClick={exportToJson}
                                        className="h-14 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-3 bg-white"
                                    >
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">تصدير كـ JSON</span>
                                    </button>
                                </div>
                            </div>


                            {/* جدول الألوان */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {Object.entries({
                                    headerBg: "لون خلفية الجزء العلوي",
                                    headerText: "لون نص الجزء العلوي",
                                    headerBorder: "لون اطار الجزء العلوي",
                                    containerBg: "لون خلفية الصفحة",
                                    containerBorder: "لون اطار الصفحة",
                                    inputBg: "لون خلفية حقل المعلومة",
                                    inputText: "لون نص حقل المعلومة",
                                    inputBorder: "لون اطار حقل المعلومة",
                                    inputLabelText: "لون عنوان حقل المعلومة",
                                    titleText: "لون نص العنوان",
                                    titleBg: "لون خلفية العنوان",
                                    titleBorder: "لون اطار العنوان",

                                    manager: "لون اسم مدير المدرسة",
                                    managerGender: "لون صفة مدير المدرسة",
                                    departmentManager: "لون اسم رئيس القسم",
                                    departmentManagerGender: "لون صفة رئيس القسم",
                                }).map(([key, label]) => (
                                    <div key={key} className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700">{label}</label>
                                        <div className="relative group">
                                            <input
                                                type="color"
                                                value={colors[key as keyof typeof colors]}
                                                onChange={(e) => handleColorChange(key, e.target.value)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="h-12 rounded-lg border-2 border-gray-200 group-hover:border-purple-400 transition-all duration-200 flex items-center gap-3 px-3 bg-white shadow-sm group-hover:shadow-md">
                                                <div
                                                    className="w-8 h-8 rounded-md border-2 border-white shadow-inner ring-1 ring-gray-200"
                                                    style={{ backgroundColor: colors[key as keyof typeof colors] }}
                                                />
                                                <span className="text-sm font-mono text-gray-600 select-none">
                                                    {colors[key as keyof typeof colors]}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="px-6 pt-2 pb-6">
                            <div className="grid grid-cols-3 gap-3 origin-top">
                                {PREMIUM_TEMPLATES.map((template) => {
                                    const isSelected = activeTemplateId === template.id;
                                    return (
                                        <button
                                            key={template.id}
                                            type="button"
                                            onClick={() => setColors(template.colors)}
                                            className={`group relative flex flex-col gap-2 p-2 rounded-xl transition-all text-right
                                                ${isSelected
                                                    ? 'border-2 border-purple-500 shadow-lg scale-105 bg-purple-50 ring-2 ring-purple-200'
                                                    : 'border border-gray-200 hover:border-purple-300 hover:shadow-md hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <div className={`w-full aspect-[4/3] rounded-lg overflow-hidden shadow-sm transition-transform ${isSelected ? 'scale-100' : 'scale-95'}`}>
                                                <MiniFormPreview colors={template.colors} />
                                            </div>

                                            <div className="flex items-center justify-between w-full px-1">
                                                <span className={`text-xs font-bold truncate transition-colors ${isSelected ? 'text-purple-700' : 'text-gray-700'}`}>
                                                    {template.name}
                                                </span>
                                                {isSelected && (
                                                    <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                                                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input name="title" label={t("documentation.title")} defaultValue={initialData?.title || ""} />

                <Input name="area" label={t("documentation.educationalArea")} defaultValue={initialData?.area || ""} />

                <Input name="school" label={t("documentation.schoolName")} defaultValue={initialData?.school || ""} />

                <Select
                    name="teacherGender"
                    label={t("documentation.teacherGender")}
                    defaultValue={initialData?.teacherGender || "male"}
                    options={[
                        { value: "male", label: t("documentation.maleTeacher") },
                        { value: "female", label: t("documentation.femaleTeacher") },
                        { value: "maleStudent", label: t("documentation.maleStudent") },
                        { value: "femaleStudent", label: t("documentation.femaleStudent") },
                    ]}
                />

                <Input
                    name="teacherName"
                    label={t("documentation.teacherName")}
                    defaultValue={initialData?.teacherName || ""}
                />

                <Input name="department" label={t("documentation.department")} defaultValue={initialData?.department || ""} />

                <Input name="place" label={t("documentation.place")} defaultValue={initialData?.place || ""} />

                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-form-label">{t("documentation.date")}</label>
                    <div className="relative">
                        <DatePicker
                            selected={date}
                            onChange={(d) => setDate(d)}
                            dateFormat="yyyy-MM-dd"
                            className="w-full rounded-lg border-2 border-form-border bg-white px-4 py-2.5 text-form-text focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm hover:shadow-md"
                            placeholderText={t("documentation.date")}
                            calendarClassName="modern-calendar"
                            wrapperClassName="w-full"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <Select
                    name="managerGender"
                    label={t("documentation.managerGender")}
                    defaultValue={initialData?.managerGender || "male"}
                    options={[
                        { value: "male", label: t("documentation.maleManager") },
                        { value: "female", label: t("documentation.femaleManager") },
                    ]}
                />

                <Input
                    name="managerName"
                    label={t("documentation.managerName")}
                    defaultValue={initialData?.managerName || ""}
                />

                <Select
                    name="departmentManagerGender"
                    label={t("documentation.departmentManagerGender")}
                    defaultValue={initialData?.departmentManagerGender || "male"}
                    options={[
                        { value: "male", label: t("documentation.maleDepartmentManager") },
                        { value: "female", label: t("documentation.femaleDepartmentManager") },
                    ]}
                />

                <Input
                    name="departmentManager"
                    label={t("documentation.departmentManager")}
                    defaultValue={initialData?.departmentManager || ""}
                />

                <Input
                    name="targetGroup"
                    label={t("documentation.targetGroup")}
                    defaultValue={initialData?.targetGroup || ""}
                />

                <Input name="eventType" label={t("documentation.eventType")} defaultValue={initialData?.eventType || ""} />
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-form-label">{t("documentation.description")}</label>
                <textarea
                    name="description"
                    defaultValue={initialData?.description || ""}
                    placeholder={t("documentation.descriptionPlaceholder")}
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition h-28 resize-none"
                />
            </div>

            <div className="flex flex-col space-y-3">
                <label className="mb-1 text-sm font-medium text-form-label">{t("documentation.logoPicture")}</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary-hover transition"
                />
                {logoPicture && (
                    <div className="relative w-32 h-32 border border-form-border rounded-lg overflow-hidden">
                        <img
                            src={URL.createObjectURL(logoPicture) || "/placeholder.svg"}
                            alt="Logo Preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => setLogoPicture(null)}
                            className="absolute top-1 right-1 bg-error text-white rounded-full p-1 text-xs"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col space-y-3">
                <label className="mb-1 text-sm font-medium text-form-label">{t("documentation.images")}</label>
                <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary-hover transition"
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((file, idx) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden border border-form-border">
                            <img
                                src={URL.createObjectURL(file) || "/placeholder.svg"}
                                alt="preview"
                                className="w-full h-32 object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-error text-white rounded-full p-1 text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between">
                <div className="font-semibold">
                    لحصول على نموذج مثالي
                    <br />
                    * إضافة الصور بالوضع الأفقي (عرض)،
                    لضمان وضوح الصورة وجمال تنسيق النموذج.

                    <br />
                    * العدد  2 أو 4 صور
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-foreground px-5 py-2 rounded-lg font-medium transition disabled:opacity-50"
                >
                    {loading ? t("general.loading") : t("general.submit")}
                </button>
            </div>
        </form>
    )
}

function Input({
    name,
    label,
    defaultValue,
    placeholder,
}: {
    name: string
    label: string
    defaultValue?: string
    placeholder?: string
}) {
    return (
        <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-form-label">{label}</label>
            <input
                type="text"
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder || label}
                className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
            />
        </div>
    )
}

function Select({
    name,
    label,
    options,
    defaultValue,
}: {
    name: string
    label: string
    options: { value: string; label: string }[]
    defaultValue?: string
}) {
    return (
        <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-form-label">{label}</label>
            <select
                name={name}
                defaultValue={defaultValue}
                className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default ProjectDocumentation1Form
