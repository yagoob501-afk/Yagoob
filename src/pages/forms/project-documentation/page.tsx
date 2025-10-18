import DocForm1 from "@/assets/cards_thumbnails/doc_form_1.jpeg";
import DocForm2 from "@/assets/cards_thumbnails/doc_form_2.jpeg";
import PrimaryToolCard from "@/components/cards/ToolCard/PrimaryToolCard";
import PrimaryFooter from "@/components/sections/Footer/PrimaryFooter";
import PrimaryHeader from "@/components/sections/Header/PrimaryHeader";
import PrimarySectionTitle from "@/components/ui/SectionTitle/PrimarySectionTitle";
import { motion } from "framer-motion";

export default function DocumentationFormsPage() {
    return (
        <div className="grow flex flex-col justify-between">
            <PrimaryHeader />

            <motion.section
                className="py-14 px-3 container mx-auto"
                // initial={{ opacity: 0, y: 50 }}
                // animate={{ opacity: 1, y: 0 }}
                // transition={{ duration: 0.8, ease: "easeInOut" }}
                id="tools"
            >
                <div className="flex flex-col gap-20">
                    <PrimarySectionTitle
                        title="نماذج جاهزة للطباعة"
                        h4Props={{ className: "text-center text-3xl" }}
                    />

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-14"
                        // initial="hidden"
                        // whileInView="show"
                        // viewport={{ once: false, amount: 0.2 }}
                        variants={{
                            hidden: {},
                            show: {
                                transition: { staggerChildren: 0.15 },
                            },
                        }}
                    >
                        <div
                            className="max-w-xs mx-auto min-w-xs"
                        >
                            <PrimaryToolCard
                                title="نموذج توثيق 1"
                                description="نموذج انشاء تقرير"
                                link="/forms/project-documentation/1"
                                img={DocForm1}
                            />
                        </div>

                        <div
                            className="max-w-xs mx-auto min-w-xs"
                        >
                            <PrimaryToolCard
                                title="نموذج توثيق 2"
                                description="نموذج انشاء تقرير و التحكم في الالوان"
                                link="/forms/project-documentation/2"
                                img={DocForm2}
                            />
                        </div>


                    </motion.div>
                </div>
            </motion.section>

            <PrimaryFooter />
        </div>
    )
}