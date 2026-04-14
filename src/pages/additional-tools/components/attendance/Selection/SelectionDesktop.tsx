"use client"

import { useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useLessonController, useAttendanceController, useAttendanceStore } from "@/lib/attendance"
import { cn } from "@/lib/utils"
import { exportAllToPdf } from "@/lib/attendance/exportAllToPdf"
import { extractAttendanceFromPdf, type ImportResult } from "@/lib/attendance/importPdf"
import { AttendanceImportModal } from "./AttendanceImportModal"
import { Calendar, Table2, TrendingUp, AlertTriangle, Eye, Users, FileDown, Loader2, FileUp, Plus, UserPlus, Trash2, Star } from "lucide-react"
import { AddLessonModal } from "./AddLessonModal"
import { ManageStudentsModal } from "./ManageStudentsModal"

interface SelectionDesktopProps {
  onSelectLesson: (id: string) => void
  onBack: () => void
}

export function SelectionDesktop({ onSelectLesson, onBack: _ }: SelectionDesktopProps) {
  const { lessons, addLesson, removeLesson, setLessonStudents } = useLessonController()
  const { getGlobalStats } = useAttendanceController()
  const { setLessons, setAttendance } = useAttendanceStore()
  const { attendance } = useAttendanceStore()

  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)

  // Import State
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importData, setImportData] = useState<ImportResult | null>(null)
  const [importFileName, setImportFileName] = useState("")
  const [isImporting, setIsImporting] = useState(false)

  // Lesson Management State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingStudentsLessonId, setEditingStudentsLessonId] = useState<string | null>(null)

  const stats = useMemo(() => getGlobalStats(), [lessons, getGlobalStats])

  const handleBatchExport = async () => {
    setIsExporting(true)
    try {
      await exportAllToPdf({
        lessons,
        attendance,
        onProgress: (current) => setProgress(current)
      })
    } catch (error) {
      console.error("Batch export failed:", error)
      alert(error instanceof Error ? error.message : "فشل تصدير الملف.")
    } finally {
      setIsExporting(false)
      setProgress(0)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const result = await extractAttendanceFromPdf(file)
      setImportData(result)
      setImportFileName(file.name)
      setImportModalOpen(true)
    } catch (error) {
      console.error("Import failed:", error)
      alert(error instanceof Error ? error.message : "فشل استيراد الملف. تأكد من أنه ملف PDF تم تصديره من هذا النظام.")
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleConfirmImport = () => {
    if (!importData) return

    // Replace all data
    setLessons(importData.lessons)
    setAttendance(importData.attendance)

    setImportModalOpen(false)
    setImportData(null)

    // Success feedback
    alert("تم استيراد البيانات بنجاح!")
  }

  const handleAddLesson = (lessonNumber: string, subject: string, teacher: string) => {
    addLesson(lessonNumber, subject, teacher, "");
  }

  const handleSaveStudents = (lessonId: string, studentNames: string) => {
    const currentLesson = lessons.find(l => l.id === lessonId);
    const existingStudents = currentLesson?.students || [];

    const names = studentNames.split("\n").map(n => n.trim()).filter(n => n !== "")
    const studentsList = names.map(name => {
      const existing = existingStudents.find(s => s.name === name)
      return {
        id: existing ? existing.id : crypto.randomUUID(),
        name
      }
    })
    setLessonStudents(lessonId, studentsList)
  }

  const editingLesson = lessons.find(l => l.id === editingStudentsLessonId) || null;

  return (
    <div className="w-full flex flex-col gap-12 rtl pb-20" dir="rtl">

      {/* Header Section */}
      <header className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-5xl font-black text-text-heading tracking-tight font-cairo">جدول الحصص اليومي</h1>
        <p className="text-text-muted font-bold text-xl opacity-60 max-w-2xl">اختر الحصة المناسبة للبدء في عملية رصد الحضور اليومي للطلاب.</p>
      </header>

      {/* Main Table Container */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-container rounded-[2.5rem] overflow-hidden border border-border shadow-2xl relative"
      >
        {/* Glassmorphism header for table */}
        <div className="bg-bg-layout/70 backdrop-blur-md p-8 flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-4">
            <div className="bg-bg-container p-3.5 rounded-2xl shadow-sm border border-border/50">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-text-heading">قائمة الحصص المجدولة</h2>
              <p className="text-sm text-text-muted font-bold">اليوم، {new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf"
              className="hidden"
            />

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-text-light-solid font-black text-sm transition-all shadow-xl shadow-primary/20 active:scale-95 hover:bg-primary-prism"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة حصة</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting || isExporting}
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95",
                isImporting
                  ? "bg-bg-layout text-text-muted cursor-not-allowed"
                  : "bg-bg-container text-text-heading border border-border hover:bg-bg-layout"
              )}
            >
              <FileUp className="w-5 h-5 text-primary" />
              <span>{isImporting ? "جاري الاستيراد..." : "استيراد"}</span>
            </button>

            <button
              onClick={handleBatchExport}
              disabled={isExporting || lessons.length === 0}
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95",
                isExporting
                  ? "bg-bg-layout text-text-muted cursor-not-allowed"
                  : "bg-success text-text-light-solid shadow-success/20 hover:shadow-success/40"
              )}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري المعالجة ({progress.toFixed(0)}%)...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-5 h-5" />
                  <span>تصدير اليوم كاملاً (PDF)</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-bg-layout/40 text-text-muted">
                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest">رقم الحصة</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest">الدرس / الموضوع</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest">اسم المعلم</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest">الحالة</th>
                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {lessons.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <Calendar className="w-16 h-16" />
                      <div className="space-y-1">
                        <p className="text-2xl font-black">لا توجد حصص مجدولة حالياً</p>
                        <p className="text-sm font-bold">ابدأ بإضافة أول حصة لتتمكن من رصد الحضور.</p>
                      </div>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-4 px-8 py-4 bg-primary text-text-light-solid rounded-2xl font-black text-lg shadow-lg active:scale-95 flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        إضافة حصة الآن
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {lessons.map((lesson) => (
                <tr
                  key={lesson.id}
                  className="group hover:bg-bg-layout transition-colors cursor-pointer"
                  onClick={() => onSelectLesson(lesson.id)}
                >
                  <td className="px-10 py-8">
                    <span className="text-lg font-black text-text-muted group-hover:text-primary transition-colors">{lesson.lessonNumber.padStart(2, '0')}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-bg-layout flex items-center justify-center border border-border/50 group-hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.1)] transition-all">
                        {/* Subject Icons based on number for variety */}
                        {lesson.lessonNumber === '1' ? <Table2 className="w-6 h-6 text-success" /> :
                          lesson.lessonNumber === '2' ? <TrendingUp className="w-6 h-6 text-primary" /> :
                            <Calendar className="w-6 h-6 text-text-muted opacity-40" />}
                      </div>
                      <div>
                        <span className="text-xl font-black text-text-heading leading-tight block">{lesson.subject}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="w-3.5 h-3.5 text-text-muted opacity-40" />
                          <span className="text-xs font-bold text-text-muted opacity-60">{(lesson.students?.length || 0)} طالب</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-on-surface-variant font-bold">
                    {lesson.teacher}
                  </td>
                  <td className="px-10 py-8">
                    <div className={cn(
                      "inline-flex items-center gap-3 px-5 py-2 rounded-full border-l-4 font-black text-xs uppercase tracking-widest transition-all",
                      lesson.status === 'completed'
                        ? "bg-success/5 text-success border-success/30 border-l-success"
                        : "bg-primary/5 text-primary border-primary/30 border-l-primary"
                    )}>
                      {lesson.status === 'completed' ? 'مكتمل' : 'قيد التحضير'}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center justify-center gap-2">
                      {/* Add/Edit Students Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingStudentsLessonId(lesson.id); }}
                        className="p-3 bg-bg-container border border-border rounded-xl text-text-muted hover:text-success hover:border-success/50 transition-all shadow-sm"
                        title="إدارة الطلاب"
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); if (confirm('حذف هذه الحصة؟')) { removeLesson(lesson.id); } }}
                        className="p-3 bg-bg-container border border-border rounded-xl text-text-muted hover:text-error hover:border-error/50 transition-all shadow-sm"
                        title="حذف الحصة"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <span className="w-px h-6 bg-border/20 mx-1" />

                      {lesson.status === 'completed' ? (
                        <div className="p-3 text-success">
                          <Eye className="w-5 h-5" />
                        </div>
                      ) : (
                        <button className="bg-text-heading text-text-light-solid font-black px-6 py-3 rounded-xl text-xs active:scale-95 transition-all">
                          رصد الحضور
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom stats bar inside section */}
        <div className="bg-bg-layout/50 p-6 px-10 border-t border-border flex justify-between items-center text-sm font-bold text-text-muted">
          <div className="flex gap-8">
            <span className="flex items-center gap-2 tracking-wide"><div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_8px_rgba(123,160,91,0.5)]" /> حصص مكتملة: {lessons.filter(l => l.status === 'completed').length}</span>
            <span className="flex items-center gap-2 tracking-wide"><div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(32,30,48,0.5)]" /> حصص متبقية: {lessons.filter(l => l.status !== 'completed').length}</span>
          </div>
          <span className="opacity-60">إجمالي الحصص المسجلة لهذا اليوم: {lessons.length}</span>
        </div>
      </motion.section>

      {/* Bottom Informational Bento Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <SelectionInfoCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="معدل الحضور العام"
          value={stats.rate + "%"}
          trend="مباشر"
          color="primary"
        />
        <SelectionInfoCard
          icon={<Star className="w-6 h-6" />}
          label="إجمالي المشاركين"
          value={stats.totalParticipating.toString()}
          trend="تفاعل"
          color="warning"
        />
        <SelectionInfoCard
          icon={<Users className="w-6 h-6" />}
          label="إجمالي الطلاب المسجلين"
          value={stats.totalStudents.toString()}
          trend="نشط"
          color="success"
        />
        <SelectionInfoCard
          icon={<AlertTriangle className="w-6 h-6" />}
          label="غياب غير مبرر اليوم"
          value={stats.totalAbsent.toString()}
          trend="تنبيه"
          color="error"
        />
      </section>

      {/* Footer Info */}
      <div className="flex justify-center mt-4">
        <p className="text-text-muted font-bold text-sm opacity-40">
          يمكنك إدارة الطلاب والحصص مباشرة من الجدول أعلاه.
        </p>
      </div>

      <AttendanceImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onConfirm={handleConfirmImport}
        fileName={importFileName}
      />

      <AddLessonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLesson}
      />

      <ManageStudentsModal
        isOpen={!!editingStudentsLessonId}
        onClose={() => setEditingStudentsLessonId(null)}
        lesson={editingLesson}
        onSave={handleSaveStudents}
      />
    </div>
  )
}

function SelectionInfoCard({ icon, label, value, trend, color }: { icon: React.ReactNode, label: string, value: string, trend: string, color: 'primary' | 'success' | 'error' | 'warning' }) {
  const colorClasses = {
    primary: "bg-primary/5 text-primary border-primary/20",
    success: "bg-success/5 text-success border-success/20",
    error: "bg-error/5 text-error border-error/20",
    warning: "bg-yellow-50 text-amber-600 border-yellow-200"
  }[color]

  return (
    <div className="bg-bg-container p-8 rounded-[2.5rem] border border-border shadow-xl flex flex-col gap-6 hover:shadow-2xl transition-all">
      <div className="flex justify-between items-start">
        <div className={cn("p-3.5 rounded-2xl border", colorClasses)}>
          {icon}
        </div>
        <span className={cn("text-sm font-black uppercase tracking-widest", color === 'error' ? 'text-error' : color === 'success' ? 'text-success' : 'text-primary')}>
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-bold text-text-muted opacity-60 mb-1">{label}</h3>
        <p className="text-4xl font-black text-text-heading font-cairo">{value}</p>
      </div>
    </div>
  )
}
