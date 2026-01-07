"use client"

import { useState, useRef, useEffect } from "react"
import { Dices, RotateCcw, HelpCircle, X } from "lucide-react"

export interface QuestionToolState {
  questions: string
  currentQuestion: string | null
  excludedQuestions: string[]
  isAnimating: boolean
}

export default function QuestionTool({ state, setState }: { state: QuestionToolState, setState: (u: Partial<QuestionToolState>) => void }) {
  const { questions, currentQuestion, excludedQuestions, isAnimating } = state
  const [viewMode, setViewMode] = useState<'input' | 'list'>('input')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current && viewMode === 'input') {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.max(200, textareaRef.current.scrollHeight)}px`
    }
  }, [questions, viewMode])

  const list = questions.split("\n").map(q => q.trim()).filter(q => q !== "")
  const available = list.filter(q => !excludedQuestions.includes(q))

  const pick = () => {
    if (available.length === 0) return
    setState({ isAnimating: true })
    let c = 0
    const int = setInterval(() => {
      setState({ currentQuestion: available[Math.floor(Math.random() * available.length)] })
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
                {list.length} سؤال • {available.length} متاح • {excludedQuestions.length} مستبعد
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
                <textarea
                  ref={textareaRef}
                  className="w-full text-base sm:text-lg bg-transparent border-none outline-none resize-none min-h-[200px]"
                  placeholder="اكتب الأسئلة هنا، سؤال في كل سطر..."
                  value={questions}
                  onChange={e => setState({ questions: e.target.value })}
                />
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {list.map((q, i) => (
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
                  ))}
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
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border-2 border-border text-primary w-full text-center leading-relaxed min-h-[250px] flex items-center justify-center">
            {isAnimating ? "..." : currentQuestion}
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
                onClick={() => setState({ excludedQuestions: [...excludedQuestions, currentQuestion || ''] })}
                disabled={excludedQuestions.includes(currentQuestion || '')}
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
    </div>
  )
}
