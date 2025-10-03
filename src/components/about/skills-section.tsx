"use client"

import { motion } from "framer-motion"
import { Lightbulb, Users, Laptop, MessageSquare, Target, Sparkles } from "lucide-react"

const skills = [
  {
    icon: Lightbulb,
    title: "الاستراتيجيات التربوية الحديثة",
    description: "تطبيق أحدث أساليب التدريس التفاعلية والمبتكرة",
  },
  {
    icon: Sparkles,
    title: "التلعيب في التعليم",
    description: "استخدام عناصر اللعب لجعل التعلم أكثر جاذبية ومتعة",
  },
  {
    icon: Laptop,
    title: "التقنيات الرقمية",
    description: "توظيف الأدوات التكنولوجية في العملية التعليمية",
  },
  {
    icon: Users,
    title: "بناء الفرق",
    description: "تطوير مهارات العمل الجماعي والتعاون بين المتعلمين",
  },
  {
    icon: MessageSquare,
    title: "مجموعات النقاش",
    description: "تنظيم حوارات تفاعلية لتعزيز الفهم العميق",
  },
  {
    icon: Target,
    title: "تمثيل الأدوار",
    description: "استخدام التمثيل لتعزيز الفهم وبناء الخبرات العملية",
  },
]

export default function SkillsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg-container)]">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[var(--color-text-heading)] mb-4 font-[var(--font-alhoda)]">
            المهارات والتخصصات
          </h2>
          <div className="w-24 h-1.5 bg-[var(--color-primary)] mx-auto rounded-full mb-4" />
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            خبرة تجمع بين الجانب الأكاديمي والجانب العملي التطبيقي
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group cursor-pointer"
            >
              <div className="h-full bg-gradient-to-br from-[var(--color-bg-layout)] to-[var(--color-bg-container)] rounded-2xl p-6 border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm hover:shadow-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] transition-colors duration-300">
                    <skill.icon className="w-8 h-8 text-[var(--color-primary)] group-hover:text-[var(--color-text-light-solid)] transition-colors duration-300" />
                  </div>

                  <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-3 font-[var(--font-amiri)]">
                    {skill.title}
                  </h3>

                  <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">{skill.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
