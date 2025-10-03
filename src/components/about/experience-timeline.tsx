import { motion } from "framer-motion"
import { Briefcase, Users, TrendingUp, Target } from "lucide-react"

const experiences = [
  {
    icon: Briefcase,
    title: "معلم تربية إسلامية",
    organization: "منطقة العاصمة التعليمية",
    description: "تدريس التربية الإسلامية مع التركيز على الأساليب التفاعلية والتلعيب",
    year: "الحاضر",
  },
  {
    icon: Users,
    title: "مدرب معلمين",
    organization: "ورش تدريبية متخصصة",
    description: "تقديم ورش تدريبية للمعلمين حول أحدث الاستراتيجيات التربوية",
    year: "مستمر",
  },
  {
    icon: TrendingUp,
    title: "أمين صندوق",
    organization: "الاتحاد الوطني لطلبة جامعة الكويت",
    description: "إدارة الموارد المالية وتطوير مهارات القيادة والتنظيم",
    year: "سابقاً",
  },
  {
    icon: Target,
    title: "باحث تربوي",
    organization: "دراسات عليا",
    description: "البحث في الإدارة التربوية وتطوير أساليب التعليم الحديثة",
    year: "مستمر",
  },
]

export default function ExperienceTimeline() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg-layout)] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-[var(--color-primary)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-[var(--color-primary)] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[var(--color-text-heading)] mb-4 font-[var(--font-alhoda)]">
            المسيرة المهنية
          </h2>
          <div className="w-24 h-1.5 bg-[var(--color-primary)] mx-auto rounded-full mb-4" />
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            رحلة من التعلم والتطوير المستمر في مجال التربية والتعليم
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute right-1/2 top-0 bottom-0 w-0.5 bg-[var(--color-border)]" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col lg:flex-row gap-8 items-center ${
                  index % 2 === 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content Card */}
                <div className="w-full lg:w-[calc(50%-2rem)]">
                  <div className="bg-[var(--color-bg-container)] rounded-2xl p-6 sm:p-8 border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm hover:shadow-xl group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <exp.icon className="w-7 h-7 text-[var(--color-primary)]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[var(--color-text-heading)] mb-1 font-[var(--font-amiri)]">
                          {exp.title}
                        </h3>
                        <p className="text-[var(--color-primary)] font-semibold font-[var(--font-tajawal)]">
                          {exp.organization}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-[var(--color-text-light-solid)] bg-[var(--color-primary)] px-3 py-1 rounded-full">
                        {exp.year}
                      </span>
                    </div>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">{exp.description}</p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="hidden lg:flex absolute right-1/2 w-6 h-6 bg-[var(--color-primary)] rounded-full border-4 border-[var(--color-bg-layout)] transform -translate-x-1/2 z-10" />

                {/* Spacer for alternating layout */}
                <div className="hidden lg:block w-[calc(50%-2rem)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
