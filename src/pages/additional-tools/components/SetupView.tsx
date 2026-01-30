"use client"

import { useState, useRef, useEffect } from "react"
import { Users, HelpCircle, Gift, Clock, Trash2, ArrowLeft, Image as ImageIcon, Type, LayoutGrid, Plus, X, Edit3 } from "lucide-react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { motion, AnimatePresence } from "framer-motion"
import type { TimerState } from "./TimerTool"
import type { RandomStudentState } from "./RandomStudentTool"
import type { QuestionToolState } from "./QuestionTool"
import type { RewardToolState } from "./RewardTool"
import { useTour } from "@/components/tour/TourProvider"

interface SetupViewProps {
  timerState: TimerState
  setTimerState: (u: Partial<TimerState>) => void
  studentState: RandomStudentState
  setStudentState: (u: Partial<RandomStudentState>) => void
  questionState: QuestionToolState
  setQuestionState: (u: Partial<QuestionToolState>) => void
  rewardState: RewardToolState
  setRewardState: (u: Partial<RewardToolState>) => void
  onStart: () => void
}

export default function SetupView({
  timerState,
  setTimerState,
  studentState,
  setStudentState,
  questionState,
  setQuestionState,
  rewardState,
  setRewardState,
  onStart
}: SetupViewProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'questions' | 'rewards' | 'timer'>('students')
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const { isOpen: isTourActive } = useTour()

  // Inline Question Form State
  const [newQuestionText, setNewQuestionText] = useState("")
  const [newQuestionImage, setNewQuestionImage] = useState<string | null>(null)
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)

  // Refs for each tab button
  const studentsTabRef = useRef<HTMLButtonElement>(null)
  const questionsTabRef = useRef<HTMLButtonElement>(null)
  const rewardsTabRef = useRef<HTMLButtonElement>(null)
  const timerTabRef = useRef<HTMLButtonElement>(null)

  // Auto-scroll active tab into view
  useEffect(() => {
    const tabRefs = {
      students: studentsTabRef,
      questions: questionsTabRef,
      rewards: rewardsTabRef,
      timer: timerTabRef
    }

    const activeTabRef = tabRefs[activeTab]

    // Scroll the active tab into view with a slight delay to ensure DOM is ready
    if (activeTabRef.current) {
      setTimeout(() => {
        activeTabRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        })
      }, 100)
    }
  }, [activeTab])

  const handleTimeChange = (type: 'm' | 's', v: number) => {
    const m = type === 'm' ? v : timerState.minutes
    const s = type === 's' ? v : timerState.seconds
    const tot = m * 60 + s
    setTimerState({ minutes: m, seconds: s, timeLeft: tot, totalTime: tot, isRunning: false, isFinished: false })
  }

  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-xl border border-border overflow-hidden min-h-[600px] flex flex-col">
      <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 gap-2 overflow-x-auto" data-tour="setup-tabs">
        <button
          ref={studentsTabRef}
          onClick={() => setActiveTab('students')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'students' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-gray-100'}`}
          data-tour="tab-students"
        >
          <Users size={18} /> الطلاب
        </button>
        <button
          ref={questionsTabRef}
          onClick={() => setActiveTab('questions')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'questions' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-gray-100'}`}
          data-tour="tab-questions"
        >
          <HelpCircle size={18} /> الأسئلة
        </button>
        <button
          ref={rewardsTabRef}
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'rewards' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-gray-100'}`}
          data-tour="tab-rewards"
        >
          <Gift size={18} /> المكافآت
        </button>
        <button
          ref={timerTabRef}
          onClick={() => setActiveTab('timer')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'timer' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-gray-100'}`}
          data-tour="tab-timer"
        >
          <Clock size={18} /> الوقت
        </button>
      </div>

      <div className="flex-1 p-6 sm:p-8 flex flex-col">
        {activeTab === 'students' && (
          <div className="flex-1 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">قائمة الطلاب</h3>
              <span className="text-sm text-muted-foreground">{studentState.studentsText.split('\n').filter(s => s.trim()).length} اسم</span>
            </div>
            <textarea
              value={studentState.studentsText}
              onChange={(e) => setStudentState({ studentsText: e.target.value })}
              placeholder="اكتب أسماء الطلاب هنا (كل اسم في سطر مستقل)..."
              className="flex-1 w-full p-4 rounded-2xl border-2 border-border focus:border-primary outline-none resize-none min-h-[300px]"
              data-tour="setup-students"
            />
            {studentState.excludedStudents.length > 0 && (
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <h4 className="text-sm font-bold text-red-600 mb-2">المستبعدون ({studentState.excludedStudents.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {studentState.excludedStudents.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setStudentState({ excludedStudents: studentState.excludedStudents.filter(item => item !== s) })}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-colors"
                      title="إعادة للقائمة"
                    >
                      {s} <Trash2 size={10} className="rotate-45" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Demo excluded students - only shown during tour */}
            {isTourActive && studentState.excludedStudents.length === 0 && (
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100" data-tour="demo-excluded-students">
                <h4 className="text-sm font-bold text-red-600 mb-2">المستبعدون (0)</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-colors animate-pulse"
                    title="مثال: اضغط لإعادة الطالب للقائمة"
                  >
                    محمد (مثال) <Trash2 size={10} className="rotate-45" />
                  </button>
                </div>
                <p className="text-xs text-red-600 mt-2 opacity-70">💡 هنا ستظهر أسماء الطلاب المستبعدين. اضغط على الاسم لإعادته للقائمة.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Question Mode Selector */}
            <div className="flex bg-white rounded-2xl p-1.5 border-2 border-border gap-2" data-tour="question-mode-selector">
              {[
                { id: 'text', label: 'نصوص', icon: Type },
                { id: 'hybrid', label: 'صور و نصوص', icon: LayoutGrid }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setQuestionState({ mode: m.id as any })}
                  className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${questionState.mode === m.id ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-gray-50'}`}
                >
                  <m.icon size={18} /> {m.label}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">إعداد الأسئلة</h3>
              <span className="text-sm text-muted-foreground">
                {questionState.mode === 'text'
                  ? `${questionState.questions.split('\n').filter(s => s.trim()).length} سؤال`
                  : `${questionState.questionItems.length} عنصر`}
              </span>
            </div>

            {/* Content based on mode */}
            <div className="flex-1 flex flex-col gap-6">
              {questionState.mode === 'text' && (
                <div className="flex-1 flex flex-col gap-6">
                  <div className="bg-gray-50/50 p-6 rounded-[2rem] border-2 border-dashed border-gray-200 focus-within:border-primary/50 transition-colors">
                    <textarea
                      value={questionState.questions}
                      onChange={(e) => setQuestionState({ questions: e.target.value })}
                      placeholder="اكتب الأسئلة هنا (كل سؤال في سطر مستقل)..."
                      className="w-full bg-transparent text-lg font-medium outline-none resize-none min-h-[120px] placeholder:text-muted-foreground/50"
                      data-tour="setup-questions"
                    />
                  </div>

                  {questionState.questions.split('\n').filter(s => s.trim()).length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-2">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">الأسئلة الحالية ({questionState.questions.split('\n').filter(s => s.trim()).length})</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                          {questionState.questions.split('\n').filter(s => s.trim()).map((q, idx) => (
                            <motion.div
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              key={`${q}-${idx}`}
                              className="group flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all"
                            >
                              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-xs text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors shrink-0">
                                {idx + 1}
                              </div>
                              <p className="flex-1 text-sm font-semibold text-gray-700 truncate">{q}</p>
                              <button
                                onClick={() => {
                                  const lines = questionState.questions.split('\n')
                                  const filtered = lines.filter((line, i) => {
                                    let nonEmptyIdx = -1
                                    for (let j = 0; j <= i; j++) {
                                      if (lines[j].trim()) nonEmptyIdx++
                                    }
                                    return nonEmptyIdx !== idx || !line.trim()
                                  })
                                  setQuestionState({ questions: filtered.join('\n') })
                                }}
                                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                title="حذف السؤال"
                              >
                                <Trash2 size={14} />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {questionState.mode === 'hybrid' && (
                <div className="flex-1 flex flex-col gap-6">
                  {/* Premium Inline Form */}
                  <div className={`bg-gray-50/50 rounded-[2.5rem] border-2 transition-all p-2 ${isAddingQuestion || editingQuestionId ? 'border-primary/30 ring-4 ring-primary/5' : 'border-gray-100'}`}>
                    {(!isAddingQuestion && !editingQuestionId) ? (
                      <button
                        onClick={() => setIsAddingQuestion(true)}
                        className="w-full py-6 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/20 group-hover:shadow-md transition-all">
                          <Plus size={24} className="text-primary" />
                        </div>
                        <span className="font-bold">إضافة سؤال جديد (نص أو صورة)</span>
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-700">{editingQuestionId ? 'تعديل السؤال' : 'إضافة سؤال جديد'}</h4>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <textarea
                              autoFocus
                              value={newQuestionText}
                              onChange={(e) => setNewQuestionText(e.target.value)}
                              placeholder="اكتب نص السؤال هنا..."
                              className="w-full bg-white p-4 rounded-2xl border border-gray-100 outline-none focus:border-primary/50 focus:shadow-sm resize-none h-24 font-medium"
                            />
                          </div>
                          <div className="w-24 h-24 shrink-0 relative">
                            {newQuestionImage ? (
                              <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                                <img src={newQuestionImage} className="w-full h-full object-cover" alt="Question preview" />
                                <button
                                  onClick={() => setNewQuestionImage(null)}
                                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center border-2 border-white shadow-md hover:scale-110 transition-transform"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <div className="w-full h-full rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/30 hover:bg-white transition-all cursor-pointer relative group">
                                <ImageIcon size={20} className="mb-1 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-bold">صورة</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) setNewQuestionImage(URL.createObjectURL(file))
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => {
                              setIsAddingQuestion(false)
                              setEditingQuestionId(null)
                              setNewQuestionText("")
                              setNewQuestionImage(null)
                            }}
                            className="px-6 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-gray-100 transition-colors"
                          >
                            إلغاء
                          </button>
                          <button
                            disabled={!newQuestionText && !newQuestionImage}
                            onClick={() => {
                              if (editingQuestionId) {
                                setQuestionState({
                                  questionItems: questionState.questionItems.map(item =>
                                    item.id === editingQuestionId
                                      ? { ...item, text: newQuestionText, image: newQuestionImage || undefined }
                                      : item
                                  )
                                })
                                setEditingQuestionId(null)
                              } else {
                                setQuestionState({
                                  questionItems: [
                                    ...questionState.questionItems,
                                    { id: Math.random().toString(36).substr(2, 9), text: newQuestionText, image: newQuestionImage || undefined }
                                  ]
                                })
                                setIsAddingQuestion(false)
                              }
                              setNewQuestionText("")
                              setNewQuestionImage(null)
                            }}
                            className="px-8 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2"
                          >
                            <Plus size={18} /> {editingQuestionId ? 'تحديث السؤال' : 'حفظ السؤال'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Enhanced Hybrid List */}
                  <div className="space-y-3 pr-2 overflow-auto max-h-[400px] custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                      {questionState.questionItems.length === 0 && !isAddingQuestion && (
                        <div className="py-12 text-center text-muted-foreground opacity-50 space-y-2">
                          <LayoutGrid size={40} className="mx-auto opacity-20" />
                          <p className="font-medium">لا توجد أسئلة مضافة حالياً</p>
                        </div>
                      )}
                      {[...questionState.questionItems].reverse().map((item, displayIdx) => {
                        const imageSlides = questionState.questionItems.filter(i => i.image);
                        const lightboxImageIndex = imageSlides.findIndex(i => i.id === item.id);

                        return (
                          <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={item.id}
                            className="group flex items-start gap-4 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/10 transition-all"
                          >
                            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center font-bold text-xs text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors shrink-0 mt-1">
                              {questionState.questionItems.length - displayIdx}
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col gap-3">
                              {item.text && (
                                <p className="text-base font-bold text-gray-800 leading-relaxed pr-2">{item.text}</p>
                              )}
                              {item.image && (
                                <div className="relative w-32 h-24 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center group/img">
                                  <img src={item.image} className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => setLightboxIndex(lightboxImageIndex)} alt="Preview" />
                                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                    <ImageIcon size={20} className="text-white drop-shadow-md" />
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-4 mt-1">
                                {!item.text && (
                                  <button
                                    onClick={() => {
                                      const t = prompt("أضف نصاً لهذا السؤال:", "")
                                      if (t) setQuestionState({ questionItems: questionState.questionItems.map(i => i.id === item.id ? { ...i, text: t } : i) })
                                    }}
                                    className="text-[10px] font-bold text-primary px-3 py-1 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors flex items-center gap-1"
                                  >
                                    <Type size={10} /> إضافة نص
                                  </button>
                                )}
                                {!item.image && (
                                  <div className="relative overflow-hidden">
                                    <button className="text-[10px] font-bold text-primary px-3 py-1 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors flex items-center gap-1">
                                      <ImageIcon size={10} /> إضافة صورة
                                    </button>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) setQuestionState({ questionItems: questionState.questionItems.map(i => i.id === item.id ? { ...i, image: URL.createObjectURL(file) } : i) })
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingQuestionId(item.id)
                                  setNewQuestionText(item.text || "")
                                  setNewQuestionImage(item.image || null)
                                  setIsAddingQuestion(false)
                                  window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                                className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm"
                                title="تعديل السؤال"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => setQuestionState({ questionItems: questionState.questionItems.filter(i => i.id !== item.id) })}
                                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                title="حذف السؤال"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            {/* Excluded Questions logic based on mode */}
            {questionState.mode === 'text' ? (
              questionState.excludedQuestions.length > 0 && (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                  <h4 className="text-sm font-bold text-red-600 mb-2">الأسئلة المستبعدة ({questionState.excludedQuestions.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {questionState.excludedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setQuestionState({ excludedQuestions: questionState.excludedQuestions.filter(item => item !== q) })}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-colors"
                      >
                        {q.substring(0, 30)}{q.length > 30 ? '...' : ''} <Trash2 size={10} className="rotate-45" />
                      </button>
                    ))}
                  </div>
                </div>
              )
            ) : (
              questionState.excludedQuestionItems.length > 0 && (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                  <h4 className="text-sm font-bold text-red-600 mb-2">العناصر المستبعدة ({questionState.excludedQuestionItems.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {questionState.excludedQuestionItems.map((id) => {
                      const item = questionState.questionItems.find(i => i.id === id)
                      if (!item) return null
                      return (
                        <button
                          key={id}
                          onClick={() => setQuestionState({ excludedQuestionItems: questionState.excludedQuestionItems.filter(x => x !== id) })}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-colors capitalize"
                        >
                          {item.text ? item.text.substring(0, 20) : (item.image ? "صورة" : "سؤال")} <Trash2 size={10} className="rotate-45" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            )}

            {isTourActive && questionState.questions.length === 0 && questionState.questionItems.length === 0 && (
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <p className="text-sm text-red-600">💡 هنا ستظهر العناصر المستبعدة. اضغط لإعادتها للقائمة.</p>
              </div>
            )}

            <Lightbox
              open={lightboxIndex >= 0}
              index={lightboxIndex}
              close={() => setLightboxIndex(-1)}
              slides={questionState.questionItems.filter(i => i.image).map(i => ({ src: i.image! }))}
            />
          </div>
        )}


        {activeTab === 'rewards' && (
          <div className="flex-1 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">قائمة المكافآت</h3>
              <span className="text-sm text-muted-foreground">{rewardState.rewardsText.split('\n').filter(s => s.trim()).length} مكافأة</span>
            </div>
            <textarea
              value={rewardState.rewardsText}
              onChange={(e) => setRewardState({ rewardsText: e.target.value })}
              placeholder="اكتب المكافآت هنا (كل مكافأة في سطر مستقل)..."
              className="flex-1 w-full p-4 rounded-2xl border-2 border-border focus:border-primary outline-none resize-none min-h-[300px]"
              data-tour="setup-rewards"
            />
          </div>
        )}

        {activeTab === 'timer' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex gap-4 sm:gap-6 justify-center items-center bg-gray-50 p-8 rounded-[2rem] border border-border" data-tour="setup-timer">
              <div className="text-center">
                <label className="block text-sm font-bold mb-2">دقائق</label>
                <input
                  type="number"
                  value={timerState.minutes}
                  onChange={(e) => handleTimeChange('m', parseInt(e.target.value) || 0)}
                  className="w-24 h-24 text-4xl text-center rounded-2xl border-2 border-border focus:border-primary outline-none bg-white"
                />
              </div>
              <div className="text-3xl font-bold mt-6">:</div>
              <div className="text-center">
                <label className="block text-sm font-bold mb-2">ثواني</label>
                <input
                  type="number"
                  value={timerState.seconds}
                  onChange={(e) => handleTimeChange('s', parseInt(e.target.value) || 0)}
                  className="w-24 h-24 text-4xl text-center rounded-2xl border-2 border-border focus:border-primary outline-none bg-white"
                />
              </div>
            </div>

            <div className="w-full max-w-md space-y-4">
              <div className="bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                <label className="block text-sm font-bold mb-3 text-center text-muted-foreground">صوت الخلفية (يعمل أثناء العد)</label>
                <div className="flex flex-col gap-3 items-center">
                  <input
                    type="file"
                    id="background-sound"
                    accept="audio/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        // Revoke old URL if it exists
                        if (timerState.backgroundSoundUrl) {
                          URL.revokeObjectURL(timerState.backgroundSoundUrl)
                        }
                        const url = URL.createObjectURL(file)
                        setTimerState({ backgroundSoundUrl: url })
                      }
                    }}
                    className="w-full text-sm text-center bg-white file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer shadow-sm"
                  />
                  {timerState.backgroundSoundUrl && (
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-border shadow-sm">
                      <span className="text-xs font-semibold text-primary">تم اختيار الملف بنجاح</span>
                      <button
                        onClick={() => {
                          if (timerState.backgroundSoundUrl) {
                            URL.revokeObjectURL(timerState.backgroundSoundUrl)
                          }
                          setTimerState({ backgroundSoundUrl: undefined })
                        }}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="إزالة الملف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-center text-muted-foreground opacity-70">
                    يمكنك رفع ملف صوتي أو فيديو، سيتم تشغيل الصوت تلقائياً عند بدء المؤقت.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button
          onClick={onStart}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 active:scale-95 duration-200"
          data-tour="setup-start-btn"
        >
          ابدأ الجولة <ArrowLeft className="rtl:rotate-180" size={24} />
        </button>
      </div>
    </div>
  )
}
