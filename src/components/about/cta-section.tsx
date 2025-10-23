import { links } from "@/config/links";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Instagram, Youtube } from "lucide-react";
import { useNavigate } from "react-router";

export default function CTASection() {
    const navigate = useNavigate();

    return (
        <section id="join-us" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[var(--color-bg-layout)] via-[var(--color-bg-base)] to-[var(--color-bg-layout)] relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-primary)] rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto max-w-5xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-active)] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl text-center"
                >
                    {/* <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text-light-solid)] mb-6 font-alhoda"
                    >
                        هل تبحث عن التميز التعليمي؟
                    </motion.h2> */}

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-xl text-[var(--color-text-light-solid)]/90 mb-10 max-w-2xl mx-auto leading-relaxed font-[var(--font-tajawal)]"
                    >
                        دعنا نعمل معًا لتطوير العملية التعليمية وبناء جيل متميز من المتعلمين
                    </motion.p>

                    {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.open(links.supportLink, "_blank")}
                            className="group bg-[var(--color-bg-container)] text-[var(--color-primary)] cursor-pointer px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 font-[var(--font-amiri)]"
                        >
                            قم بدعمي لأستمر في بناء الادوات
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/")}

                            className="cursor-pointer bg-[var(--color-text-light-solid)]/10 text-[var(--color-text-light-solid)] px-8 py-4 rounded-xl font-bold text-lg border-2 border-[var(--color-text-light-solid)]/30 hover:bg-[var(--color-text-light-solid)]/20 transition-all duration-300 font-[var(--font-amiri)]"
                        >
                            تصفح الادوات
                        </motion.button>
                    </motion.div> */}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-wrap gap-6 justify-center"
                    >
                        {/* Telegram */}
                        <div className="flex items-center gap-3 text-[var(--color-text-light-solid)]">
                            <a
                                href="https://t.me/Group_teacher_yagoob"
                                target="_blank"
                                className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors"
                            >
                                <Send className="w-5 h-5" />
                                <span className="font-semibold">Telegram</span>
                            </a>
                        </div>

                        {/* Instagram */}
                        <div className="flex items-center gap-3 text-[var(--color-text-light-solid)]">
                            <a
                                href="https://www.instagram.com/yagoob_0?igsh=MWVlcGt0aGM3bWo0MA%3D%3D&utm_source=qr"
                                target="_blank"
                                className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                                <span className="font-semibold">Instagram</span>
                            </a>
                        </div>

                        {/* YouTube */}
                        <div className="flex items-center gap-3 text-[var(--color-text-light-solid)]">
                            <a
                                href="https://youtube.com/@yaqoob_alenezi?si=7eY7zhbArjjAhtEZ"
                                target="_blank"
                                className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors"
                            >
                                <Youtube className="w-5 h-5" />
                                <span className="font-semibold">YouTube</span>
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
