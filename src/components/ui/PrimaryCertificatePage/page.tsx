"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import PrimaryCertificateForm from "@/components/ui/CertificateForm/PrimaryCertificateForm";
import TemplatesLayout from "@/components/layout/TemplatesLayout";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import { Download, Image, FileText } from "lucide-react";
import { WaveLoading } from "respinner";
import { createCertificateToImage } from "@/lib/createCertificateImage";
import type { CertificateProps, CertificateTemplate } from "../CertificateViewer/PrimaryCertificateViewer";
import jsPDF from "jspdf";

export default function PrimaryCertificatePage({ template }: { template: CertificateTemplate }) {
    const [_formData, setFormData] = useState<Omit<CertificateProps, "template">[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const pdfWorkerRef = useRef<Worker | null>(null);

    useEffect(() => {
        pdfWorkerRef.current = new Worker(new URL("../../../workers/certificateWorker.js", import.meta.url), { type: "module" });
        pdfWorkerRef.current.onmessage = (event) => {
            const { type, progress: prog, blob } = event.data;

            if (type === "progress") {
                setProgress(prog);
            }

            if (type === "done" && blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "certificates.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setIsLoading(false);
            }
        };

        return () => {
            pdfWorkerRef.current?.terminate();
        };
    }, []);

    const handleFormDataChange = useCallback(
        (newData: Omit<CertificateProps, "template">[]) => {
            setImages([]);
            setFormData(newData);
            generateAllImagesSequentially(newData);
        },
        []
    );

    const generateAllImagesSequentially = useCallback(async (dataList: Omit<CertificateProps, "template">[]) => {
        setIsLoading(true);
        setProgress(0);

        const results: string[] = [];
        const total = dataList.length;

        for (let i = 0; i < total; i++) {
            const data = dataList[i];
            const img = await createCertificateToImage({
                data: data.data,
                template,
            });

            results.push(img);
            setProgress(((i + 1) / total) * 100);
        }

        setImages([...results]);
        setIsLoading(false);
    }, [template]);


    const downloadAll = useCallback(() => {
        images.forEach((img, index) => {
            const link = document.createElement("a");
            link.href = img;
            link.download = `certificate-${index + 1}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }, [images]);

    const downloadPDFSingle = useCallback(() => {
        images.forEach((img, index) => {
            const pdf = new jsPDF("landscape", "pt", "a4");
            const imgProps = pdf.getImageProperties(img);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`certificate-${index + 1}.pdf`);
        });
    }, [images]);

    const downloadPDFCombined = useCallback(() => {
        if (!images.length) return;
        setIsLoading(true);
        setProgress(0);
        pdfWorkerRef.current?.postMessage({ images });
    }, [images]);

    return (
        <TemplatesLayout>
            {isLoading && (
                <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-black/60 via-black/40 to-black/60 flex flex-col items-center justify-center rounded-[inherit] z-50">
                    <WaveLoading size={60} stroke="#FFFFFF" speed={2} />
                    <p className="mt-4 text-lg text-white font-medium">
                        جاري التحميل... {progress.toFixed(0)}%
                    </p>
                </div>
            )}

            <div className="container mx-auto md:px-4 md:py-10 space-y-2">
                <div className="bg-white relative p-6 md:rounded-xl shadow-lg w-full">
                    <PrimaryCertificateForm onSubmit={handleFormDataChange} template={template} />

                </div>

                {images.length > 0 && (
                    <div className="flex flex-col items-center gap-6 my-4 mx-2">
                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => setOpen(true)}
                                className="bg-primary text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary-hover transition flex items-center justify-center gap-2 w-full"
                            >
                                عرض الشهادات <Image />
                            </button>

                            <button
                                onClick={downloadAll}
                                className="bg-primary text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary-hover transition flex items-center justify-center gap-2 w-full"
                            >
                                تحميل الشهادات <Download />
                            </button>

                            <button
                                onClick={downloadPDFSingle}
                                className="bg-primary text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary-hover transition flex items-center justify-center gap-2 w-full"
                            >
                                تحميل PDF منفصل <FileText />
                            </button>

                            <button
                                onClick={downloadPDFCombined}
                                className="bg-primary text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary-hover transition flex items-center justify-center gap-2 w-full"
                            >
                                تحميل PDF مجمع <FileText />
                            </button>
                        </div>

                        <Lightbox
                            open={open}
                            close={() => setOpen(false)}
                            slides={images.map((src) => ({ src }))}
                            plugins={[Fullscreen]}
                        />
                    </div>
                )}
            </div>
        </TemplatesLayout>
    );
}
