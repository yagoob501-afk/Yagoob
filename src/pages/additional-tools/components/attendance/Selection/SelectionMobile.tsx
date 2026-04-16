"use client"

import { useMemo, useRef, useState, type ChangeEvent } from "react"
import { motion } from "framer-motion"
import { useLessonController, useAttendanceController, useAttendanceStore } from "@/lib/attendance"
import { cn } from "@/lib/utils"
import { exportAllToPdf } from "@/lib/attendance/exportAllToPdf"
import { extractAttendanceFromPdf, type ImportResult } from "@/lib/attendance/importPdf"
import { AttendanceImportModal } from "./AttendanceImportModal"
import { Calendar, BookOpen, FileDown, Loader2, FileUp, Plus, Edit, UserCheck, UserPlus, Trash2, Star, HelpCircle, Users } from "lucide-react"
import { AddLessonModal } from "./AddLessonModal"
import { ManageStudentsModal } from "./ManageStudentsModal"

interface SelectionMobileProps {
  onSelectLesson: (id: string) => void
  onBack: () => void
}

export function SelectionMobile({ onSelectLesson, onBack: _ }: SelectionMobileProps) {
  const { lessons, addLesson, removeLesson, setLessonStudents, updateLesson } = useLessonController()
  const { getGlobalStats } = useAttendanceController()
  const { setLessons, setAttendance } = useAttendanceStore()
  const { attendance } = useAttendanceStore()

  // Lesson Management State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
  const [editingStudentsLessonId, setEditingStudentsLessonId] = useState<string | null>(null)

  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)

  // Import State
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importData, setImportData] = useState<ImportResult | null>(null)
  const [importFileName, setImportFileName] = useState("")
  const [isImporting, setIsImporting] = useState(false)

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

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
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

    setLessons(importData.lessons)
    setAttendance(importData.attendance)

    setImportModalOpen(false)
    setImportData(null)

    alert("تم استيراد البيانات بنجاح!")
  }

  const handleAddLesson = (lessonNumber: string, subject: string, teacher: string, semester?: string) => {
    if (editingLessonId) {
      updateLesson(editingLessonId, { lessonNumber, subject, teacher, semester });
      setEditingLessonId(null);
    } else {
      addLesson(lessonNumber, subject, teacher, "", semester);
    }
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
    <div className="w-full flex flex-col gap-8 rtl px-4 pb-20" dir="rtl">

      {/* Date & Header Title */}
      <section className="flex items-start justify-between mt-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-text-heading font-cairo">جدول الدروس اليومي</h1>
          <p className="text-text-muted text-sm font-bold flex items-center gap-2 opacity-60">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Add Lesson Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-4 rounded-2xl bg-primary text-white shadow-lg active:scale-95 transition-all flex items-center justify-center border border-primary/20"
          >
            <Plus className="w-6 h-6" />
          </button>

          {/* Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting || isExporting}
            className={cn(
              "p-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center",
              isImporting ? "bg-bg-container text-text-muted" : "bg-bg-container text-primary border border-primary/20"
            )}
          >
            {isImporting ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileUp className="w-6 h-6" />}
          </button>

          <button
            onClick={handleBatchExport}
            disabled={isExporting || lessons.length === 0}
            className={cn(
              "p-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center",
              isExporting ? "bg-bg-container text-text-muted" : "bg-success text-white"
            )}
          >
            {isExporting ? (
              <div className="flex flex-col items-center gap-1">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-[8px] font-black">{progress.toFixed(0)}%</span>
              </div>
            ) : (
              <FileDown className="w-6 h-6" />
            )}
          </button>
        </div>
      </section>

      {/* Lesson Cards List */}
      <section className="space-y-4">
        {lessons.map((lesson, idx) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={lesson.status !== 'completed' ? { scale: 0.98 } : {}}
            transition={{ delay: idx * 0.1 }}
            onClick={() => {
              onSelectLesson(lesson.id)

            }}
            className={cn(
              "p-6 rounded-[2.5rem] border transition-all relative overflow-hidden cursor-pointer",
              lesson.status === 'completed'
                ? "bg-bg-container border-success/20 border-r-4 border-r-success opacity-80"
                : "bg-bg-container border-primary/20 border-r-4 border-r-primary shadow-xl active:bg-bg-layout/50"
            )}
          >
            <div className="flex justify-between items-start mb-5">
              <div className="flex gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  lesson.status === 'completed' ? "bg-bg-layout text-success" : "bg-primary/10 text-primary"
                )}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-40">
                    الحصة {lesson.lessonNumber} • {lesson.teacher}
                    {lesson.semester && ` • ${lesson.semester}`}
                  </span>
                  <h3 className="text-xl font-black text-text-heading font-cairo leading-tight">{lesson.subject}</h3>
                </div>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                lesson.status === 'completed' ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
              )}>
                {lesson.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
              </div>
            </div>

            {lesson.status !== 'completed' ? (
              <div className="flex flex-col gap-3">
                <div
                  onClick={(e) => { e.stopPropagation(); onSelectLesson(lesson.id); }}
                  className="w-full py-4 bg-linear-to-r from-text-heading to-bg-layout-strong text-text-light-solid font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg text-sm border border-border/50"
                >
                  <UserCheck className="w-5 h-5 text-success" />
                  <span>رصد الحضور الآن</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingLessonId(lesson.id); setIsAddModalOpen(true); }}
                    className="flex-1 py-3 bg-bg-container border border-border rounded-xl text-text-muted font-bold text-xs flex items-center justify-center gap-2 hover:text-primary transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    تعديل
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingStudentsLessonId(lesson.id); }}
                    className="flex-1 py-3 bg-bg-container border border-border rounded-xl text-text-muted font-bold text-xs flex items-center justify-center gap-2 hover:text-success transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    الطلاب
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm('حذف هذه الحصة؟')) { removeLesson(lesson.id); } }}
                    className="px-4 py-3 bg-bg-container border border-border rounded-xl text-error/40 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-success opacity-60">
                  <UserCheck className="w-4 h-4" />
                  <span>تم الانتهاء من رصد هذه الحصة بنجاح</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); if (confirm('حذف هذه الحصة؟')) { removeLesson(lesson.id); } }}
                  className="p-2 text-error/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        ))}

        {lessons.length === 0 && (
          <div className="p-10 text-center flex flex-col items-center gap-4 bg-bg-container rounded-[2.5rem] border border-dashed border-border">
            <BookOpen className="w-12 h-12 text-primary" />
            <div className="space-y-1">
              <p className="font-black text-text-heading">لا توجد حصص مضافة</p>
              <p className="text-xs font-bold">ابدأ بإضافة أول حصة ليومك</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black text-sm"
            >
              إضافة حصة الآن
            </button>
          </div>
        )}
      </section>

      {/* Summary Stats Bento Grid */}
      <section className="grid grid-cols-2 gap-4 pb-10">
        <div className="col-span-2 bg-bg-container border border-border rounded-[2.5rem] p-8 flex items-center justify-between overflow-hidden relative shadow-lg">
          <div className="z-10">
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">معدل الحضور العام</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-primary font-mono tracking-tighter">{stats.rate}%</span>
              <span className="text-[10px] text-success font-black bg-success/10 px-2 py-0.5 rounded-full">مباشر</span>
            </div>
          </div>
          <div className="opacity-5 absolute -left-4 -bottom-4 animate-pulse">
            <UserCheck className="w-24 h-24" />
          </div>
        </div>
        <div className="bg-bg-container border border-border rounded-[2.5rem] p-6 shadow-lg flex flex-col gap-4">
          <Users className="w-6 h-6 text-primary opacity-60" />
          <div>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest leading-none mb-1">إجمالي الطلاب</p>
            <h4 className="text-2xl font-black text-text-heading font-mono">{stats.totalStudents}</h4>
          </div>
        </div>
        <div className="bg-bg-container border border-border rounded-[2.5rem] p-6 shadow-lg flex flex-col gap-4">
          <Star className="w-6 h-6 text-amber-500 opacity-60" />
          <div>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest leading-none mb-1">إجمالي المشاركة</p>
            <h4 className="text-2xl font-black text-text-heading font-mono">{stats.totalParticipating}</h4>
          </div>
        </div>
        <div className="col-span-2 bg-bg-container border border-border rounded-[2.5rem] p-6 shadow-lg flex flex-row items-center gap-4">
          <HelpCircle className="w-8 h-8 text-error opacity-60" />
          <div>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest leading-none mb-1">غيابات اليوم</p>
            <h4 className="text-2xl font-black text-text-heading font-mono">{stats.totalAbsent}</h4>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <div className="flex justify-center pb-8">
        <p className="text-text-muted font-bold text-[10px] opacity-40">
          يمكنك إدارة الطلاب والحصص مباشرة من البطاقات أعلاه.
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
        onClose={() => { setIsAddModalOpen(false); setEditingLessonId(null); }}
        onAdd={handleAddLesson}
        initialData={editingLessonId ? lessons.find(l => l.id === editingLessonId) : null}
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
