"use client"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

function PrimaryHeroSection() {
    const { t } = useTranslation();

    return (
        <motion.section
            className="flex flex-col text-center py-7 md:text-start relative gap-14 md:flex-row justify-between mx-auto min-h-[70vh] px-14"
            initial={{ opacity: 0, y: 50 }} // start hidden
            whileInView={{ opacity: 1, y: 0 }} // animate when in view
            exit={{ opacity: 0, y: -50 }} // animate when leaving
            transition={{ duration: 0.8, ease: "easeInOut" }}
            viewport={{ once: false, amount: 0.3 }} // triggers again when re-enters
        >
            {/* background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-bg-base via-text-muted/20 to-primary/10"></div>
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            {/* text content */}
            <div className="grow w-full space-y-8 flex flex-col justify-center">
                <motion.h1
                    className="text-4xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.5 }}
                >
                    {t("sections.primary hero.title")}
                </motion.h1>

                <motion.h2
                    className="text-lg leading-relaxed text-text-muted"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.5 }}
                >
                    {t("sections.primary hero.subtitle")}
                </motion.h2>
            </div>

            {/* placeholder for media */}
            <motion.div
                className="border rounded-md grow w-full self-center min-h-96"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.4 }}
            />
        </motion.section>
    )
}

export default PrimaryHeroSection
