"use client"

import { useState, useEffect, useRef } from "react"
import { Users, UserX, RotateCcw } from "lucide-react"
import confetti from "canvas-confetti"

export interface RandomStudentState {
  studentsText: string; currentStudent: string | null; excludedStudents: string[]; isAnimating: boolean
}

export default function RandomStudentTool({ state, setState }: { state: RandomStudentState, setState: (u: Partial<RandomStudentState>) => void }) {
  const { studentsText, currentStudent, excludedStudents, isAnimating } = state
  const [viewMode, setViewMode] = useState<'input' | 'list'>('input')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current && viewMode === 'input') {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.max(200, textareaRef.current.scrollHeight)}px`
    }
  }, [studentsText, viewMode])

  const list = studentsText.split("\n").map(s => s.trim()).filter(s => s !== "")
  const available = list.filter(s => !excludedStudents.includes(s))

  const pick = () => {
    if (available.length === 0) return
    setState({ isAnimating: true })
    let c = 0
    const int = setInterval(() => {
      setState({ currentStudent: available[Math.floor(Math.random() * available.length)] })
      if (++c > 20) {
        clearInterval(int)
        setState({ isAnimating: false })
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
      }
    }, 80)
  }

  return (
    <div className="flex flex-col items-center p-6 sm:p-8 md:p-12 min-h-[600px]">
      {!currentStudent ? (
        <div className="flex flex-col gap-6 w-full max-w-4xl">
          <div className="text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-bold">طالب عشوائي</h2>
          </div>
          <div className="bg-white rounded-3xl border-2 border-border shadow-inner overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-b border-border bg-bg-layout/50">
              <span className="font-bold text-muted-foreground text-sm sm:text-base">
                {list.length} طلاب • {available.length} متاح • {excludedStudents.length} مستبعد
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
                  placeholder="اكتب أسماء الطلاب هنا، اسم في كل سطر..."
                  value={studentsText}
                  onChange={e => setState({ studentsText: e.target.value })}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setState({
                          excludedStudents: excludedStudents.includes(s)
                            ? excludedStudents.filter(x => x !== s)
                            : [...excludedStudents, s]
                        })
                      }}
                      className={`p-3 rounded-xl border-2 transition-all font-medium text-sm sm:text-base ${excludedStudents.includes(s)
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'bg-white border-border hover:shadow-md'
                        }`}
                    >
                      <span className={excludedStudents.includes(s) ? 'line-through' : ''}>{s}</span>
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
            <Users size={24} /> اختيار طالب
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 py-10 w-full max-w-2xl">
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-white p-12 sm:p-16 rounded-full shadow-2xl border-4 border-white text-primary min-w-[250px] sm:min-w-[350px] text-center">
            {isAnimating ? "..." : currentStudent}
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
                onClick={() => setState({ excludedStudents: [...excludedStudents, currentStudent || ''] })}
                disabled={excludedStudents.includes(currentStudent || '')}
                className="btn-destructive px-6 sm:px-8 py-4 rounded-2xl bg-red-500 text-white disabled:opacity-50 text-base sm:text-lg"
              >
                <UserX size={22} /> استبعاد
              </button>
              <button
                onClick={() => setState({ currentStudent: null })}
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
