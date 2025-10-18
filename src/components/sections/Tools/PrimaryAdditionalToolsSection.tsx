"use client"
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import PrimaryToolCard from "@/components/cards/ToolCard/PrimaryToolCard";
import PrimarySectionTitle from "@/components/ui/SectionTitle/PrimarySectionTitle";
import QrThumbnail from "@/assets/Using-a-QR-Code-Generator-with-text-below.png";

function PrimaryAdditionalToolsSection() {
    const [scale, setScale] = useState(1);
    const [contentHeight, setContentHeight] = useState<number | null>(null);

    useEffect(() => {
        const calculateScale = () => {
            const screenWidth = window.innerWidth;
            // حساب العرض الأساسي بناءً على الـ container
            const baseWidth = 1280; // max container width
            const padding = 48; // px-3 * 2 + container padding
            const availableWidth = screenWidth - padding;

            // حساب scale بناءً على العرض المتاح
            const newScale = Math.min(availableWidth / baseWidth, 1);
            setScale(newScale);
        };

        calculateScale();
        // window.addEventListener('resize', calculateScale);

        // return () => window.removeEventListener('resize', calculateScale);
    }, []);

    // حساب الارتفاع الفعلي بعد التصغير
    useEffect(() => {
        const updateHeight = () => {
            const gridElement = document.getElementById('additional-tools-grid');
            if (gridElement) {
                const actualHeight = gridElement.scrollHeight * scale;
                setContentHeight(actualHeight);
            }
        };

        // انتظار تحميل الصور قبل حساب الارتفاع
        const timer = setTimeout(updateHeight, 100);
        // window.addEventListener('resize', updateHeight);

        return () => {
            clearTimeout(timer);
            // window.removeEventListener('resize', updateHeight);
        };
    }, [scale]);

    return (
        <motion.section
            className="py-14 px-3 container mx-auto overflow-x-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            id="tools"
        >
            <div className="flex flex-col gap-20 items-center">
                <PrimarySectionTitle
                    title="أدوات اضافية"
                    h4Props={{ className: "text-center text-3xl" }}
                />

                <div
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        transition: 'transform 0.3s ease',
                        height: contentHeight ? `${contentHeight}px` : 'auto'
                    }}
                >
                    <motion.div
                        id="additional-tools-grid"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-14"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.2 }}
                        variants={{
                            hidden: {},
                            show: {
                                transition: { staggerChildren: 0.15 },
                            },
                        }}
                    >
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <PrimaryToolCard
                                title="تحويل الروابط الى qrcode"
                                description=""
                                link="/additional-tools/text-to-qrcode"
                                img={QrThumbnail}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}

export default PrimaryAdditionalToolsSection