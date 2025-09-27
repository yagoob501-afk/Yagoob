"use client"
import { motion } from "framer-motion";
import PrimaryToolCard from "@/components/cards/ToolCard/PrimaryToolCard";
import Img5 from "@/assets/5.png";
import PrimarySectionTitle from "@/components/ui/SectionTitle/PrimarySectionTitle";

function PrimaryToolsSection() {
    return (
        <motion.section
            className="py-14 px-3 container mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
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
                    {[...Array(7)].map((_, i) => (
                        <motion.div
                            key={i}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <PrimaryToolCard
                                title="نموذج توثيق"
                                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, autem adipisci! Earum doloremque libero exercitationem debitis sed aut vero pariatur ratione eius, magni ullam, maxime aliquid aperiam voluptas beatae eaque."
                                link="/forms/project-documentation/1"
                                img={Img5}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}

export default PrimaryToolsSection;
