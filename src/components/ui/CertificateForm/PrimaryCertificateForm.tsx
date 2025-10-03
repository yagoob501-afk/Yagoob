"use client";

import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ar } from "date-fns/locale";
import type { CertificateProps, CertificateTemplate } from "@/components/ui/CertificateViewer/PrimaryCertificateViewer";
import TextareaAutosize from "react-textarea-autosize";

// CertificateResult = نفس CertificateProps لكن من غير template
type CertificateResult = Omit<CertificateProps, "template">;

interface PrimaryCertificateFormProps {
    onSubmit?: (data: CertificateResult[]) => void;
    template?: Partial<CertificateTemplate>;
}

const defaultFormTemplate: Partial<CertificateTemplate> = {
    classNames: {
        formContainer: "bg-form-bg md:p-7 w-full space-y-6",
        formLabel: "mb-1 text-sm font-medium text-form-label",
        formInput: "rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition",
        formTextarea: "rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition resize-none",
        formDatePicker: "rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition w-full",
        formSignature: "w-full max-h-32 object-contain border border-form-border rounded-md bg-white",
        formButton: "bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-foreground px-5 py-2 rounded-lg font-medium transition disabled:opacity-50 cursor-pointer",
    },
};

function PrimaryCertificateForm({
    onSubmit,
    template = {}
}: PrimaryCertificateFormProps) {
    const { t } = useTranslation();

    const classNames = {
        ...defaultFormTemplate.classNames,
        ...(template.classNames || {}),
    };

    const sigCanvasModal = useRef<SignatureCanvas | null>(null);
    const [sign, setSign] = useState<string | undefined>();
    const [isSignCanvasOpen, setIsSignCanvasOpen] = useState(false);
    const [namesInput, setNamesInput] = useState("يوسف محمد");
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [extraLines, setExtraLines] = useState([
        "و ذلك نظير جهوده",
        "و بدورنا نقدم له هذا الشكل كتقدير لجهوده المبذولة",
        "متمنين له دوام التوفيق و السداد",
    ]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = (formData.get("title") as string) || "";
        const subtitle = (formData.get("subtitle") as string) || "";
        const personTitle = (formData.get("personTitle") as string) || "";

        const line2 = extraLines
            .map((line) => line.trim())
            .filter(Boolean)
            .join("\n");

        const names = namesInput
            .split("\n")
            .map((n) => n.trim())
            .filter(Boolean);

        const managerTitle = (formData.get("managerTitle") as string) || "";
        const managerName = (formData.get("managerName") as string) || "";
        const teacherTitle = (formData.get("teacherTitle") as string) || "";
        const teacherName = (formData.get("teacherName") as string) || "";

        const certificates: CertificateResult[] = names.map((name) => ({
            data: {
                title,
                subtitle,
                name,
                personTitle,
                line2,
                sign,
                date: selectedDate || new Date(),
                managerTitle,
                managerName,
                teacherTitle,
                teacherName,
            },
        }));

        onSubmit?.(certificates);
        setLoading(false);
    };

    const handleSaveSignature = () => {
        if (sigCanvasModal.current && !sigCanvasModal.current.isEmpty()) {
            const signData = sigCanvasModal.current.toDataURL("image/png");
            setSign(signData);
        }
        setIsSignCanvasOpen(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={classNames.formContainer}
        >
            {/* Title */}
            <div className="flex flex-col">
                <label className={classNames.formLabel}>
                    {t("certificate.title")}
                </label>
                <TextareaAutosize
                    name="title"
                    minRows={1}
                    defaultValue="شهادة تقدير"
                    placeholder={t("certificate.title") || ""}
                    className={classNames.formInput}
                />
            </div>

            {/* Subtitle */}
            <div className="flex flex-col">
                <label className={classNames.formLabel}>
                    {t("certificate.subtitle")}
                </label>
                <TextareaAutosize
                    name="subtitle"
                    minRows={1}
                    defaultValue="تتقدم ادارة مدرسة ___ بالشكر و التقدير"
                    placeholder={t("certificate.subtitle") || ""}
                    className={classNames.formInput}
                />
            </div>

            {/* Person Title */}
            <div className="flex flex-col">
                <label className={classNames.formLabel}>
                    {t("certificate.personTitle")}
                </label>
                <TextareaAutosize
                    name="personTitle"
                    minRows={1}
                    placeholder="المعلم, الطالب,..."
                    defaultValue={"الطالب"}
                    className={classNames.formInput}
                />
            </div>

            {/* Names */}
            <div className="flex flex-col">
                <label className={classNames.formLabel}>
                    {t("certificate.names")}
                </label>
                <TextareaAutosize
                    value={namesInput}
                    onChange={(e) => setNamesInput(e.target.value)}
                    placeholder="اكتب كل اسم في سطر منفصل"
                    className={classNames.formTextarea}
                />
            </div>

            {/* Extra Lines */}
            {extraLines.map((line, idx) => (
                <div key={idx} className="flex flex-col">
                    <label className={classNames.formLabel}>
                        {
                            idx === 0 ? "النص الأول" : ""
                        }

                        {
                            idx === 1 ? "النص الثاني" : ""
                        }

                        {
                            idx === 2 ? "النص الثالث" : ""
                        }
                    </label>
                    <TextareaAutosize
                        name={`line2-${idx}`}
                        minRows={1}
                        value={line}
                        onChange={(e) => {
                            const newLines = [...extraLines];
                            newLines[idx] = e.target.value;
                            setExtraLines(newLines);
                        }}
                        className={classNames.formInput}
                    />
                </div>
            ))}

            {/* Date */}
            <div className="flex flex-col">
                <label className={classNames.formLabel}>
                    {t("certificate.date") || "التاريخ"}
                </label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                    locale={ar}
                    className={classNames.formDatePicker}
                />
            </div>

            {/* Manager Title & Name */}
            <div className="flex flex-col">
                <label className={classNames.formLabel}>
                    لقب المدير / المديرة
                </label>
                <TextareaAutosize
                    name="managerTitle"
                    minRows={1}
                    placeholder="مثال: المدير / المديرة"
                    defaultValue="المدير"
                    className={classNames.formInput}
                />
            </div>
            <div className="flex flex-col">
                <label className={classNames.formLabel}>
                    اسم المدير / المديرة
                </label>
                <TextareaAutosize
                    name="managerName"
                    minRows={1}
                    placeholder="مثال: أحمد علي"
                    className={classNames.formInput}
                />
            </div>

            {/* Teacher Title & Name */}
            <div className="flex flex-col">
                <label className={classNames.formLabel}>
                    لقب المعلم / المعلمة
                </label>
                <TextareaAutosize
                    name="teacherTitle"
                    minRows={1}
                    placeholder="مثال: المعلم / المعلمة"
                    defaultValue="المعلم"
                    className={classNames.formInput}
                />
            </div>
            <div className="flex flex-col">
                <label className={classNames.formLabel}>
                    اسم المعلم / المعلمة
                </label>
                <TextareaAutosize
                    name="teacherName"
                    minRows={1}
                    placeholder="مثال: فاطمة حسن"
                    className={classNames.formInput}
                />
            </div>

            {/* Signature */}
            <div className="flex flex-col">
                <label className={classNames.formLabel}>
                    {t("certificate.signature") || "التوقيع"}
                </label>
                {sign ? (
                    <div className="relative">
                        <img
                            src={sign}
                            alt="التوقيع"
                            className={classNames.formSignature}
                        />
                        <button
                            type="button"
                            onClick={() => setSign(undefined)}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                        >
                            مسح
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsSignCanvasOpen(true)}
                        className={classNames.formButton}
                    >
                        افتح مساحة التوقيع
                    </button>
                )}
            </div>


            {/* Submit */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className={classNames.formButton}
                >
                    {loading ? t("general.loading") : t("general.submit")}
                </button>
            </div>

            {/* Signature Canvas Modal */}
            {isSignCanvasOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md flex flex-col">
                        <div className="flex justify-between items-center px-4 py-2 border-b">
                            <h2 className="font-medium">{t("certificate.signature")}</h2>
                            <button
                                type="button"
                                onClick={() => setIsSignCanvasOpen(false)}
                                className="text-red-500 text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        <SignatureCanvas
                            ref={sigCanvasModal}
                            penColor="black"
                            canvasProps={{
                                className: "w-full h-48 bg-white",
                            }}
                        />
                        <div className="flex justify-between gap-3 p-3 border-t">
                            <button
                                type="button"
                                onClick={() => sigCanvasModal.current?.clear()}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm cursor-pointer"
                            >
                                مسح
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveSignature}
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm cursor-pointer"
                            >
                                حفظ التوقيع
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}

export default PrimaryCertificateForm;
