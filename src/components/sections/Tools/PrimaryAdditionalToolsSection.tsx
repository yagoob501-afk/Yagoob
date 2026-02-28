"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import PrimaryToolCard from "@/components/cards/ToolCard/PrimaryToolCard"
import PrimarySectionTitle from "@/components/ui/SectionTitle/PrimarySectionTitle"
import { } from "lucide-react"
import QrThumbnail from "@/assets/qrcode.png"
import smartClassTools from "@/assets/smart_classroom_tools.png"
import _3_Books from "@/assets/3_books.png"
import xoGamePreview from "/images/xo_game_preview.png"

function PrimaryAdditionalToolsSection() {
  const [scale, setScale] = useState(1)
  const [contentHeight, setContentHeight] = useState<number | null>(null)

  // 🔹 حساب الـ scale بنفس أسلوب PrimaryToolsSection
  useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth
      const baseWidth = 1140
      const padding = 24 // px-3 * 2
      const availableWidth = screenWidth - padding

      const newScale = Math.min(availableWidth / baseWidth, 1)
      setScale(newScale)
    }

    calculateScale()
    window.addEventListener('focus', calculateScale);
    return () => window.removeEventListener('focus', calculateScale);

    // window.addEventListener('resize', calculateScale)
    // return () => window.removeEventListener('resize', calculateScale)
  }, [])

  // 🔹 حساب الارتفاع بعد التصغير
  useEffect(() => {
    const updateHeight = () => {
      const gridElement = document.getElementById("additional-tools-grid")
      if (gridElement) {
        const actualHeight = gridElement.scrollHeight * scale
        setContentHeight(actualHeight)
      }
    }

    const timer = setTimeout(updateHeight, 100)
    // window.addEventListener('resize', updateHeight)
    return () => {
      clearTimeout(timer)
      // window.removeEventListener('resize', updateHeight)
    }
  }, [scale])

  return (
    <motion.section
      className="px-3 overflow-x-hidden"
      id="additional-tools"
    >
      <div className="flex flex-col gap-7 w-full items-center">
        <PrimarySectionTitle
          title="أدوات إضافية"
          h4Props={{ className: "text-center text-3xl" }}
        />

        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            transition: "transform 0.3s ease",
            height: contentHeight ? `${contentHeight}px` : "auto",
          }}
        >
          <motion.div
            id="additional-tools-grid"
            className="grid grid-cols-3 w-[1140px] gap-2 h-full justify-center"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <motion.div
              className="w-[370px] h-full"
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <PrimaryToolCard
                title="تحويل الروابط إلى QR Code"
                description="قم بتحويل أي رابط إلى رمز QR قابل للمشاركة بسهولة."
                link="/additional-tools/text-to-qrcode"
                img={QrThumbnail}
              />
            </motion.div>

            <motion.div
              className="w-[370px] h-full"
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <PrimaryToolCard
                title="الأدوات الصفّية الذكية"
                description="مجموعة أدوات تفاعلية (المؤقّت، العجلة، الاختيار العشوائي) لإدارة الحصة."
                link="/additional-tools/classroom-tools"
                img={smartClassTools}
              />
            </motion.div>

            <motion.div
              className="w-[370px] h-full"
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <PrimaryToolCard
                title="لعبة XO التعليمية"
                description="لعبة تنافسية تفاعلية للطلاب تعتمد على نظام المراجعة والأسئلة لتعزيز التعلم."
                link="/additional-tools/xo-game"
                img={xoGamePreview}
              />
            </motion.div>

            <motion.div
              className="w-[370px] h-full"
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <PrimaryToolCard
                title="مكتبة الطالب التابعة لوزارة التربية"
                description="جميع حقوق الطبع محفوظة لدى وزارة التربية - دولة الكويت ©2025"
                link="https://elibrary.moe.edu.kw/StudentsLibrary"
                blank
                img={_3_Books}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default PrimaryAdditionalToolsSection
