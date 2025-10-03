import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";

// Lightbox imports
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import { format } from "date-fns-tz";

export type CertificateData = {
    title: string;
    subtitle: string;
    name: string;
    personTitle?: string;
    line2?: string;
    date: Date;
    managerTitle?: string;
    managerName?: string;
    teacherTitle?: string;
    teacherName?: string;
    sign?: string; // base64
};

export type CertificateTemplate = {
    background: string;
    classNames: {
        container?: string;
        title?: string;
        subtitle?: string;
        name?: string;
        line2?: string;
        date?: string;
        sign?: string;
        managerName?: string;
        teacherName?: string;

        // إضافة فورم ستايل
        formContainer?: string;
        formLabel?: string;
        formInput?: string;
        formTextarea?: string;
        formDatePicker?: string;
        formSignature?: string;
        formButton?: string;
    };
    positions: {
        title?: React.CSSProperties;
        subtitle?: React.CSSProperties;
        name?: React.CSSProperties;
        line2?: React.CSSProperties;
        date?: React.CSSProperties;
        sign?: React.CSSProperties;
        managerName?: React.CSSProperties;
        teacherName?: React.CSSProperties;

        // إضافات فورم
        formTitle?: React.CSSProperties;
        formSubtitle?: React.CSSProperties;
        formName?: React.CSSProperties;
        formLine2?: React.CSSProperties;
        formDate?: React.CSSProperties;
        formSign?: React.CSSProperties;
        formTeacherTitle?: React.CSSProperties;
        formTeacherName?: React.CSSProperties;
        formManagerTitle?: React.CSSProperties;
        formManagerName?: React.CSSProperties;
    };
};


export type CertificateProps = {
    data: CertificateData;
    template: CertificateTemplate;
    onImageReady?: (image: string) => void;
    displayImage?: boolean;
};

function PrimaryCertificateViewer({
    data,
    template,
    displayImage = true,
    onImageReady,
}: CertificateProps) {
    const { title, subtitle, name, personTitle, line2, date, sign } = data;

    const ref = useRef<HTMLDivElement>(null);
    const [imageData, setImageData] = useState<string | null>(null);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (ref.current && !imageData) {
            document.fonts.ready.then(() => {
                html2canvas(ref.current as HTMLDivElement, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 2,
                }).then((canvas) => {
                    const img = canvas.toDataURL("image/png");
                    setImageData(img);
                    onImageReady?.(img);
                });
            });
        }
    }, [ref, imageData, data, onImageReady]);

    return (
        <div className="flex justify-center items-center w-full">
            {imageData && displayImage ? (
                <div className="flex flex-col gap-4 container mx-auto max-w-4xl">
                    <img
                        src={imageData}
                        alt="certificate"
                        className="w-full h-auto rounded-xl shadow-lg cursor-pointer"
                        onClick={() => setOpen(true)}
                    />

                    {/* Lightbox */}
                    <Lightbox
                        open={open}
                        close={() => setOpen(false)}
                        slides={[{ src: imageData }]}
                        plugins={[Fullscreen]}
                    />
                </div>
            ) : null}

            {/* Hidden Render Area */}
            <div
                ref={ref}
                style={{
                    left: "-9999px",
                    top: "-9999px",
                    width: "2000px",
                    height: "1414px",
                    overflow: "hidden",
                    position: "absolute",
                }}
            >
                <div
                    className={`relative w-full h-full ${template.classNames.container ?? ""}`}
                >
                    {/* Background */}
                    <img
                        src={template.background}
                        crossOrigin="anonymous"
                        alt="certificate background"
                        className="absolute inset-0 w-full h-full object-contain rounded-xl shadow-lg"
                    />

                    {/* Title */}
                    <h1
                        className={template.classNames.title}
                        style={template.positions.title}
                    >
                        {title}
                    </h1>

                    {/* Subtitle */}
                    <h2
                        className={template.classNames.subtitle}
                        style={template.positions.subtitle}
                    >
                        {subtitle}
                    </h2>

                    {/* Manager Title */}
                    {data.managerTitle && data.managerTitle && (
                        <h3
                            className={template.classNames.managerName}
                            style={template.positions.managerName}
                        >
                            <span>{data.managerTitle}</span>
                            <span>{data.managerName}</span>
                        </h3>
                    )}


                    {/* Teacher Name */}
                    {data.teacherName && data.teacherTitle && (
                        <h3
                            className={template.classNames.teacherName}
                            style={template.positions.teacherName}
                        >
                            <span>{data.teacherTitle}</span>
                            <span>{data.teacherName}</span>
                        </h3>
                    )}

                    {/* Name + Person Title */}
                    <h2
                        className={template.classNames.name}
                        style={template.positions.name}
                    >
                        {personTitle ? personTitle + "/ " : ""}
                        {name}
                    </h2>

                    {/* Line 2 */}
                    {line2 && (
                        <p
                            className={template.classNames.line2}
                            style={template.positions.line2}
                        >
                            {line2.split("\n").map((value, index) => (
                                <span
                                    key={value + index}
                                    className="whitespace-nowrap block p-4"
                                >
                                    {value}
                                </span>
                            ))}
                        </p>
                    )}

                    {/* Date */}
                    <span
                        className={template.classNames.date}
                        style={template.positions.date}
                    >
                        {format(date, "yyyy/MM/dd")}
                    </span>

                    {/* Sign */}
                    {sign ? (
                        <span
                            className={template.classNames.sign}
                            style={template.positions.sign}
                        >
                            <img src={sign} className="max-w-40" />
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default PrimaryCertificateViewer;
