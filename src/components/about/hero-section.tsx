import { motion } from "framer-motion"
import { GraduationCap, Award, Users } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--color-bg-container)] via-[var(--color-bg-base)] to-[var(--color-bg-layout)]">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[var(--color-primary)] rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4 px-6 py-2 bg-[var(--color-primary)]/10 rounded-full"
            >
              <span className="text-[var(--color-primary)] font-[var(--font-amiri)] text-lg font-semibold">
                معلم تربية إسلامية
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text-heading)] mb-6 font-[var(--font-alhoda)] leading-tight"
            >
              يعقوب يوسف العنزي
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl text-[var(--color-text-secondary)] mb-8 leading-relaxed font-[var(--font-tajawal)]"
            >
              معلم تربية إسلامية في منطقة العاصمة التعليمية
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-[var(--color-text-muted)] mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              أؤمن أن التعليم رسالة سامية وأمانة، لذلك أسعى دائمًا إلى تطوير أساليب التدريس بما يواكب احتياجات المتعلمين
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-3 bg-[var(--color-bg-container)] px-6 py-3 rounded-xl shadow-sm">
                <GraduationCap className="w-6 h-6 text-[var(--color-primary)]" />
                <span className="text-[var(--color-text-base)] font-semibold">ماجستير</span>
              </div>
              <div className="flex items-center gap-3 bg-[var(--color-bg-container)] px-6 py-3 rounded-xl shadow-sm">
                <Award className="w-6 h-6 text-[var(--color-primary)]" />
                <span className="text-[var(--color-text-base)] font-semibold">خبرة تدريبية</span>
              </div>
              <div className="flex items-center gap-3 bg-[var(--color-bg-container)] px-6 py-3 rounded-xl shadow-sm">
                <Users className="w-6 h-6 text-[var(--color-primary)]" />
                <span className="text-[var(--color-text-base)] font-semibold">قيادة نقابية</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Main Image Container */}
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-active)] p-1">
                <div className="w-full h-full bg-[var(--color-bg-container)] rounded-3xl flex items-center justify-center">
                  <img
                    src="/professional-islamic-education-teacher-portrait.jpg"
                    alt="يعقوب يوسف العنزي"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -top-6 -right-6 bg-[var(--color-bg-container)] p-4 rounded-2xl shadow-lg"
              >
                <GraduationCap className="w-8 h-8 text-[var(--color-primary)]" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-[var(--color-bg-container)] p-4 rounded-2xl shadow-lg"
              >
                <Award className="w-8 h-8 text-[var(--color-primary)]" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="w-6 h-10 border-2 border-[var(--color-primary)] rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-[var(--color-primary)] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
