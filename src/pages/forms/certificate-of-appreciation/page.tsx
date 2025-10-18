import PrimaryToolCard from "@/components/cards/ToolCard/PrimaryToolCard";
import PrimaryFooter from "@/components/sections/Footer/PrimaryFooter";
import PrimaryHeader from "@/components/sections/Header/PrimaryHeader";
import PrimarySectionTitle from "@/components/ui/SectionTitle/PrimarySectionTitle";
import { motion } from "framer-motion";

// استيراد صور الشهادات
import Template1background from "@/assets/cards_thumbnails/certificate-1.png";
import Template2background from "@/assets/cards_thumbnails/certificate-2.png";
import Template5background from "@/assets/cards_thumbnails/certificate-5.png";
import Template6background from "@/assets/cards_thumbnails/certificate-6.jpeg";
import Template7background from "@/assets/cards_thumbnails/certificate-7.png";
import Template8background from "@/assets/cards_thumbnails/certificate-8.jpeg";
import Template9background from "@/assets/cards_thumbnails/certificate-9.jpeg";

export default function CertificatesFormsPage() {
    return (
        <div className="grow flex flex-col justify-between gap-14 ">
            <PrimaryHeader />

            {/* القسم الأول: شهادات التقدير */}
            <motion.section
                className="py-14 px-3 container mx-auto"
                id="tools"
            >
                <div className="flex flex-col gap-20">
                    <PrimarySectionTitle
                        title="نماذج شهادات التقدير"
                        h4Props={{ className: "text-center text-3xl" }}
                    />

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-14"
                        variants={{
                            hidden: {},
                            show: {
                                transition: { staggerChildren: 0.15 },
                            },
                        }}
                    >
                        {/* الشهادات */}
                        <div className="max-w-xs mx-auto min-w-xs">
                            <PrimaryToolCard
                                title="نموذج شهادة تقدير"
                                description="نموذج إنشاء شهادة تقدير للمعلمين والطلاب"
                                link="/forms/certificate-of-appreciation/1"
                                img={Template1background}
                            />
                        </div>

                        <div className="max-w-xs mx-auto min-w-xs">
                            <PrimaryToolCard
                                title="نموذج شهادة تقدير"
                                description="نموذج إنشاء شهادة تقدير للطلاب والمعلمين"
                                link="/forms/certificate-of-appreciation/2"
                                img={Template2background}
                            />
                        </div>

                        <div className="max-w-xs mx-auto min-w-xs">
                            <PrimaryToolCard
                                title="نموذج شهادة تقدير"
                                description="نموذج إنشاء شهادة تقدير للطلاب والمعلمين"
                                link="/forms/certificate-of-appreciation/5"
                                img={Template5background}
                            />
                        </div>

                        <div className="max-w-xs mx-auto min-w-xs">
                            <PrimaryToolCard
                                title="نموذج شهادة تقدير"
                                description="نموذج إنشاء شهادة تقدير للطلاب"
                                link="/forms/certificate-of-appreciation/6"
                                img={Template6background}
                            />
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* القسم الثاني: أحدث القوالب */}
            <motion.section
                className="bg-cta-bg text-cta-foreground py-16 px-6 rounded-2xl shadow-lg container mx-auto text-center flex flex-col gap-14"
                id="latest"
            >
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold mb-4">أحدث القوالب</h2>
                    <p className="text-lg">
                        اكتشف أحدث نماذج شهادات التقدير الجاهزة للطباعة والمشاركة.
                    </p>
                </div>

                <motion.div className="flex flex-col md:flex-row gap-10 md:gap-14 justify-center items-center">
                    {[Template7background, Template8background, Template9background].map(
                        (img, index) => (
                            <div key={index} className="flex-1 max-w-xs">
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
                            </div>
                        )
                    )}
                </motion.div>
            </motion.section>

            <PrimaryFooter />
        </div>
    );
}
