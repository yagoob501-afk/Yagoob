"use client"

import { useState, useEffect, useRef } from "react"
import { Dices, RotateCcw, Trash2, Maximize2, Minimize2, Edit2, HelpCircle } from "lucide-react"

export interface QuestionToolState {
  questions: string; currentQuestion: string | null; isAnimating: boolean
}

export default function QuestionTool({ state, setState }: { state: QuestionToolState, setState: (u: Partial<QuestionToolState>) => void }) {
  const { questions, currentQuestion, isAnimating } = state
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [scale, setScale] = useState(1)
  const [contentHeight, setContentHeight] = useState<number | string>('auto')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth; const ns = Math.min((w - 48) / 800, 1); setScale(ns)
      if (contentRef.current && !isFullscreen) setContentHeight(contentRef.current.scrollHeight * ns)
      else setContentHeight('auto')
    }
    update(); const t = setTimeout(update, 200)
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('resize', update); clearTimeout(t); }
  }, [isFullscreen, currentQuestion, questions])

  useEffect(() => { if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.style.height = `${Math.max(200, textareaRef.current.scrollHeight)}px` } }, [questions])

  const pick = () => {
    const list = questions.split("\n").filter(q => q.trim() !== "")
    if (list.length === 0) return; setState({ isAnimating: true })
    let c = 0; const int = setInterval(() => {
      setState({ currentQuestion: list[Math.floor(Math.random() * list.length)] })
      if (++c > 10) { clearInterval(int); setState({ isAnimating: false }) }
    }, 100)
  }

  return (
    <div id="question-tool-container" className={`flex flex-col items-center p-4 transition-all ${isFullscreen ? 'bg-bg-layout' : ''}`} style={{ height: isFullscreen ? '100vh' : contentHeight }}>
      <div ref={contentRef} style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: '800px' }} className="flex flex-col items-center">
        {!currentQuestion ? (
          <div className="flex flex-col gap-6 w-full max-w-2xl">
            <div className="text-center"><HelpCircle className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" /><h2 className="text-3xl font-bold">سؤال عشوائي</h2></div>
            <textarea ref={textareaRef} className="w-full p-6 text-lg rounded-[2rem] border-2 border-border focus:border-primary outline-none resize-none bg-white shadow-inner min-h-[200px]" placeholder="الأسئلة هنا..." value={questions} onChange={e => setState({ questions: e.target.value })} />
            <button onClick={pick} disabled={!questions.trim()} className="btn-primary w-full py-4 text-xl rounded-2xl shadow-lg flex items-center justify-center gap-2"><Dices size={24} /> اختيار سؤال</button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 py-10 w-full max-w-2xl">
            <div className="text-4xl font-bold bg-white p-12 rounded-[2.5rem] shadow-2xl border-2 border-border text-primary w-full text-center leading-relaxed min-h-[250px] flex items-center justify-center">{isAnimating ? "..." : currentQuestion}</div>
            {!isAnimating && <div className="flex gap-4">
              <button onClick={pick} className="btn-primary px-10 py-4 rounded-2xl flex items-center gap-2"><RotateCcw size={24} /> إعادة</button>
              <button onClick={() => setState({ currentQuestion: null })} className="btn-outline px-10 py-4 rounded-2xl border-border border-2">تعديل</button>
            </div>}
          </div>
        )}
      </div>
    </div>
  )
}
