import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "react-i18next";
import type { CertificateProps } from "@/components/ui/CertificateViewer/PrimaryCertificateViewer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ar } from "date-fns/locale";

// CertificateResult = نفس CertificateProps لكن من غير template
type CertificateResult = Omit<CertificateProps, "template">;

interface PrimaryCertificateFormProps {
    onSubmit?: (data: CertificateResult[]) => void;
}

function PrimaryCertificateForm({ onSubmit }: PrimaryCertificateFormProps) {
    const { t } = useTranslation();
    const sigCanvasModal = useRef<SignatureCanvas | null>(null);
    const [sign, setSign] = useState<string | undefined>();
    const [isSignCanvasOpen, setIsSignCanvasOpen] = useState(false);
    const [namesInput, setNamesInput] = useState("يوسف محمد");
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    // store each extra line separately
    const [extraLines, setExtraLines] = useState(["و ذلك نظير جهوده", "و بدورنا نقدم له هذا الشكل كتقدير لجهوده المبذولة", "متمنين له دوام التوفيق و السداد"]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = (formData.get("title") as string) || "";
        const subtitle = (formData.get("subtitle") as string) || "";
        const personTitle = (formData.get("personTitle") as string) || "";

        // join extra lines with \n
        const line2 = extraLines
            .map((line) => line.trim())
            .filter(Boolean)
            .join("\n");

        const names = namesInput
            .split("\n")
            .map((n) => n.trim())
            .filter(Boolean);

        const certificates: CertificateResult[] = names.map((name) => ({
            data: {
                title,
                subtitle,
                name,
                personTitle,
                line2,
                sign,
                date: selectedDate || new Date(),
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
            className="bg-form-bg p-7 w-full space-y-6"
        >
            {/* Title */}
            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-form-label">
                    {t("certificate.title")}
                </label>
                <input
                    type="text"
                    name="title"
                    defaultValue="شهادة تقدير"
                    placeholder={t("certificate.title") || ""}
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                />
            </div>

            {/* Subtitle */}
            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-form-label">
                    {t("certificate.subtitle")}
                </label>
                <input
                    type="text"
                    name="subtitle"
                    defaultValue="تتقدم ادارة مدرسة ___ بالشكر و التقدير"
                    placeholder={t("certificate.subtitle") || ""}
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                />
            </div>

            {/* Person Title */}
            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-form-label">
                    {t("certificate.personTitle")}
                </label>
                <input
                    type="text"
                    name="personTitle"
                    placeholder="المعلم, الطالب,..."
                    defaultValue={"الطالب"}
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                />
            </div>

            {/* Names */}
            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-form-label">
                    {t("certificate.names")}
                </label>
                <textarea
                    value={namesInput}
                    onChange={(e) => setNamesInput(e.target.value)}
                    placeholder="اكتب كل اسم في سطر منفصل"
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition h-32 resize-none"
                />
            </div>

            {/* Line 2 (Extra Text split into 3 fields) */}
            <div className="flex flex-col space-y-2">
                <label className="mb-1 text-sm font-medium text-form-label">
                    {t("certificate.line2")}
                </label>
                {extraLines.map((line, idx) => (
                    <input
                        key={idx}
                        type="text"
                        value={line}
                        onChange={(e) => {
                            const newLines = [...extraLines];
                            newLines[idx] = e.target.value;
                            setExtraLines(newLines);
                        }}
                        placeholder={`سطر ${idx + 1} (اختياري)`}
                        className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                    />
                ))}
            </div>

            {/* Date */}
            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-form-label">
                    {t("certificate.date") || "التاريخ"}
                </label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                    locale={ar}
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition w-full"
                    wrapperClassName="w-full"
                    calendarClassName="!rtl"
                />
            </div>

            {/* Signature */}
            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-form-label">
                    {t("certificate.signature") || "التوقيع"}
                </label>

                {sign ? (
                    <div className="relative">
                        <img
                            src={sign}
                            alt="التوقيع"
                            className="w-full max-h-32 object-contain border border-form-border rounded-md bg-white"
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
                        className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm hover:bg-primary-hover transition cursor-pointer"
                    >
                        افتح مساحة التوقيع
                    </button>
                )}
            </div>

            {/* Fullscreen Signature Modal */}
            {isSignCanvasOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md flex flex-col">
                        {/* Header */}
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

                        {/* Canvas */}
                        <SignatureCanvas
                            ref={sigCanvasModal}
                            penColor="black"
                            canvasProps={{
                                className: "w-full h-48 bg-white", // حجم معقول
                            }}
                        />

                        {/* Actions */}
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

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-foreground px-5 py-2 rounded-lg font-medium transition disabled:opacity-50 cursor-pointer"
                >
                    {loading ? t("general.loading") : t("general.submit")}
                </button>
            </div>
        </form>
    );
}

export default PrimaryCertificateForm;
