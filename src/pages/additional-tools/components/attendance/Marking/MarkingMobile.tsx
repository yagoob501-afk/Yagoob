"use client"

import { useMemo, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Save, ArrowRight, UserCheck, Users, UserMinus, LayoutDashboard, Image as ImageIcon, Loader2, Star, Edit, UserPlus, GraduationCap, BookOpen, Clock } from "lucide-react"
import { useLessonController, useAttendanceController, type AttendanceStatus } from "@/lib/attendance"
import { cn } from "@/lib/utils"
import { createAttendanceImage } from "@/lib/attendance/createAttendanceImage"
import { AddLessonModal } from "../Selection/AddLessonModal"
import { ManageStudentsModal } from "../Selection/ManageStudentsModal"

interface MarkingMobileProps {
  lessonId: string
  onSave: () => void
  onBack: () => void
}

export function MarkingMobile({ lessonId, onSave, onBack }: MarkingMobileProps) {
  const { getLessonById, setLessonStatus, updateLesson, setLessonStudents } = useLessonController()
  const { markStudent, toggleParticipation, getLessonAttendance, getStatusInfo } = useAttendanceController()

  const [isExporting, setIsExporting] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false)

  const lesson = getLessonById(lessonId)
  const students = lesson?.students || []
  const attendance = getLessonAttendance(lessonId)

  const handleUpdateLesson = (lessonNumber: string, subject: string, teacher: string, semester?: string) => {
    updateLesson(lessonId, { lessonNumber, subject, teacher, semester });
    setIsEditModalOpen(false);
  }

  const handleSaveStudents = (_id: string, namesStr: string) => {
    const names = namesStr.split('\n').filter(n => n.trim() !== '')
    const currentStudents = lesson?.students || []
    const updatedStudents = names.map(name => {
      const existing = currentStudents.find(s => s.name === name)
      return { id: existing?.id || crypto.randomUUID(), name }
    })
    setLessonStudents(lessonId, updatedStudents)
    setIsManageStudentsOpen(false)
  }

  const stats = useMemo(() => {
    const vals = Object.values(attendance)
    return {
      total: students.length,
      present: vals.filter(v => getStatusInfo(v).isPresent).length,
      absent: vals.filter(v => getStatusInfo(v).isAbsent).length,
      participating: vals.filter(v => getStatusInfo(v).isParticipating).length
    }
  }, [attendance, students, getStatusInfo])

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

      {/* Bento Grid Header */}
      <header className="grid grid-cols-2 gap-4 mt-4">
        {/* Card 1: Course Info */}
        <div className="col-span-2 bg-bg-container p-6 rounded-4xl border border-border shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">الدرس الحالي</span>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary opacity-40" />
                <h1 className="text-xl font-black text-text-heading font-cairo leading-tight">{lesson.subject}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-bg-layout px-3 py-1.5 rounded-xl border border-border shrink-0">
              <Clock className="w-4 h-4 text-primary opacity-40" />
              <span className="text-base font-black text-text-muted font-cairo leading-none">{lesson.lessonNumber}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4 px-1">
            <div className="flex items-center gap-3 text-text-muted opacity-80">
              <Users className="w-4 h-4" />
              <span className="text-[11px] font-bold">{lesson.teacher}</span>
            </div>
            {lesson.semester && (
              <div className="flex items-center gap-3 text-text-muted opacity-80">
                <GraduationCap className="w-4 h-4" />
                <span className="text-[11px] font-bold">{lesson.semester}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-border/50">
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-3 bg-bg-layout border border-border rounded-xl text-text-muted active:text-primary active:border-primary/50 transition-all"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsManageStudentsOpen(true)}
                className="p-3 bg-bg-layout border border-border rounded-xl text-text-muted active:text-success active:border-success/50 transition-all"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
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

        {/* Card 3: Participating */}
        <MobileStat
          label="مشاركة"
          value={stats.participating}
          color="warning"
          icon={<Star className="w-4 h-4" />}
          subtext="متفاعلين"
        />

        {/* Card 4: Present */}
        <MobileStat
          label="حضور"
          value={stats.present}
          color="success"
          icon={<UserCheck className="w-4 h-4" />}
          subtext="تم رصدهم"
        />

        {/* Card 5: Absent */}
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
          {students.map((student, idx) => {
            const info = getStatusInfo(attendance[student.id])
            return (
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
                    active={info.isPresent}
                    label="حاضر"
                    color="success"
                    onClick={() => handleMark(student.id, 'present')}
                    icon={<Check className="w-4 h-4" />}
                  />
                  <StatusTab
                    active={info.isAbsent}
                    label="غائب"
                    color="error"
                    onClick={() => handleMark(student.id, 'absent')}
                    icon={<X className="w-4 h-4" />}
                  />
                  <StatusTab
                    active={info.isParticipating}
                    label="مشاركة"
                    color="warning"
                    disabled={!info.isPresent}
                    onClick={() => toggleParticipation(lessonId, student.id)}
                    icon={<Star className={cn("w-4 h-4", info.isParticipating && "fill-current")} />}
                  />
                </div>
              </motion.div>
            )
          })}
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

      <AddLessonModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onAdd={handleUpdateLesson}
        initialData={lesson}
      />

      <ManageStudentsModal
        isOpen={isManageStudentsOpen}
        onClose={() => setIsManageStudentsOpen(false)}
        lesson={lesson}
        onSave={handleSaveStudents}
      />
    </div>
  )
}

function MobileStat({ label, value, color, icon, subtext }: { label: string, value: number, color: 'success' | 'error' | 'neutral' | 'warning', icon: ReactNode, subtext?: string }) {
  const themes = {
    success: "text-success bg-success/5 border-success/20",
    error: "text-error bg-error/5 border-error/20",
    neutral: "text-text-heading bg-bg-container border-border/50",
    warning: "text-[#B8860B] bg-yellow-50 border-yellow-200"
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

function StatusTab({ active, label, color, onClick, icon, disabled }: { active: boolean, label: string, color: 'success' | 'error' | 'neutral' | 'warning', onClick: () => void, icon: ReactNode, disabled?: boolean }) {
  const activeStyles = {
    success: "bg-success text-text-light-solid shadow-lg shadow-success/20",
    error: "bg-error text-text-light-solid shadow-lg shadow-error/20",
    neutral: "bg-text-heading text-text-light-solid shadow-lg",
    warning: "bg-[#FFD700] text-slate-900 shadow-lg shadow-yellow-200/50"
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "py-3.5 rounded-xl font-black transition-all flex items-center justify-center gap-2 outline-none",
        active ? activeStyles[color] : "text-text-muted opacity-40 text-xs",
        disabled && "opacity-10 grayscale pointer-events-none"
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
