"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Users, Calendar, FolderPlus, ArrowRight, Save, UserCheck, LayoutList } from "lucide-react"
import { useLessonController, type Lesson } from "@/lib/attendance"
import { cn } from "@/lib/utils"

interface SetupDesktopProps {
  onNext: () => void
  onClear: () => void
}

export function SetupDesktop({ onNext }: SetupDesktopProps) {
  const { lessons, addLesson, removeLesson, setLessonStudents } = useLessonController()
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
  const [newLesson, setNewLesson] = useState({ lessonNumber: "", subject: "", teacher: "", date: "" })
  const [bulkStudents, setBulkStudents] = useState("")

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLesson.lessonNumber || !newLesson.subject) return
    addLesson(newLesson.lessonNumber, newLesson.subject, newLesson.teacher, newLesson.date)
    setNewLesson({ lessonNumber: "", subject: "", teacher: "", date: "" })
  }

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLessonId(lesson.id)
    setBulkStudents((lesson.students || []).map(s => s.name).join("\n"))
  }

  const handleSaveStudents = () => {
    if (!selectedLessonId) return
    const currentStudents = selectedLesson?.students || []
    const names = bulkStudents.split("\n").map(n => n.trim()).filter(n => n !== "")
    
    const studentsList = names.map(name => {
      // Find existing student with the same name to preserve ID
      const existing = currentStudents.find(s => s.name === name)
      return {
        id: existing ? existing.id : crypto.randomUUID(),
        name
      }
    })

    setLessonStudents(selectedLessonId, studentsList)
    setSelectedLessonId(null)
  }

  const selectedLesson = lessons.find(l => l.id === selectedLessonId)

  return (
    <div className="w-full flex flex-col gap-12 rtl" dir="rtl">

      <AnimatePresence mode="wait">
        {!selectedLessonId ? (
          <motion.div
            key="lessons-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            {/* Intro Header */}
            <section className="mb-4">
              <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-text-heading font-cairo">إعداد الحصص الدراسية</h1>
              <p className="text-text-muted text-lg max-w-2xl font-bold opacity-60">مرحباً بك. ابدأ بإضافة الحصص المجدولة لليوم، ثم اضغط على كل حصة لإضافة طلابها.</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* Lessons Table */}
              <div className="bg-bg-container rounded-[2.5rem] overflow-hidden border border-border shadow-xl">
                <div className="p-8 flex justify-between items-center bg-bg-layout/50 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-text-heading">قائمة الحصص</h2>
                  </div>
                  <span className="px-5 py-2 bg-primary/5 text-primary text-xs font-black rounded-full border border-primary/20">{lessons.length} حصص</span>
                </div>

                <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                  {lessons.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center gap-4 opacity-40">
                      <LayoutList className="w-12 h-12" />
                      <span className="font-bold">لا توجد حصص مضافة حالياً</span>
                    </div>
                  )}
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="group relative bg-bg-layout/50 hover:bg-bg-layout border border-border/50 p-6 rounded-3xl transition-all cursor-pointer flex justify-between items-center"
                      onClick={() => handleSelectLesson(lesson)}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-bg-container rounded-2xl border border-border flex items-center justify-center font-black text-lg text-primary shadow-sm group-hover:scale-110 transition-transform">
                          {lesson.lessonNumber}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-text-heading">{lesson.subject}</h3>
                          <p className="text-sm font-bold text-text-muted opacity-60">{lesson.teacher || 'بدون معلم'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 border",
                          (lesson.students?.length || 0) > 0 ? "bg-success/5 text-success border-success/20" : "bg-error/5 text-error border-error/20"
                        )}>
                          <Users className="w-3 h-3" />
                          <span>{lesson.students?.length || 0} طالب</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeLesson(lesson.id); }}
                          className="p-3 text-error/30 hover:text-error hover:bg-error/10 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Lesson Form */}
              <div className="bg-bg-container border border-border rounded-[2.5rem] p-10 shadow-xl flex flex-col gap-6">
                <div className="space-y-2 mb-4">
                  <h3 className="text-2xl font-black text-text-heading">إضافة حصة جديدة</h3>
                  <p className="text-text-muted text-sm font-bold opacity-60">املأ البيانات أدناه لإدراج حصة جديدة في الجدول</p>
                </div>
                <form onSubmit={handleAddLesson} className="flex flex-col gap-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1 space-y-2">
                      <label className="text-xs font-black text-text-muted px-2">الحصة</label>
                      <input
                        type="text"
                        placeholder="#"
                        value={newLesson.lessonNumber}
                        onChange={(e) => setNewLesson({ ...newLesson, lessonNumber: e.target.value })}
                        className="w-full bg-bg-layout border border-border/50 rounded-2xl py-4 text-center font-black text-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                      />
                    </div>
                    <div className="col-span-3 space-y-2">
                      <label className="text-xs font-black text-text-muted px-2">اسم المادة / الدرس</label>
                      <input
                        type="text"
                        placeholder="مثال: رياضيات، فيزياء..."
                        value={newLesson.subject}
                        onChange={(e) => setNewLesson({ ...newLesson, subject: e.target.value })}
                        className="w-full bg-bg-layout border border-border/50 rounded-2xl px-6 py-4 font-black text-xl focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted px-2">اسم المعلم (اختياري)</label>
                    <input
                      type="text"
                      placeholder="اسم المعلم القائم بالحصة"
                      value={newLesson.teacher}
                      onChange={(e) => setNewLesson({ ...newLesson, teacher: e.target.value })}
                      className="w-full bg-bg-layout border border-border/50 rounded-2xl px-6 py-4 font-bold text-xl focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-6 bg-primary text-text-light-solid font-black text-2xl rounded-3xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                  >
                    <FolderPlus className="w-8 h-8" />
                    <span>إدراج الحصة في الجدول</span>
                  </button>
                </form>
              </div>
            </div>

            <footer className="mt-12 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05, x: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                disabled={lessons.length === 0}
                className="group relative inline-flex items-center gap-4 px-12 py-6 rounded-3xl bg-success text-text-light-solid font-black text-2xl transition-all duration-300 shadow-2xl shadow-success/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>التالي: الجدول الزمني ←</span>
                <div className="w-10 h-10 rounded-full bg-text-light-solid/10 flex items-center justify-center group-hover:-translate-x-2 transition-transform">
                  <ArrowRight className="w-6 h-6 rotate-180" />
                </div>
              </motion.button>
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="student-management"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-10"
          >
            <div className="flex items-center gap-6 mb-8">
              <button
                onClick={() => setSelectedLessonId(null)}
                className="p-4 bg-bg-container border border-border rounded-2xl hover:bg-bg-layout transition-all shadow-sm"
              >
                <ArrowRight className="w-6 h-6 text-success" />
              </button>
              <div>
                <h2 className="text-4xl font-extrabold text-text-heading font-cairo">إدارة طلاب {selectedLesson?.subject}</h2>
                <p className="text-text-muted font-bold opacity-60">الحصة {selectedLesson?.lessonNumber} • {selectedLesson?.teacher}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-2 space-y-4">
                <div className="bg-bg-container border border-border rounded-[2.5rem] p-10 shadow-xl flex flex-col gap-6">
                  <div className="flex items-center gap-4 text-primary">
                    <Users className="w-8 h-8" />
                    <h3 className="text-2xl font-black">إدخال أسماء الطلاب</h3>
                  </div>
                  <p className="text-sm font-bold text-text-muted -mt-2">قم بكتابة أو لصق قائمة الطلاب هنا. (كل اسم في سطر جديد)</p>

                  <textarea
                    value={bulkStudents}
                    onChange={(e) => setBulkStudents(e.target.value)}
                    placeholder="نايف بن محمد...&#10;خالد بن عبدالعزيز...&#10;سعد بن عبدالله..."
                    className="w-full h-[400px] bg-bg-layout border border-border/50 rounded-4xl p-8 text-2xl font-black text-text-heading focus:border-success focus:ring-8 focus:ring-success/5 transition-all outline-none resize-none shadow-inner"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-bg-container border border-border rounded-[2.5rem] p-8 shadow-xl flex flex-col gap-6">
                  <div className="p-5 bg-success/5 text-success rounded-2xl border border-success/10 flex items-center justify-between">
                    <span className="font-black text-lg">العدد الإجمالي</span>
                    <span className="text-3xl font-black font-mono">{bulkStudents.split("\n").filter(n => n.trim() !== "").length}</span>
                  </div>
                  <div className="p-6 bg-bg-layout rounded-3xl border border-border/50 flex flex-col gap-4">
                    <div className="flex items-center gap-3 opacity-60">
                      <UserCheck className="w-5 h-5" />
                      <span className="font-bold text-sm">سيتم حفظ التغييرات مع الحفاظ على سجل حضور الطلاب الحاليين.</span>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveStudents}
                    className="w-full py-6 bg-success text-text-light-solid font-black text-2xl rounded-3xl shadow-2xl shadow-success/20 hover:shadow-success/40 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <Save className="w-7 h-7" />
                    <span>حفظ القائمة والعودة</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
