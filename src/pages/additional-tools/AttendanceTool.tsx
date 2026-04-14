"use client"

import { useState } from "react"
import { useAttendanceStore } from "@/lib/attendance"
import { LayoutGroup } from "framer-motion"
import { House, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

import { SelectionFactory } from "./components/attendance/Selection/SelectionFactory"
import { MarkingFactory } from "./components/attendance/Marking/MarkingFactory"

export default function AttendanceTool() {
  const { reset, _hasHydrated } = useAttendanceStore()
  const [step, setStep] = useState<2 | 3>(2)
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)

  const handleClearData = () => {
    if (confirm("هل أنت متأكد من مسح جميع البيانات (الطلاب والحصص)؟")) {
      reset()
      setStep(2)
      setSelectedLessonId(null)
    }
  }

  // Prevent SSR/CSR mismatch by only rendering after hydration
  if (!_hasHydrated) return null

  const renderContent = () => {
    switch (step) {
      case 2:
        return (
          <SelectionFactory
            onSelectLesson={(id: string) => {
              setSelectedLessonId(id)
              setStep(3)
            }}
            onBack={() => {}} // Removed back to setup
          />
        )
      case 3:
        return (
          <MarkingFactory
            lessonId={selectedLessonId!}
            onSave={() => {
              setStep(2)
              setSelectedLessonId(null)
            }}
            onBack={() => {
              setStep(2)
              setSelectedLessonId(null)
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-base relative overflow-x-hidden selection:bg-primary/30 font-cairo" dir="rtl">
      {/* Top Utility Buttons */}
      <div className="fixed top-6 right-6 z-50 flex gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-bg-container text-text-secondary font-bold border-2 border-border hover:bg-bg-layout rounded-2xl transition-all shadow-sm active:scale-95"
        >
          <House className="w-5 h-5 text-text-muted" />
          <span className="hidden sm:inline">العودة للرئيسية</span>
        </Link>

        <button
          onClick={handleClearData}
          className="flex items-center gap-2 px-6 py-3 bg-error/5 text-error font-bold border-2 border-error/10 hover:bg-error/10 rounded-2xl transition-all shadow-sm active:scale-95"
        >
          <Trash2 className="w-5 h-5" />
          <span className="hidden sm:inline">مسح البيانات</span>
        </button>
      </div>

      <LayoutGroup>
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center">
          <div className="w-full mt-8">
            {renderContent()}
          </div>
        </div>
      </LayoutGroup>

      {/* Global Background (Cognitive Prism) */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-prism/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary-prism/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10" />
      </div>
    </div>
  )
}
