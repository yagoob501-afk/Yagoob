import { useTranslation } from "react-i18next";
import { useState } from "react";
import DatePicker from "react-datepicker";
import type { DocumentationData } from "./documentation";
import "react-datepicker/dist/react-datepicker.css";

function ProjectDocumentation1Form({ onSubmit }: { onSubmit?: (data: DocumentationData) => void }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(null as Date | null);
    const [images, setImages] = useState([] as File[]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        formData.set("date", date?.toISOString() || ""); // replace date input with picker value
        images.forEach((img) => formData.append("images[]", img));

        const data: any = Object.fromEntries(formData.entries());
        data.images = images;
        data.date = date;
        onSubmit?.(data);

        setLoading(false);
    };

    const handleImageChange = (e: any) => {
        const files = Array.from(e.target.files);
        setImages((prev: any) => [...prev, ...files]);
    };

    const removeImage = (index: any) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-form-bg shadow-md rounded-2xl p-7 w-full max-w-4xl space-y-6"
        >
            {/* Grid for inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Title */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-form-label">
                        {t("documentation.title")}
                    </label>
                    <input
                        type="text"
                        name="title"
                        autoComplete="title"
                        placeholder={t("documentation.title")}
                        className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                    />
                </div>

                {/* Educational Area */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-form-label">
                        {t("documentation.educationalArea")}
                    </label>
                    <input
                        type="text"
                        name="area"
                        placeholder={t("documentation.educationalArea")}
                        className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                    />
                </div>

                {/* School Name */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-form-label">
                        {t("documentation.schoolName")}
                    </label>
                    <input
                        type="text"
                        name="school"
                        placeholder={t("documentation.schoolName")}
                        className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                    />
                </div>

                {/* Teacher Gender */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-form-label">
                        {t("documentation.teacherGender")}
                    </label>
                    <select
                        name="teacherGender"
                        className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                    >
                        <option value="male">{t("documentation.maleTeacher")}</option>
                        <option value="female">{t("documentation.femaleTeacher")}</option>
                        <option value="maleStudent">{t("documentation.maleStudent")}</option>
                        <option value="femaleStudent">{t("documentation.femaleStudent")}</option>
                    </select>
                </div>

                {/* Teacher Name */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-form-label">
                        {t("documentation.teacherName")}
                    </label>
                    <input
                        type="text"
                        name="teacherName"
                        placeholder={t("documentation.teacherName")}
                        className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                    />
                </div>

                {/* Department */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-form-label">
                        {t("documentation.department")}
                    </label>
                    <input
                        type="text"
                        name="department"
                        placeholder={t("documentation.department")}
                        className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                    />
                </div>

                {/* Place */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-form-label">
                        {t("documentation.place")}
                    </label>
                    <input
                        type="text"
                        name="place"
                        placeholder={t("documentation.place")}
                        className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                    />
                </div>

                {/* Date Picker */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-form-label">
                        {t("documentation.date")}
                    </label>
                    <DatePicker
                        selected={date}
                        onChange={(d) => setDate(d)}
                        dateFormat="yyyy-MM-dd"
                        className="w-full rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                        placeholderText={t("documentation.date")}
                    />
                </div>

                {/* Manager Gender */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-form-label">
                        {t("documentation.managerGender")}
                    </label>
                    <select
                        name="managerGender"
                        className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                    >
                        <option value="male">{t("documentation.maleManager")}</option>
                        <option value="female">{t("documentation.femaleManager")}</option>
                    </select>
                </div>

                {/* Manager Name */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-form-label">
                        {t("documentation.managerName")}
                    </label>
                    <input
                        type="text"
                        name="managerName"
                        placeholder={t("documentation.managerName")}
                        className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                    />
                </div>

                {/* Target Group */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-form-label">
                        {t("documentation.targetGroup")}
                    </label>
                    <input
                        type="text"
                        name="targetGroup"
                        placeholder={t("documentation.targetGroup")}
                        className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-form-label">
                        {t("documentation.event type")}
                    </label>
                    <input
                        type="text"
                        name="eventType"
                        placeholder={t("documentation.event type")}
                        className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition"
                    />
                </div>
            </div>

            {/* Description */}
            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-form-label">
                    {t("documentation.description")}
                </label>
                <textarea
                    name="description"
                    placeholder={t("documentation.description")}
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition h-28 resize-none"
                />
            </div>

            {/* Files with preview */}
            <div className="flex flex-col space-y-3">
                <label className="mb-1 text-sm font-medium text-form-label">
                    {t("documentation.images")}
                </label>
                <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary-hover transition"
                />

                {/* Preview */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((file, idx) => (
                        <div
                            key={idx}
                            className="relative rounded-lg overflow-hidden border border-form-border"
                        >
                            <img
                                src={URL.createObjectURL(file)}
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

export default ProjectDocumentation1Form;
