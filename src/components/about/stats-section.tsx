"use client"

import { motion } from "framer-motion"
import { Users, Award, BookOpen, Sparkles } from "lucide-react"

const stats = [
  {
    icon: Users,
    number: "500+",
    label: "طالب مستفيد",
    description: "من البرامج التعليمية",
  },
  {
    icon: Award,
    number: "50+",
    label: "ورشة تدريبية",
    description: "للمعلمين والمربين",
  },
  {
    icon: BookOpen,
    number: "7+",
    label: "سنوات خبرة",
    description: "في التعليم والتدريب",
  },
  {
    icon: Sparkles,
    number: "100%",
    label: "التزام بالتميز",
    description: "في العملية التعليمية",
  },
]

export default function StatsSection() {
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
            الإنجازات بالأرقام
          </h2>
          <div className="w-24 h-1.5 bg-[var(--color-primary)] mx-auto rounded-full" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-active)] rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-[var(--color-text-light-solid)]/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-[var(--color-text-light-solid)]" />
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3, type: "spring" }}
                  className="text-5xl font-bold text-[var(--color-text-light-solid)] mb-2 font-[var(--font-alhoda)]"
                >
                  {stat.number}
                </motion.div>

                <h3 className="text-xl font-bold text-[var(--color-text-light-solid)] mb-2 font-[var(--font-amiri)]">
                  {stat.label}
                </h3>

                <p className="text-[var(--color-text-light-solid)]/80 text-sm">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
