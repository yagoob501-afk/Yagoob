"use client"

import { motion } from "framer-motion"
import { GraduationCap, BookOpen, Award } from "lucide-react"

const qualifications = [
  {
    icon: GraduationCap,
    title: "بكالوريوس التربية الإسلامية",
    institution: "جامعة الكويت",
    description: "تخصص في التربية الإسلامية مع التركيز على أساليب التدريس الحديثة",
    color: "var(--color-primary)",
  },
  {
    icon: Award,
    title: "ماجستير الإدارة التربوية",
    institution: "جامعة الكويت",
    description: "دراسات متقدمة في الإدارة التربوية والقيادة التعليمية",
    color: "var(--color-success)",
  },
  {
    icon: BookOpen,
    title: "خبرة في العمل النقابي",
    institution: "الاتحاد الوطني لطلبة جامعة الكويت",
    description: "أمين صندوق - صقل مهارات القيادة والتنظيم وبناء الفرق",
    color: "var(--color-info)",
  },
]

export default function QualificationsSection() {
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
            المؤهلات العلمية
          </h2>
          <div className="w-24 h-1.5 bg-[var(--color-primary)] mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {qualifications.map((qual, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="h-full bg-[var(--color-bg-layout)] rounded-2xl p-8 border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm hover:shadow-xl">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${qual.color}20` }}
                >
                  <qual.icon className="w-8 h-8" style={{ color: qual.color }} />
                </div>

                <h3 className="text-2xl font-bold text-[var(--color-text-heading)] mb-2 font-[var(--font-amiri)]">
                  {qual.title}
                </h3>

                <p className="text-[var(--color-primary)] font-semibold mb-4 font-[var(--font-tajawal)]">
                  {qual.institution}
                </p>

                <p className="text-[var(--color-text-secondary)] leading-relaxed">{qual.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
