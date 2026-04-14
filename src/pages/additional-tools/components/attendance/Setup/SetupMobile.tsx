"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Users, Calendar, FolderPlus, ArrowRight, Save, UserCheck } from "lucide-react"
import { useLessonController, type Lesson } from "@/lib/attendance"
import { cn } from "@/lib/utils"

interface SetupMobileProps {
  onNext: () => void
  onClear: () => void
}

export function SetupMobile({ onNext }: SetupMobileProps) {
  const { lessons, addLesson, removeLesson, setLessonStudents } = useLessonController()
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
  const [newLesson, setNewLesson] = useState({ lessonNumber: "", subject: "", teacher: "", date: "" })
  const [bulkStudents, setBulkStudents] = useState("")

  const handleAddLesson = () => {
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
    <div className="w-full flex flex-col gap-10 rtl pb-32 px-4" dir="rtl">
      
      <AnimatePresence mode="wait">
        {!selectedLessonId ? (
          <motion.div
            key="lessons"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-10"
          >
            {/* Page Title */}
            <section className="text-center mt-4">
              <h1 className="text-3xl font-black text-text-heading font-cairo">إعداد كشف الحصص</h1>
              <p className="text-sm text-text-muted font-bold mt-1 opacity-60">أضف حصص اليوم وحدد طلاب كل حصة</p>
            </section>

            {/* Lessons Section */}
            <section className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-black text-text-heading">حصص اليوم</h2>
                </div>
                <span className="text-xs font-black text-primary bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">{lessons.length} حصة</span>
              </div>

              <div className="flex flex-col gap-4">
                {lessons.map((lesson) => (
                  <motion.div
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson)}
                    className="flex items-center justify-between p-5 bg-bg-container rounded-3xl border border-border shadow-lg active:scale-95 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-bg-layout border border-border/50 flex items-center justify-center text-xl font-black text-primary">
                        {lesson.lessonNumber}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-text-heading leading-tight">{lesson.subject}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="w-3 h-3 text-text-muted opacity-40" />
                          <span className={cn("text-[10px] font-black", (lesson.students?.length || 0) > 0 ? "text-success" : "text-error")}>
                            {lesson.students?.length || 0} طالب
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeLesson(lesson.id); }}
                      className="p-3 text-error/30 active:text-error rounded-2xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}

                {/* Add Lesson Card */}
                <div className="p-6 bg-bg-container/50 rounded-[2.5rem] border-2 border-dashed border-primary/20 flex flex-col gap-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="#"
                      value={newLesson.lessonNumber}
                      onChange={(e) => setNewLesson({ ...newLesson, lessonNumber: e.target.value })}
                      className="w-16 bg-bg-container border border-border rounded-2xl py-4 text-center text-text-heading font-black text-xl outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="اسم المادة"
                      value={newLesson.subject}
                      onChange={(e) => setNewLesson({ ...newLesson, subject: e.target.value })}
                      className="flex-1 bg-bg-container border border-border rounded-2xl px-6 py-4 text-text-heading font-black text-lg outline-none focus:border-primary"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="اسم المعلم"
                    value={newLesson.teacher}
                    onChange={(e) => setNewLesson({ ...newLesson, teacher: e.target.value })}
                    className="bg-bg-container border border-border rounded-2xl px-6 py-4 text-text-heading font-bold text-lg outline-none focus:border-primary"
                  />
                  <button
                    onClick={handleAddLesson}
                    className="w-full py-5 bg-primary text-text-light-solid font-black text-lg rounded-2xl flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                  >
                    <FolderPlus className="w-5 h-5" />
                    <span>إضافة حصة</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Float Next Button */}
            <div className="fixed bottom-8 left-0 w-full px-6 z-40">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                disabled={lessons.length === 0}
                className="w-full py-6 bg-success text-text-light-solid font-black text-xl rounded-4xl flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50"
              >
                <ArrowRight className="w-6 h-6 rotate-180" />
                <span>الجدول التالي</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="students"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => setSelectedLessonId(null)}
                className="p-3 bg-bg-container border border-border rounded-2xl shadow-sm"
              >
                <ArrowRight className="w-6 h-6 text-success" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-text-heading font-cairo">طلاب {selectedLesson?.subject}</h2>
                <p className="text-xs font-bold text-text-muted opacity-60">الحصة {selectedLesson?.lessonNumber}</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-bg-container border border-border rounded-[2.5rem] p-6 shadow-xl flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="font-black text-text-heading">قائمة الأسماء</span>
                  <span className="text-xl font-black text-primary font-mono">{bulkStudents.split("\n").filter(n => n.trim() !== "").length} طالب</span>
                </div>
                <textarea
                  value={bulkStudents}
                  onChange={(e) => setBulkStudents(e.target.value)}
                  placeholder="اكتب الأسماء هنا... مثال:&#10;محمد العتيبي&#10;خالد الشمري"
                  className="w-full h-[350px] bg-bg-layout border border-border/50 rounded-3xl p-6 text-xl font-black text-text-heading outline-none focus:border-success transition-all resize-none shadow-inner"
                />
              </div>

              <div className="p-4 bg-success/5 border border-success/10 rounded-2xl flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-success mt-0.5" />
                <span className="text-xs font-bold text-success leading-relaxed">تنبيه: سيتم رصد الغيابات والحضور بناءً على هذه القائمة فقط لهذه الحصة.</span>
              </div>

              <button
                onClick={handleSaveStudents}
                className="w-full py-6 bg-success text-text-light-solid font-black text-2xl rounded-3xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Save className="w-6 h-6" />
                <span>حفظ وإتمام</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
