"use client"

import { useState, useRef, useEffect } from "react"
import { Dices, RotateCcw, HelpCircle, X, Image as ImageIcon, Type } from "lucide-react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

export type QuestionMode = 'text' | 'image' | 'hybrid'

export interface QuestionItem {
  id: string
  type: 'text' | 'image'
  content: string // text content or image data URL
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
        <div className="flex flex-col gap-6 w-full max-w-4xl">
          <div className="text-center">
            <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-bold">سؤال عشوائي</h2>
          </div>
          <div className="bg-white rounded-3xl border-2 border-border shadow-inner overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-b border-border bg-bg-layout/50">
              <span className="font-bold text-muted-foreground text-sm sm:text-base">
                {list.length} عنصر • {available.length} متاح • {mode === 'text' ? excludedQuestions.length : excludedQuestionItems.length} مستبعد
              </span>
              <div className="flex bg-bg-container rounded-xl p-1 border border-border">
                <button
                  onClick={() => setViewMode('input')}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${viewMode === 'input' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
                >
                  إدخال نصي
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
                >
                  القائمة
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[400px] overflow-auto">
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
                  {mode === 'text' ? (
                    (list as string[]).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setState({
                            excludedQuestions: excludedQuestions.includes(q)
                              ? excludedQuestions.filter(x => x !== q)
                              : [...excludedQuestions, q]
                          })
                        }}
                        className={`p-3 rounded-xl border-2 transition-all font-medium text-sm sm:text-base text-right ${excludedQuestions.includes(q)
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'bg-white border-border hover:shadow-md'
                          }`}
                      >
                        <span className={excludedQuestions.includes(q) ? 'line-through' : ''}>{q}</span>
                      </button>
                    ))
                  ) : (
                    (list as QuestionItem[]).map((item, i) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setState({
                            excludedQuestionItems: excludedQuestionItems.includes(item.id)
                              ? excludedQuestionItems.filter(x => x !== item.id)
                              : [...excludedQuestionItems, item.id]
                          })
                        }}
                        className={`p-3 rounded-xl border-2 transition-all font-medium text-sm sm:text-base text-right flex items-center gap-3 ${excludedQuestionItems.includes(item.id)
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'bg-white border-border hover:shadow-md'
                          }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          {item.type === 'image' ? <ImageIcon size={14} /> : <Type size={14} />}
                        </div>
                        <span className={`truncate flex-1 ${excludedQuestionItems.includes(item.id) ? 'line-through' : ''}`}>
                          {item.type === 'text' ? item.content : `صورة ${i + 1}`}
                        </span>
                      </button>
                    ))
                  )}
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
                  currentQuestion.type === 'text' ? (
                    currentQuestion.content
                  ) : (
                    <img
                      src={currentQuestion.content}
                      className="max-h-[250px] w-auto rounded-2xl cursor-pointer"
                      onClick={() => setLightboxOpen(true)}
                      alt="Question"
                    />
                  )
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
        slides={(currentQuestion && typeof currentQuestion !== 'string' && currentQuestion.type === 'image') ? [{ src: currentQuestion.content }] : []}
      />
    </div>
  )
}
