import { motion } from "framer-motion"
import { Heart, Sparkles, Users, TrendingUp } from "lucide-react"

const visionPoints = [
  {
    icon: Heart,
    title: "التعليم رسالة سامية",
    description: "نؤمن بأن التعليم أمانة ومسؤولية عظيمة تتطلب الإخلاص والتفاني",
  },
  {
    icon: Sparkles,
    title: "بيئة محفزة وممتعة",
    description: "نسعى لخلق بيئة تعليمية جاذبة تحفز الإبداع والتفكير النقدي",
  },
  {
    icon: Users,
    title: "قريبة من المتعلم",
    description: "نضع احتياجات المتعلمين في صميم العملية التعليمية",
  },
  {
    icon: TrendingUp,
    title: "التطوير المستمر",
    description: "نواكب أحدث الأساليب التربوية لتحقيق أفضل النتائج",
  },
]

export default function VisionSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[var(--color-primary)]/5 via-[var(--color-bg-layout)] to-[var(--color-primary)]/5 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[var(--color-text-heading)] mb-4 font-[var(--font-alhoda)]">
            الرؤية والرسالة
          </h2>
          <div className="w-24 h-1.5 bg-[var(--color-primary)] mx-auto rounded-full mb-6" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-[var(--color-text-base)] max-w-4xl mx-auto leading-relaxed font-[var(--font-amiri)] bg-[var(--color-bg-container)] p-8 rounded-2xl shadow-lg border-2 border-[var(--color-primary)]/20"
          >
            "رؤيتي أن يكون التعليم بيئة محفّزة، ممتعة، وقريبة من المتعلم"
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {visionPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-[var(--color-bg-container)] rounded-2xl p-6 border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm hover:shadow-xl text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <point.icon className="w-7 h-7 text-[var(--color-primary)]" />
                </div>

                <h3 className="text-lg font-bold text-[var(--color-text-heading)] mb-3 font-[var(--font-amiri)]">
                  {point.title}
                </h3>

                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
