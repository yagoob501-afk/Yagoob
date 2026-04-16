"use client"

import { useMemo, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Save, ArrowRight, UserCheck, Users, Search, Image as ImageIcon, Loader2, Star, Edit, UserPlus, GraduationCap, BookOpen, Clock } from "lucide-react"
import { useLessonController, useAttendanceController, type AttendanceStatus, type Lesson } from "@/lib/attendance"
import { cn } from "@/lib/utils"
import { createAttendanceImage } from "@/lib/attendance/createAttendanceImage"
import { AddLessonModal } from "../Selection/AddLessonModal"
import { ManageStudentsModal } from "../Selection/ManageStudentsModal"

interface MarkingDesktopProps {
  lessonId: string
  onSave: () => void
  onBack: () => void
}

export function MarkingDesktop({ lessonId, onSave, onBack }: MarkingDesktopProps) {
  const { getLessonById, setLessonStatus, updateLesson, setLessonStudents } = useLessonController()
  const { markStudent, toggleParticipation, getLessonAttendance, getStatusInfo } = useAttendanceController()

  const [searchQuery, setSearchQuery] = useState("")
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

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students
    const q = searchQuery.toLowerCase()
    return students.filter(s =>
      s.name.toLowerCase().includes(q)
    )
  }, [students, searchQuery])

  const handleMark = (studentId: string, status: AttendanceStatus) => {
    markStudent(lessonId, studentId, status)
  }

  const handleFinalSave = () => {
    setLessonStatus(lessonId, 'completed')
    onSave()
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

  const handleExportImage = async () => {
    setIsExporting(true)

    try {
      const imageData = await createAttendanceImage({
        lesson: lesson as Lesson,
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
      alert("عذراً، فشل تصدير الصورة. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsExporting(false)
    }
  }

  if (!lesson) return null

  return (
    <div className="w-full h-full flex flex-col gap-10 rtl" dir="rtl">

      {/* Hero Header Section */}
      <header className="flex justify-between items-end gap-10 border-b-2 border-border/50 pb-10">
        <div className="flex items-center gap-8">

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h1 className="text-5xl font-black text-text-heading font-cairo tracking-tight leading-[1.1] truncate">
                  {lesson.subject}
                </h1>
              </div>

              <div className="flex items-center gap-3 bg-bg-layout px-5 py-3 rounded-2xl border border-border shrink-0 shadow-sm">
                <Clock className="w-6 h-6 text-primary opacity-60" />
                <span className="text-3xl font-black text-text-muted font-cairo leading-none">{lesson.lessonNumber}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-text-muted font-bold text-xl opacity-80">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Users className="w-5 h-5" />
                </div>
                <span>{lesson.teacher}</span>
              </div>

              {lesson.semester && (
                <div className="flex items-center gap-3 text-text-muted font-bold text-xl opacity-80">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span>{lesson.semester}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2 ml-6">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-4 bg-bg-container border border-border rounded-2xl text-text-muted hover:text-primary hover:border-primary/50 transition-all shadow-sm group"
              title="تعديل بيانات الحصة"
            >
              <Edit className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => setIsManageStudentsOpen(true)}
              className="p-4 bg-bg-container border border-border rounded-2xl text-text-muted hover:text-success hover:border-success/50 transition-all shadow-sm group"
              title="إدارة قائمة الطلاب"
            >
              <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          <div className="flex gap-4">
            <DesktopHeaderStat label="إجمالي الطلاب" value={stats.total} color="neutral" />
            <DesktopHeaderStat label="حضور" value={stats.present} color="success" />
            <DesktopHeaderStat label="غياب" value={stats.absent} color="error" />
            <DesktopHeaderStat label="مشاركة" value={stats.participating} color="warning" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div className="bg-bg-container rounded-[2.5rem] overflow-hidden border border-border shadow-2xl relative">
            <div className="bg-bg-layout/70 backdrop-blur-md p-8 flex justify-between items-center border-b border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-2xl text-success">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-text-heading">قائمة كشف الطلاب</h2>
              </div>
              <div className="relative w-80">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted opacity-40" />
                <input
                  type="text"
                  placeholder="بحث عن اسم طالب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-bg-layout/50 border border-border/50 rounded-2xl py-3 pr-10 pl-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-bg-layout/40 text-text-muted">
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-center">#</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">اسم الطالب</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-center" style={{ width: '400px' }}>حالة الحضور</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {filteredStudents.map((student,) => {
                    // Find actual index in original list for the number column
                    const originalIdx = students.findIndex(s => s.id === student.id)
                    const info = getStatusInfo(attendance[student.id])

                    return (
                      <tr
                        key={student.id}
                        className={cn(
                          "group transition-all hover:bg-bg-layout/30",
                          info.isPresent ? "bg-success/5" :
                            info.isAbsent ? "bg-error/5" : ""
                        )}
                      >
                        <td className="px-8 py-6 text-center">
                          <span className="text-lg font-black text-text-muted font-mono">{originalIdx + 1}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-xl font-black text-text-heading group-hover:text-primary transition-colors">{student.name}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 justify-center">
                            <MarkingButton
                              active={info.isPresent}
                              onClick={() => handleMark(student.id, 'present')}
                              color="success"
                              label="حاضر"
                              icon={<Check className="w-4 h-4" />}
                            />
                            <MarkingButton
                              active={info.isAbsent}
                              onClick={() => handleMark(student.id, 'absent')}
                              color="error"
                              label="غائب"
                              icon={<X className="w-4 h-4" />}
                            />
                            <MarkingButton
                              active={info.isParticipating}
                              disabled={!info.isPresent}
                              onClick={() => toggleParticipation(lessonId, student.id)}
                              color="warning"
                              label="المشاركة"
                              icon={<Star className={cn("w-4 h-4", info.isParticipating && "fill-current")} />}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom table info */}
            <div className="bg-bg-layout/50 p-5 px-10 border-t border-border flex justify-between items-center text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">
              <div className="flex gap-6">
                <span>إجمالي الطلاب: {stats.total}</span>
                <span className="text-success">حضور: {stats.present}</span>
                <span className="text-error">غياب: {stats.absent}</span>
              </div>
              <span>نظام الرصد الذكي v2.0</span>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="sticky top-12 flex flex-col gap-6">
            <div className="bg-bg-container p-8 rounded-[2.5rem] border border-border shadow-2xl flex flex-col gap-8">
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-text-muted opacity-60" />
                  <span className="text-[10px] font-bold text-text-muted opacity-80">{lesson.teacher}</span>
                </div>
                {lesson.semester && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-text-muted opacity-60" />
                    <span className="text-[10px] font-bold text-text-muted opacity-80">{lesson.semester}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-4 py-3 bg-bg-layout rounded-2xl border border-border/50 font-black">
                  <span className="text-xs opacity-60 uppercase">النسبة المئوية</span>
                  <span className="text-xl text-primary font-mono">{Math.round((stats.present / (stats.total || 1)) * 100)}%</span>
                </div>
                <div className="px-4 py-6 rounded-2xl border-2 border-dashed border-success/20 flex flex-col items-center gap-2 text-center">
                  <UserCheck className="w-10 h-10 text-success opacity-40" />
                  <span className="text-xs font-bold text-success">تم رصد وتأكيد {stats.present + stats.absent} طالب من أصل {stats.total}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleFinalSave}
                  className="w-full py-6 bg-success text-text-light-solid font-black text-xl rounded-2xl shadow-xl shadow-success/20 hover:shadow-success/40 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Save className="w-6 h-6" />
                  <span>حفظ وإتمام الحصة</span>
                </button>
                <button
                  onClick={onBack}
                  className="w-full py-4 text-text-muted font-black text-sm hover:text-text-heading transition-all flex items-center justify-center gap-2 opacity-60"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>العودة للجدول</span>
                </button>
              </div>
            </div>

            {/* Export Action Card */}
            <div className="p-6 rounded-[2.5rem] border border-primary/20 shadow-xl flex flex-col gap-4 bg-primary/2">
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-black text-primary">تصدير التقرير</h4>
                <p className="text-[10px] font-bold text-text-muted opacity-60 italic">يمكنك حفظ نسخة من الكشف كصورة عالية الجودة للمشاركة.</p>
              </div>
              <button
                onClick={handleExportImage}
                disabled={isExporting}
                className="w-full py-4 bg-bg-container text-primary border-2 border-primary hover:bg-primary hover:text-text-light-solid font-black text-sm rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isExporting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
                <span>{isExporting ? 'جاري التصدير...' : 'تصدير كصورة PNG'}</span>
              </button>
            </div>

            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-3">
              <div className="p-2 bg-primary rounded-xl text-text-light-solid">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-[10px] font-bold text-primary leading-relaxed uppercase">
                ملاحظة: خيار "المشاركة" يستخدم للطلاب المتفاعلين والذين أجابوا على الأسئلة خلال الحصة.
              </p>
            </div>
          </div>
        </aside>
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

function DesktopHeaderStat({ label, value, color }: { label: string, value: number, color: 'success' | 'error' | 'neutral' | 'warning' }) {
  const colors = {
    success: "text-success border-success/30 bg-success/5",
    error: "text-error border-error/30 bg-error/5",
    neutral: "text-text-muted border-border bg-bg-layout",
    warning: "text-[#B8860B] border-yellow-200 bg-yellow-50"
  }
  return (
    <div className={cn("px-8 py-5 rounded-3xl border min-w-[160px] flex flex-col items-center gap-1 shadow-sm", colors[color])}>
      <span className="text-xs font-black uppercase tracking-widest opacity-60">{label}</span>
      <span className="text-3xl font-black font-cairo tracking-tighter">{value}</span>
    </div>
  )
}

function MarkingButton({ active, onClick, color, label, icon, disabled }: { active: boolean, onClick: () => void, color: 'success' | 'error' | 'neutral' | 'warning', label: string, icon: ReactNode, disabled?: boolean }) {
  const themes = {
    success: active ? "bg-success text-text-light-solid shadow-lg shadow-success/20" : "text-success bg-success/5 hover:bg-success/10 border-success/20",
    error: active ? "bg-error text-text-light-solid shadow-lg shadow-error/20" : "text-error bg-error/5 hover:bg-error/10 border-error/20",
    neutral: active ? "bg-text-heading text-text-light-solid shadow-lg" : "text-text-muted bg-bg-layout hover:bg-bg-layout-strong border-border/50",
    warning: active ? "bg-[#FFD700] text-slate-900 shadow-lg shadow-yellow-200/50" : "text-[#B8860B] bg-yellow-50 hover:bg-yellow-100 border-yellow-200/50"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-1 py-3 px-4 rounded-xl font-black text-[10px] transition-all flex items-center justify-center gap-2 border active:scale-95 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed",
        themes[color],
        !active && "border-transparent"
      )}
    >
      <AnimatePresence mode="wait">
        {active && (
          <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
            {icon}
          </motion.div>
        )}
      </AnimatePresence>
      <span>{label}</span>
    </button>
  )
}
