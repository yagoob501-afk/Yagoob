"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Minus, Save, ArrowRight, UserCheck, Users, UserMinus, Timer, LayoutDashboard, Image as ImageIcon, Loader2 } from "lucide-react"
import { useLessonController, useAttendanceController, type AttendanceStatus } from "@/lib/attendance"
import { cn } from "@/lib/utils"
import { createAttendanceImage } from "@/lib/attendance/createAttendanceImage"

interface MarkingMobileProps {
  lessonId: string
  onSave: () => void
  onBack: () => void
}

export function MarkingMobile({ lessonId, onSave, onBack }: MarkingMobileProps) {
  const { getLessonById, setLessonStatus } = useLessonController()
  const { markStudent, getLessonAttendance } = useAttendanceController()

  const lesson = getLessonById(lessonId)
  const students = lesson?.students || []
  const attendance = getLessonAttendance(lessonId)

  const [isExporting, setIsExporting] = useState(false)

  const stats = useMemo(() => {
    const vals = Object.values(attendance)
    return {
      total: students.length,
      present: vals.filter(v => v === 'present').length,
      absent: vals.filter(v => v === 'absent').length,
      ignored: vals.filter(v => v === 'ignore').length
    }
  }, [attendance, students])

  const handleMark = (studentId: string, status: AttendanceStatus) => {
    markStudent(lessonId, studentId, status)
  }

  const handleFinalSave = () => {
    setLessonStatus(lessonId, 'completed')
    onSave()
  }

  const handleExportImage = async () => {
    setIsExporting(true)

    try {
      const imageData = await createAttendanceImage({
        lesson: lesson!,
        students,
        attendance,
        stats
      })

      const dateStr = new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')
      const fileName = `كشف_حضور_${lesson?.subject}_${dateStr}.png`

      const link = document.createElement('a')
      link.download = fileName
      link.href = imageData
      link.click()
    } catch (error) {
      console.error("Export failed:", error)
      alert("عذراً، فشل تصدير الصورة.")
    } finally {
      setIsExporting(false)
    }
  }

  if (!lesson) return null

  return (
    <div className="w-full flex flex-col gap-8 rtl px-4 pb-36" dir="rtl">

      {/* 2x2 Bento Grid Header */}
      <header className="grid grid-cols-2 gap-4 mt-4">
        {/* Card 1: Course Info */}
        <div className="col-span-1 bg-bg-container p-5 rounded-4xl border border-border shadow-lg flex flex-col justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">الدرس الحالي</span>
            <h1 className="text-lg font-black text-text-heading font-cairo leading-tight">{lesson.subject}</h1>
          </div>
          <div className="mt-3 flex items-center gap-2 text-text-muted text-[10px] font-bold opacity-60">
            <Timer className="w-3.5 h-3.5" />
            <span>حصة {lesson.lessonNumber}</span>
          </div>
        </div>

        {/* Card 2: Total Students */}
        <MobileStat
          label="الطلاب"
          value={stats.total}
          color="neutral"
          icon={<Users className="w-4 h-4" />}
          subtext="إجمالي المسجلين"
        />

        {/* Card 3: Present */}
        <MobileStat
          label="حضور"
          value={stats.present}
          color="success"
          icon={<UserCheck className="w-4 h-4" />}
          subtext="تم رصدهم"
        />

        {/* Card 4: Absent */}
        <MobileStat
          label="غياب"
          value={stats.absent}
          color="error"
          icon={<UserMinus className="w-4 h-4" />}
          subtext="لم يحضروا"
        />
      </header>

      {/* Student List Section */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-success" />
            <h2 className="text-lg font-black text-text-heading">قائمة كشف الطلاب</h2>
          </div>
          <button
            onClick={handleExportImage}
            disabled={isExporting}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
            <span>{isExporting ? 'جاري التصدير...' : 'تصدير كصورة'}</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {students.map((student, idx) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="p-6 bg-bg-container rounded-4xl border border-border shadow-xl flex flex-col gap-6 relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-black text-text-heading">{student.name}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-bg-layout flex items-center justify-center text-[10px] font-black text-text-muted opacity-30 border border-border/50">
                  {idx + 1}
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="grid grid-cols-3 gap-2 bg-bg-layout p-1.5 rounded-2xl border border-border">
                <StatusTab
                  active={attendance[student.id] === 'present'}
                  label="حاضر"
                  color="success"
                  onClick={() => handleMark(student.id, 'present')}
                  icon={<Check className="w-4 h-4" />}
                />
                <StatusTab
                  active={attendance[student.id] === 'absent'}
                  label="غائب"
                  color="error"
                  onClick={() => handleMark(student.id, 'absent')}
                  icon={<X className="w-4 h-4" />}
                />
                <StatusTab
                  active={attendance[student.id] === 'ignore'}
                  label="تجاوز"
                  color="neutral"
                  onClick={() => handleMark(student.id, 'ignore')}
                  icon={<Minus className="w-4 h-4" />}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Floating Bar */}
      <div className="fixed bottom-6 left-0 w-full px-6 z-50">
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="bg-bg-container/80 backdrop-blur-2xl p-5 rounded-4xl border border-success/30 shadow-2xl flex flex-col gap-4"
        >
          <div className="flex items-center justify-between px-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-text-muted font-black text-sm opacity-40 active:opacity-100"
            >
              <ArrowRight className="w-4 h-4 text-success" />
              <span>الرجوع</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">نسبة التحضير:</span>
              <span className="text-sm font-black text-success font-mono">{Math.round((stats.present / (stats.total || 1)) * 100)}%</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleFinalSave}
            className="w-full py-5 bg-success text-text-light-solid font-black text-xl rounded-3xl shadow-xl shadow-success/20 flex items-center justify-center gap-3"
          >
            <div className="p-1.5 bg-text-light-solid/10 rounded-lg">
              <Save className="w-5 h-5" />
            </div>
            <span>حفظ الكشف وإتمام الحصة</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

function MobileStat({ label, value, color, icon, subtext }: { label: string, value: number, color: 'success' | 'error' | 'neutral', icon: React.ReactNode, subtext?: string }) {
  const themes = {
    success: "text-success bg-success/5 border-success/20",
    error: "text-error bg-error/5 border-error/20",
    neutral: "text-text-heading bg-bg-container border-border/50"
  }
  return (
    <div className={cn("flex flex-col items-center justify-center p-5 rounded-4xl border shadow-lg gap-1 text-center", themes[color])}>
      <div className="flex items-center gap-1.5 opacity-40">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-2xl font-black font-cairo tracking-tighter">{value}</span>
      {subtext && (
        <span className="text-[8px] font-bold opacity-30 uppercase tracking-tighter">{subtext}</span>
      )}
    </div>
  )
}

function StatusTab({ active, label, color, onClick, icon }: { active: boolean, label: string, color: 'success' | 'error' | 'neutral', onClick: () => void, icon: React.ReactNode }) {
  const activeStyles = {
    success: "bg-success text-text-light-solid shadow-lg shadow-success/20",
    error: "bg-error text-text-light-solid shadow-lg shadow-error/20",
    neutral: "bg-text-heading text-text-light-solid shadow-lg"
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        "py-3.5 rounded-xl font-black transition-all flex items-center justify-center gap-2 outline-none",
        active ? activeStyles[color] : "text-text-muted opacity-40 text-sm"
      )}
    >
      <AnimatePresence mode="wait">
        {active && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>{icon}</motion.div>
        )}
      </AnimatePresence>
      <span>{label}</span>
    </button>
  )
}
