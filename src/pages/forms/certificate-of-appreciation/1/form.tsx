import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { CertificateProps } from "./viewer";

interface CertificateOfAppreciationTemplate_1_FormProps {
    onSubmit?: (data: CertificateProps[]) => void;
}

function CertificateOfAppreciationTemplate_1_Form({
    onSubmit,
}: CertificateOfAppreciationTemplate_1_FormProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [namesInput, setNamesInput] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = (formData.get("title") as string) || "";
        const subtitle = (formData.get("subtitle") as string) || "";
        const personTitle = (formData.get("personTitle") as string) || "";
        const line2 = (formData.get("line2") as string) || "";

        // split names by newline into array
        const names = namesInput
            .split("\n")
            .map((n) => n.trim())
            .filter(Boolean);

        const certificates: CertificateProps[] = names.map((name) => ({
            data: {
                title,
                subtitle,
                name,
                personTitle,
                line2,
            },
        }));


        onSubmit?.(certificates);
        setLoading(false);
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
                    defaultValue="تقدم هذه الشهادة بكل فخر الى"
                    placeholder={t("certificate.subtitle") || ""}
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                />
            </div>

            {/* Person Title */}
            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-form-label">
                    {t("certificate.personTitle")}
                </label>
                <select
                    name="personTitle"
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                >
                    <option value="المعلم">المعلم</option>
                    <option value="المعلمة">المعلمة</option>
                    <option value="الطالب">الطالب</option>
                    <option value="الطالبة">الطالبة</option>
                </select>
            </div>

            {/* Names (textarea) */}
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

            {/* Line 2 */}
            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-form-label">
                    {t("certificate.line2")}
                </label>
                <textarea
                    name="line2"
                    placeholder="نص إضافي (اختياري)"
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition h-24 resize-none"
                />
            </div>

            {/* Submit */}
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
    );
}

export default CertificateOfAppreciationTemplate_1_Form;
