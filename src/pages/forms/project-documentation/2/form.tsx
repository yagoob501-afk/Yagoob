"use client"

import type React from "react"

import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import type { DocumentationData } from "./documentation"
import "react-datepicker/dist/react-datepicker.css"
import { ChevronDown } from "lucide-react"
import "./datepicker-style.css";

interface Props {
    onSubmit?: (data: DocumentationData) => void
    initialData?: Partial<DocumentationData>
}

const defaultColors = {
    headerBg: "#FFFFFF",
    headerText: "#8B4513",
    headerBorder: "#8B4513",
    containerBg: "#F5F1E8",
    containerBorder: "#8B4513",
    inputBg: "#FFFFFF",
    inputText: "#000000",
    inputBorder: "#8B4513",
    inputLabelText: "#8B4513",

    titleText: "#8B4513",
    titleBorder: "#8B4513",
    titleBg: "#FFFFFF",

    manager: "#000000",
    managerGender: "#8B4513",
    departmentManager: "#000000",
    departmentManagerGender: "#8B4513",
};


function ProjectDocumentation1Form({ onSubmit, initialData }: Props) {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState<Date | null>(null)
    const [images, setImages] = useState<File[]>([])
    const [logoPicture, setLogoPicture] = useState<File | null>(null)
    const [showColorSettings, setShowColorSettings] = useState(false)

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
        setColors((prev) => ({ ...prev, [key]: value }))
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
        setImages((prev) => [...prev, ...files])
    }

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setLogoPicture(file)
    }

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
                    className={`transition-all duration-300 ease-in-out ${showColorSettings ? "opacity-100" : "max-h-0 opacity-0"
                        } overflow-hidden`}
                >
                    <div className="p-6 pt-2 flex flex-col gap-6">
                        {/* استيراد ملف JSON */}
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
                                                setColors((prev) => ({ ...prev, ...imported }));
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

                            {/* اسم الملف بعد اختياره */}
                            <p
                                id="fileNameDisplay"
                                className="text-xs text-gray-500 mt-1"
                            >
                                لم يتم اختيار ملف بعد
                            </p>
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
                                departmentManager: "لون اسم مدير القسم",
                                departmentManagerGender: "لون صفة مدير القسم",
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
                        { value: "male", label: t("documentation.maleManager") },
                        { value: "female", label: t("documentation.femaleManager") },
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
                    placeholder={t("documentation.description")}
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

            <div className="flex justify-end">
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
