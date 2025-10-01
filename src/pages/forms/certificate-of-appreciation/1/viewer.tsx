import background from "@/assets/_شهادة تقدير أنيقة باللونين الأسود والذهبي .png";
import icon from "@/assets/icon-of-certificate-1.png";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";

// Lightbox imports
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

export type CertificateProps = {
    data: {
        title: string;
        subtitle: string;
        name: string;
        personTitle: string;
        line2: string;
    },
    onImageReady?: (image: string) => void;
    displayImage?: boolean;
};

function CertificateOfAppreciationTemplate_1_Viewer({
    data,
    displayImage = true,
    onImageReady
}: CertificateProps) {
    const {
        title,
        subtitle,
        name,
        personTitle,
        line2,
    } = data;

    const ref = useRef<HTMLDivElement>(null);
    const [imageData, setImageData] = useState<string | null>(null);

    // state for lightbox
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (ref.current && !imageData) {
            document.fonts.ready.then(() => {
                html2canvas(ref.current as HTMLDivElement, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 2,
                }).then(canvas => {
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
                    position: "absolute",
                    left: "-9999px",
                    top: "-9999px",
                    width: "1920px",
                    height: "1080px",
                    overflow: "hidden",
                }}
            >
                <div className="relative w-full h-full">
                    {/* Background */}
                    <img
                        src={background}
                        crossOrigin="anonymous"
                        alt="شهادة تقدير"
                        className="absolute inset-0 w-full h-full object-contain rounded-xl shadow-lg"
                    />

                    {/* Text Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10 py-20 text-[#d4b365]">
                        <img src={icon} crossOrigin="anonymous" alt="" className="w-24 mb-4" />
                        <h1 className="text-8xl mb-6 font-sharjah">{title}</h1>
                        <h2 className="text-2xl mb-6 font-alhoda">{subtitle}</h2>
                        <h2 className="text-4xl font-bold mb-8">
                            {personTitle ? personTitle + "/ " : ""}
                            {name}
                        </h2>
                        {line2 && <p className="text-xl max-w-md">{line2}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CertificateOfAppreciationTemplate_1_Viewer;
