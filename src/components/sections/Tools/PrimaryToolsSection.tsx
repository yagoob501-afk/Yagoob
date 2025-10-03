import { motion } from "framer-motion";
import PrimaryToolCard from "@/components/cards/ToolCard/PrimaryToolCard";
import DocForm1 from "@/assets/cards_thumbnails/doc_form_1.jpeg";
import Template1background from "@/assets/cards_thumbnails/certificate-1.png";
import Template2background from "@/assets/cards_thumbnails/certificate-2.png";
import Template3background from "@/assets/cards_thumbnails/certificate-3.png";
import Template4background from "@/assets/cards_thumbnails/certificate-4.png";
import Template5background from "@/assets/cards_thumbnails/certificate-5.png";
import Template6background from "@/assets/cards_thumbnails/certificate-6.png";
import Template7background from "@/assets/cards_thumbnails/certificate-7.png";
import Template8background from "@/assets/cards_thumbnails/certificate-8.png";
import Template9background from "@/assets/cards_thumbnails/certificate-9.png";
import PrimarySectionTitle from "@/components/ui/SectionTitle/PrimarySectionTitle";

function PrimaryToolsSection() {
    return (
        <>
            <motion.section
                className="py-14 px-3 container mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                id="tools"
            >
                <div className="flex flex-col gap-20">
                    <PrimarySectionTitle
                        title="نماذج جاهزة للطباعة"
                        h4Props={{ className: "text-center text-3xl" }}
                    />

                    <motion.div
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
                            // key={i}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <PrimaryToolCard
                                title="نموذج توثيق"
                                description="نموذج انشاء تقرير"
                                link="/forms/project-documentation/1"
                                img={DocForm1}
                            />
                        </motion.div>


                        <motion.div
                            // key={i}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <PrimaryToolCard
                                title="نموذج شهادة تقدير"
                                description="نموذج انشاء شهادة تقدير للمعلمين و الطلاب"
                                link="/forms/certificate-of-appreciation/1"
                                img={Template1background}
                            />
                        </motion.div>


                        <motion.div
                            // key={i}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <PrimaryToolCard
                                title="نموذج شهادة تقدير"
                                description="نموذج انشاء شهادة تقدير للطلاب و المعلمين"
                                link="/forms/certificate-of-appreciation/2"
                                img={Template2background}
                            />
                        </motion.div>


                        <motion.div
                            // key={i}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <PrimaryToolCard
                                title="نموذج شهادة تقدير"
                                description="نموذج انشاء شهادة تقدير للطلاب"
                                link="/forms/certificate-of-appreciation/3"
                                img={Template3background}
                            />
                        </motion.div>


                        <motion.div
                            // key={i}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <PrimaryToolCard
                                title="نموذج شهادة تقدير"
                                description="نموذج انشاء شهادة تقدير للطالبات"
                                link="/forms/certificate-of-appreciation/4"
                                img={Template4background}
                            />
                        </motion.div>

                        <motion.div
                            // key={i}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <PrimaryToolCard
                                title="نموذج شهادة تقدير"
                                description="نموذج انشاء شهادة تقدير للطالبات"
                                link="/forms/certificate-of-appreciation/5"
                                img={Template5background}
                            />
                        </motion.div>

                        <motion.div
                            // key={i}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <PrimaryToolCard
                                title="نموذج شهادة تقدير"
                                description="نموذج انشاء شهادة تقدير للطالبات"
                                link="/forms/certificate-of-appreciation/6"
                                img={Template6background}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>



            {/* section 2 */}
            <motion.section
                className="bg-cta-bg text-cta-foreground py-16 px-6 rounded-2xl shadow-lg container mx-auto text-center flex flex-col gap-14"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                id="tools"
            >

                {/* CTA Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold mb-4">أحدث العناصر</h2>
                    <p className="text-lg">
                        اكتشف أحدث القوالب والنماذج الجاهزة للطباعة والمشاركة.
                    </p>
                </div>

                <motion.div className="flex gap-14 justify-evenly">
                    <motion.div
                        // key={i}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            show: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <PrimaryToolCard
                            title="نموذج شهادة تقدير"
                            description="نموذج انشاء شهادة تقدير للطالبات"
                            link="/forms/certificate-of-appreciation/7"
                            img={Template7background}
                        />
                    </motion.div>

                    <motion.div
                        // key={i}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            show: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <PrimaryToolCard
                            title="نموذج شهادة تقدير"
                            description="نموذج انشاء شهادة تقدير للطالبات"
                            link="/forms/certificate-of-appreciation/8"
                            img={Template8background}
                        />
                    </motion.div>

                    <motion.div
                        // key={i}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            show: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <PrimaryToolCard
                            title="نموذج شهادة تقدير"
                            description="نموذج انشاء شهادة تقدير للطالبات"
                            link="/forms/certificate-of-appreciation/9"
                            img={Template9background}
                        />
                    </motion.div>
                </motion.div>
            </motion.section>

        </>
    );
}

export default PrimaryToolsSection;
