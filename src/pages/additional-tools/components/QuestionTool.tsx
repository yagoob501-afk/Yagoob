"use client"

import { useState, useRef, useEffect } from "react"
import { Dices, RotateCcw, HelpCircle, X, Image as ImageIcon, Type, List, Edit3 } from "lucide-react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { motion, AnimatePresence } from "framer-motion"

export type QuestionMode = 'text' | 'image' | 'hybrid'

export interface QuestionItem {
  id: string
  text?: string
  image?: string
}

export interface QuestionToolState {
  questions: string // For backward compatibility with 'text' mode
  mode: QuestionMode
  questionItems: QuestionItem[]
  currentQuestion: QuestionItem | null
  excludedQuestions: string[] // For text mode (backward compat)
  excludedQuestionItems: string[] // IDs of excluded items
  isAnimating: boolean
}

export default function QuestionTool({ state, setState }: { state: QuestionToolState, setState: (u: Partial<QuestionToolState>) => void }) {
  const { mode, questions, questionItems, currentQuestion, excludedQuestions, excludedQuestionItems, isAnimating } = state
  const [viewMode, setViewMode] = useState<'input' | 'list'>('input')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current && viewMode === 'input' && mode === 'text') {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.max(200, textareaRef.current.scrollHeight)}px`
    }
  }, [questions, viewMode, mode])

  const list = mode === 'text'
    ? questions.split("\n").map(q => q.trim()).filter(q => q !== "")
    : questionItems

  const available = mode === 'text'
    ? (list as string[]).filter(q => !excludedQuestions.includes(q))
    : (list as QuestionItem[]).filter(q => !excludedQuestionItems.includes(q.id))

  const pick = () => {
    if (available.length === 0) return
    setState({ isAnimating: true })
    let c = 0
    const int = setInterval(() => {
      setState({ currentQuestion: available[Math.floor(Math.random() * available.length)] as any })
      if (++c > 10) {
        clearInterval(int)
        setState({ isAnimating: false })
      }
    }, 100)
  }

  return (
    <div className="flex flex-col items-center p-6 sm:p-8 md:p-12 min-h-[600px]">
      {!currentQuestion ? (
        <div className="flex flex-col gap-8 w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <HelpCircle className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">سؤال عشوائي</h2>
            <p className="text-muted-foreground font-medium">اختر سؤالاً بشكل عشوائي من القائمة</p>
          </motion.div>

          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-b border-gray-50 bg-gray-50/30">
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">إدارة الأسئلة</span>
                <span className="text-xs font-bold text-muted-foreground">
                  {available.length} متاح من أصل {list.length}
                </span>
              </div>
              <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
                <button
                  onClick={() => setViewMode('input')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'input' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-gray-50'}`}
                >
                  <Edit3 size={16} /> إدخال
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-gray-50'}`}
                >
                  <List size={16} /> القائمة
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[450px] overflow-auto custom-scrollbar">
              {viewMode === 'input' ? (
                mode === 'text' ? (
                  <textarea
                    ref={textareaRef}
                    className="w-full text-base sm:text-lg bg-transparent border-none outline-none resize-none min-h-[200px]"
                    placeholder="اكتب الأسئلة هنا، سؤال في كل سطر..."
                    value={questions}
                    onChange={e => setState({ questions: e.target.value })}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground gap-3">
                    <ImageIcon size={48} className="opacity-20" />
                    <p>يرجى إدارة الصور من شاشة الإعداد الرئيسية</p>
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <AnimatePresence mode="popLayout">
                    {mode === 'text' ? (
                      (list as string[]).map((q, i) => (
                        <motion.button
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          key={`${q}-${i}`}
                          onClick={() => {
                            setState({
                              excludedQuestions: excludedQuestions.includes(q)
                                ? excludedQuestions.filter(x => x !== q)
                                : [...excludedQuestions, q]
                            })
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all font-bold text-right flex items-center justify-between group ${excludedQuestions.includes(q)
                            ? 'bg-red-50 border-red-100 text-red-400'
                            : 'bg-white border-gray-50 hover:border-primary/20 hover:shadow-md'
                            }`}
                        >
                          <span className={excludedQuestions.includes(q) ? 'line-through opacity-50' : 'text-gray-700'}>{q}</span>
                          {excludedQuestions.includes(q) && <X size={16} className="text-red-400" />}
                        </motion.button>
                      ))
                    ) : (
                      (list as QuestionItem[]).reverse().map((item) => (
                        <motion.button
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          key={item.id}
                          onClick={() => {
                            setState({
                              excludedQuestionItems: excludedQuestionItems.includes(item.id)
                                ? excludedQuestionItems.filter(x => x !== item.id)
                                : [...excludedQuestionItems, item.id]
                            })
                          }}
                          className={`p-4 rounded-[2rem] border-2 transition-all font-bold text-right flex items-center gap-4 group ${excludedQuestionItems.includes(item.id)
                            ? 'bg-red-50 border-red-100 text-red-400'
                            : 'bg-white border-gray-50 hover:border-primary/20 hover:shadow-md hover:scale-[1.01]'
                            }`}
                        >
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${excludedQuestionItems.includes(item.id) ? 'bg-red-100 text-red-400' : 'bg-gray-50 text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary'}`}>
                            {item.image ? <ImageIcon size={18} /> : <Type size={18} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`truncate text-base ${excludedQuestionItems.includes(item.id) ? 'line-through opacity-50' : 'text-gray-700'}`}>
                              {item.text || (item.image ? `سؤال مصور` : "سؤال فارغ")}
                            </p>
                          </div>
                          {excludedQuestionItems.includes(item.id) && <X size={18} className="text-red-400" />}
                        </motion.button>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={pick}
            disabled={available.length === 0}
            className="btn-primary w-full py-4 text-lg sm:text-xl rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Dices size={24} /> اختيار سؤال
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 py-10 w-full max-w-3xl">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border-2 border-border text-primary w-full text-center leading-relaxed min-h-[300px] flex items-center justify-center overflow-hidden">
            {isAnimating ? "..." : (
              currentQuestion ? (
                typeof currentQuestion === 'string' ? (
                  currentQuestion
                ) : (
                  <>
                    {currentQuestion.text && (
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">{currentQuestion.text}</p>
                    )}
                    {currentQuestion.image && (
                      <img
                        src={currentQuestion.image}
                        className="max-h-[250px] w-auto rounded-2xl cursor-pointer mx-auto"
                        onClick={() => setLightboxOpen(true)}
                        alt="Question"
                      />
                    )}
                  </>
                )
              ) : null
            )}
          </div>
          {!isAnimating && (
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={pick}
                className="btn-primary px-8 sm:px-10 py-4 rounded-2xl flex items-center gap-2 text-base sm:text-lg"
              >
                <RotateCcw size={24} /> إعادة
              </button>
              <button
                onClick={() => {
                  if (currentQuestion) {
                    if (typeof currentQuestion === 'string') {
                      setState({ excludedQuestions: [...excludedQuestions, currentQuestion] })
                    } else {
                      setState({ excludedQuestionItems: [...excludedQuestionItems, currentQuestion.id] })
                    }
                  }
                }}
                disabled={currentQuestion ? (typeof currentQuestion === 'string' ? excludedQuestions.includes(currentQuestion) : excludedQuestionItems.includes(currentQuestion.id)) : true}
                className="btn-destructive px-6 sm:px-8 py-4 rounded-2xl bg-red-500 text-white disabled:opacity-50 text-base sm:text-lg"
              >
                <X size={22} /> استبعاد
              </button>
              <button
                onClick={() => setState({ currentQuestion: null })}
                className="btn-outline px-6 sm:px-8 py-4 rounded-2xl border-border border-2 text-base sm:text-lg"
              >
                تعديل
              </button>
            </div>
          )}
        </div>
      )}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={(currentQuestion && typeof currentQuestion !== 'string' && currentQuestion.image) ? [{ src: currentQuestion.image }] : []}
      />
    </div>
  )
}
