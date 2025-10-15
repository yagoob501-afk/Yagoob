import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import type { DocumentationData } from "./documentation";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
    onSubmit?: (data: DocumentationData) => void;
    initialData?: Partial<DocumentationData>; // ✅ Optional initial data
}

function ProjectDocumentation1Form({ onSubmit, initialData }: Props) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [logoPicture, setLogoPicture] = useState<File | null>(null);

    // ✅ Set initial data when component mounts
    useEffect(() => {
        if (initialData?.date) {
            setDate(new Date(initialData.date));
        }
        if (initialData?.images && Array.isArray(initialData.images)) {
            // ignore strings since they're URLs, not files
            setImages(initialData.images.filter((i): i is File => i instanceof File));
        }
        if (initialData?.logoPicture && initialData.logoPicture instanceof File) {
            setLogoPicture(initialData.logoPicture);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.set("date", date?.toISOString() || "");
        images.forEach((img) => formData.append("images[]", img));
        if (logoPicture) formData.append("logoPicture", logoPicture);

        const data: any = Object.fromEntries(formData.entries());
        data.images = images;
        data.date = date;
        data.logoPicture = logoPicture;

        onSubmit?.(data);
        setLoading(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages((prev) => [...prev, ...files]);
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setLogoPicture(file);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-form-bg shadow-md rounded-2xl p-7 w-full max-w-4xl space-y-6"
        >
            {/* Grid for inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Title */}
                <Input
                    name="title"
                    label={t("documentation.title")}
                    defaultValue={initialData?.title || ""}
                />

                {/* Educational Area */}
                <Input
                    name="area"
                    label={t("documentation.educationalArea")}
                    defaultValue={initialData?.area || ""}
                />

                {/* School Name */}
                <Input
                    name="school"
                    label={t("documentation.schoolName")}
                    defaultValue={initialData?.school || ""}
                />

                {/* Teacher Gender */}
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

                {/* Teacher Name */}
                <Input
                    name="teacherName"
                    label={t("documentation.teacherName")}
                    defaultValue={initialData?.teacherName || ""}
                />

                {/* Department */}
                <Input
                    name="department"
                    label={t("documentation.department")}
                    defaultValue={initialData?.department || ""}
                />

                {/* Place */}
                <Input
                    name="place"
                    label={t("documentation.place")}
                    defaultValue={initialData?.place || ""}
                />

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
                <Select
                    name="managerGender"
                    label={t("documentation.managerGender")}
                    defaultValue={initialData?.managerGender || "male"}
                    options={[
                        { value: "male", label: t("documentation.maleManager") },
                        { value: "female", label: t("documentation.femaleManager") },
                    ]}
                />

                {/* Manager Name */}
                <Input
                    name="managerName"
                    label={t("documentation.managerName")}
                    defaultValue={initialData?.managerName || ""}
                />

                {/* Target Group */}
                <Input
                    name="targetGroup"
                    label={t("documentation.targetGroup")}
                    defaultValue={initialData?.targetGroup || ""}
                />

                {/* Event Type */}
                <Input
                    name="eventType"
                    label={t("documentation.event type")}
                    defaultValue={initialData?.eventType || ""}
                />
            </div>

            {/* Description */}
            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-form-label">
                    {t("documentation.description")}
                </label>
                <textarea
                    name="description"
                    defaultValue={initialData?.description || ""}
                    placeholder={t("documentation.description")}
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text placeholder:text-form-placeholder focus:outline-none focus:ring-2 focus:ring-form-focus-ring transition h-28 resize-none"
                />
            </div>

            {/* Logo Picture */}
            <div className="flex flex-col space-y-3">
                <label className="mb-1 text-sm font-medium text-form-label">
                    {t("documentation.logoPicture")}
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="rounded-lg border border-form-border bg-form-bg px-3 py-2 text-form-text file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary-hover transition"
                />
                {logoPicture && (
                    <div className="relative w-32 h-32 border border-form-border rounded-lg overflow-hidden">
                        <img
                            src={URL.createObjectURL(logoPicture)}
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

// ✅ Helper components for readability
function Input({
    name,
    label,
    defaultValue,
    placeholder,
}: {
    name: string;
    label: string;
    defaultValue?: string;
    placeholder?: string;
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
    );
}

function Select({
    name,
    label,
    options,
    defaultValue,
}: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
    defaultValue?: string;
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
    );
}

export default ProjectDocumentation1Form;
