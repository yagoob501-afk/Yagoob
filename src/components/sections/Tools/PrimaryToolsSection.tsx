import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import PrimaryToolCard from "@/components/cards/ToolCard/PrimaryToolCard";
import DocForm1 from "@/assets/cards_thumbnails/doc_form_1.jpeg";
import DocForm2 from "@/assets/cards_thumbnails/doc_form_2.jpeg";
import Template7background from "@/assets/cards_thumbnails/certificate-7.png";
import Template8background from "@/assets/cards_thumbnails/certificate-8.jpeg";
import Template9background from "@/assets/cards_thumbnails/certificate-9.jpeg";
import MultiCertificate from "@/assets/cards_thumbnails/multi-cetrificate.png";
import PrimarySectionTitle from "@/components/ui/SectionTitle/PrimarySectionTitle";

function PrimaryToolsSection({ hideNewestItems }: { hideNewestItems?: boolean }) {
    const [scale, setScale] = useState(1);
    const [contentHeight, setContentHeight] = useState<number | null>(null);

    useEffect(() => {
        const calculateScale = () => {
            const screenWidth = window.innerWidth;
            const baseWidth = 1140;
            const padding = 24; // 3 * 2 (px-3 on both sides)
            const availableWidth = screenWidth - padding;

            // حساب scale بناءً على العرض المتاح
            const newScale = Math.min(availableWidth / baseWidth, 1);
            setScale(newScale);
        };

        calculateScale();

        window.addEventListener('focus', calculateScale);
        return () => window.removeEventListener('focus', calculateScale);

        // window.addEventListener('resize', calculateScale);
        // return () => window.removeEventListener('resize', calculateScale);
    }, []);

    // حساب الارتفاع الفعلي بعد التصغير
    useEffect(() => {
        const updateHeight = () => {
            const gridElement = document.getElementById('scaled-grid');
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
        <>
            <motion.section
                className="py-14 px-3 overflow-x-hidden"
                id="tools"
            >
                <div className="flex flex-col gap-7 w-full items-center">
                    <PrimarySectionTitle
                        title="نماذج جاهزة للطباعة"
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
                            id="scaled-grid"
                            className="grid grid-cols-3 w-[1140px] gap-2 h-full"
                            variants={{
                                hidden: {},
                                show: {
                                    transition: { staggerChildren: 0.15 },
                                },
                            }}
                        >
                            <motion.div className="w-[370px] h-full">
                                <PrimaryToolCard
                                    title="نماذج و تقارير"
                                    description="مجموعة شاملة من النماذج و التقارير الجاهزة لتوثيق فعالية أو الحصص التبادلية أو اجتماع القسم"
                                    link="https://teacher-yagoub.netlify.app"
                                    img={DocForm1}
                                />
                            </motion.div>

                            <motion.div className="w-[370px] h-full">
                                <PrimaryToolCard
                                    title="نموذج توثيق فعالية 2"
                                    description=""
                                    link="/forms/project-documentation/2"
                                    img={DocForm2}
                                />
                            </motion.div>


                            <motion.div className="w-[370px] h-full">
                                <PrimaryToolCard
                                    title="مجموعة شهادات تقدير"
                                    description="يوجد اكثر من نموذج"
                                    link="/forms/certificate-of-appreciation"
                                    img={MultiCertificate}
                                    imageClassName="object-cover"
                                />
                            </motion.div>

                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {!hideNewestItems && (
                <motion.section
                    className="bg-cta-bg text-cta-foreground py-16 px-6 rounded-2xl shadow-lg container mx-auto text-center flex flex-col gap-14"
                    id="tools"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold mb-4">أحدث العناصر</h2>
                        <p className="text-lg">
                            اكتشف أحدث القوالب والنماذج الجاهزة للطباعة والمشاركة.
                        </p>
                    </div>

                    <motion.div className="flex flex-col md:flex-row gap-10 md:gap-14 justify-center items-center">
                        {[Template7background, Template8background, Template9background].map(
                            (img, index) => (
                                <motion.div
                                    key={index}
                                    className="flex-1 max-w-xs"
                                >
                                    <PrimaryToolCard
                                        title="مجموعة شهادات تقدير ( اكثر من نموذج )"
                                        description={
                                            index === 0
                                                ? "نموذج انشاء شهادة تقدير للطالبات"
                                                : index === 1
                                                    ? "نموذج انشاء للمعلمين و الطلاب"
                                                    : "نموذج انشاء شهادة تقدير للطالبات و المعلمات"
                                        }
                                        link={`/forms/certificate-of-appreciation/${7 + index}`}
                                        img={img}
                                    />
                                </motion.div>
                            )
                        )}
                    </motion.div>
                </motion.section>
            )}
        </>
    );
}

export default PrimaryToolsSection;