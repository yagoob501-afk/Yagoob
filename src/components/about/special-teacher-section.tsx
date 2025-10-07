import { motion } from "framer-motion"
import { Award, Star, Trophy, CheckCircle } from "lucide-react"
import Picture from "@/assets/about/صورة 4.jpeg"

export default function SpecialTeacherSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-[var(--color-bg-base)] to-[var(--color-bg-container)] relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-10 w-64 h-64 bg-[var(--color-primary)] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-[var(--color-primary)] rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image Side - Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative order-2 lg:order-1"
                    >
                        <div className="relative">
                            {/* Main Image Container */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <div className="aspect-[4/3] bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/5 flex items-center justify-center">
                                    {/* Placeholder - Replace with actual certificate/award image */}
                                    <img
                                        src={Picture}
                                        alt="شهادة المعلم المتميز"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                animate={{
                                    rotate: [0, 5, 0, -5, 0],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute -top-6 -right-6 bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-2xl shadow-xl"
                            >
                                <Award className="w-10 h-10 text-white" />
                            </motion.div>

                            {/* Decorative Stars */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -bottom-4 -left-4 bg-[var(--color-bg-container)] p-3 rounded-xl shadow-lg"
                            >
                                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Content Side - Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-1 lg:order-2 text-center lg:text-right"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 rounded-full"
                        >
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="text-yellow-600 font-semibold text-lg">تكريم وتميز</span>
                        </motion.div>

                        {/* Main Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl sm:text-5xl font-bold text-[var(--color-text-heading)] mb-6 leading-tight"
                        >
                            معلم متميز معتمد
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-[var(--color-text-secondary)] mb-8 leading-relaxed"
                        >
                            حصل الأستاذ يعقوب يوسف العنزي على لقب <strong className="text-[var(--color-primary)]">المعلم المتميز</strong> تقديراً لجهوده المتميزة في مجال التربية والتعليم وإسهاماته الفعالة في تطوير العملية التعليمية
                        </motion.p>

                        {/* Achievement Points */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="space-y-4 mb-8"
                        >
                            {[
                                "تميز في أساليب التدريس الحديثة والمبتكرة",
                                "مساهمات فعالة في تطوير المناهج الدراسية",
                                "تفاعل إيجابي مع الطلاب وأولياء الأمور",
                                "مشاركة نشطة في الأنشطة التربوية والمجتمعية"
                            ].map((point, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="flex items-start gap-3 bg-[var(--color-bg-container)] p-4 rounded-xl shadow-sm"
                                >
                                    <CheckCircle className="w-6 h-6 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                                    <span className="text-[var(--color-text-base)] text-right leading-relaxed">
                                        {point}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.9 }}
                            className="flex flex-wrap gap-6 justify-center lg:justify-start"
                        >
                            <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 px-8 py-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <Trophy className="w-8 h-8 text-[var(--color-primary)]" />
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-[var(--color-text-heading)]">2024</div>
                                        <div className="text-sm text-[var(--color-text-secondary)]">سنة التكريم</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 px-8 py-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-[var(--color-text-heading)]">متميز</div>
                                        <div className="text-sm text-[var(--color-text-secondary)]">مستوى الأداء</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}