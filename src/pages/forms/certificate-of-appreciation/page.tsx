'use client'

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import PrimaryToolCard from "@/components/cards/ToolCard/PrimaryToolCard";
import PrimaryFooter from "@/components/sections/Footer/PrimaryFooter";
import PrimaryHeader from "@/components/sections/Header/PrimaryHeader";
import PrimarySectionTitle from "@/components/ui/SectionTitle/PrimarySectionTitle";

// استيراد صور الشهادات
import Template1background from "@/assets/cards_thumbnails/certificate-1.png";
import Template2background from "@/assets/cards_thumbnails/certificate-2.png";
import Template5background from "@/assets/cards_thumbnails/certificate-5.png";
import Template6background from "@/assets/cards_thumbnails/certificate-6.jpeg";
import Template7background from "@/assets/cards_thumbnails/certificate-7.png";
import Template8background from "@/assets/cards_thumbnails/certificate-8.jpeg";
import Template9background from "@/assets/cards_thumbnails/certificate-9.jpeg";

export default function CertificatesFormsPage() {
    const [scale, setScale] = useState(1);
    const [contentHeight, setContentHeight] = useState<number | null>(null);

    // حساب مقياس التحجيم بناءً على العرض المتاح
    useEffect(() => {
        const calculateScale = () => {
            const screenWidth = window.innerWidth;
            const baseWidth = 1140;
            const padding = 24; // 3 * 2 (px-3 على الجانبين)
            const availableWidth = screenWidth - padding;

            const newScale = Math.min(availableWidth / baseWidth, 1);
            setScale(newScale);
        };

        calculateScale();
        window.addEventListener("resize", calculateScale);
        return () => window.removeEventListener("resize", calculateScale);
    }, []);

    // تحديث الارتفاع بعد تطبيق التحجيم
    useEffect(() => {
        const updateHeight = () => {
            const gridElement = document.getElementById("scaled-grid");
            if (gridElement) {
                const actualHeight = gridElement.scrollHeight * scale;
                setContentHeight(actualHeight);
            }
        };

        const timer = setTimeout(updateHeight, 100);
        window.addEventListener("resize", updateHeight);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", updateHeight);
        };
    }, [scale]);

    return (
        <div className="grow flex flex-col justify-between gap-14">
            <PrimaryHeader />

            {/* قسم الشهادات */}
            <motion.section className="py-14 px-3 overflow-x-hidden" id="certificates">
                <div className="flex flex-col gap-20 w-full items-center">
                    <PrimarySectionTitle
                        title="نماذج شهادات التقدير"
                        h4Props={{ className: "text-center text-3xl" }}
                    />

                    <div
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: "top center",
                            transition: "transform 0.3s ease",
                            height: contentHeight ? `${contentHeight}px` : "auto",
                        }}
                    >
                        <motion.div
                            id="scaled-grid"
                            className="grid grid-cols-3 w-[1140px] gap-14"
                            variants={{
                                hidden: {},
                                show: {
                                    transition: { staggerChildren: 0.15 },
                                },
                            }}
                        >
                            <motion.div className="w-[320px] h-[320px]">
                                <PrimaryToolCard
                                    title="نموذج شهادة تقدير"
                                    description="نموذج إنشاء شهادة تقدير للمعلمين والطلاب"
                                    link="/forms/certificate-of-appreciation/1"
                                    img={Template1background}
                                />
                            </motion.div>

                            <motion.div className="w-[320px] h-[320px]">
                                <PrimaryToolCard
                                    title="نموذج شهادة تقدير"
                                    description="نموذج إنشاء شهادة تقدير للطلاب والمعلمين"
                                    link="/forms/certificate-of-appreciation/2"
                                    img={Template2background}
                                />
                            </motion.div>

                            <motion.div className="w-[320px] h-[320px]">
                                <PrimaryToolCard
                                    title="نموذج شهادة تقدير"
                                    description="نموذج إنشاء شهادة تقدير للطلاب والمعلمين"
                                    link="/forms/certificate-of-appreciation/5"
                                    img={Template5background}
                                />
                            </motion.div>

                            <motion.div className="w-[320px] h-[320px]">
                                <PrimaryToolCard
                                    title="نموذج شهادة تقدير"
                                    description="نموذج إنشاء شهادة تقدير للطلاب"
                                    link="/forms/certificate-of-appreciation/6"
                                    img={Template6background}
                                />
                            </motion.div>

                            {[Template7background, Template8background, Template9background].map(
                                (img, index) => (
                                    <motion.div key={index} className="w-[320px] h-[320px]">
                                        <PrimaryToolCard
                                            title="نموذج شهادة تقدير"
                                            description={
                                                index === 0
                                                    ? "نموذج إنشاء شهادة تقدير للطالبات"
                                                    : index === 1
                                                        ? "نموذج إنشاء شهادة تقدير للمعلمين والطلاب"
                                                        : "نموذج إنشاء شهادة تقدير للطالبات والمعلمات"
                                            }
                                            link={`/forms/certificate-of-appreciation/${7 + index}`}
                                            img={img}
                                        />
                                    </motion.div>
                                )
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            <PrimaryFooter />
        </div>
    );
}
