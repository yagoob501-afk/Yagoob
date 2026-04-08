import * as React from "react"
import {
  Plus,
  Trash2,
  Sparkles,
  Play,
  Grid, // Replacement for LayoutGrid
  AlertCircle,
  Home,
  CheckCircle2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Question } from "@/lib/MemoryGameLogic"
import { MemoryAIModal } from "./MemoryAIModal"
import { Link } from "react-router-dom"
import "./MemoryStyles.css"

interface MemorySetupViewProps {
  questions: Question[]
  onUpdateQuestions: (questions: Question[]) => void
  matrix: { rows: number; cols: number }
  onUpdateMatrix: (rows: number, cols: number) => void
  onStartGame: (greenName: string, blueName: string) => void
  onClearData: () => void
  questionTime: number
  onUpdateQuestionTime: (time: number) => void
}

const MATRIX_OPTIONS = [
  { rows: 3, cols: 4, label: "3 × 4 (6 أسئلة)" },
  { rows: 4, cols: 4, label: "4 × 4 (8 أسئلة)" },
  { rows: 4, cols: 5, label: "4 × 5 (10 أسئلة)" },
  { rows: 5, cols: 6, label: "5 × 6 (15 أسئلة)" },
  { rows: 6, cols: 6, label: "6 × 6 (18 أسئلة)" },
  { rows: 5, cols: 8, label: "5 × 8 (20 سؤالاً)" },
];

export function MemorySetupView({
  questions,
  onUpdateQuestions,
  matrix,
  onUpdateMatrix,
  onStartGame,
  onClearData,
  questionTime,
  onUpdateQuestionTime
}: MemorySetupViewProps) {
  const [isAIModalOpen, setIsAIModalOpen] = React.useState(false)
  const [greenName, setGreenName] = React.useState("فريق الزمرد")
  const [blueName, setBlueName] = React.useState("فريق السماء")

  const requiredQuestions = Math.floor((matrix.rows * matrix.cols) / 2)
  const isReady = questions.length >= requiredQuestions

  const handleAddQuestion = () => {
    if (questions.length >= requiredQuestions) return;
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      pairA: "",
      pairB: "",
      text: "",
      choices: ["", "", "", ""],
      correctAnswerIndex: 0,
    }
    onUpdateQuestions([...questions, newQuestion])
  }

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    onUpdateQuestions(
      questions.map(q => q.id === id ? { ...q, ...updates } : q)
    )
  }

  const handleRemoveQuestion = (id: string) => {
    onUpdateQuestions(questions.filter(q => q.id !== id))
  }

  const handleAIImport = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString)
      if (Array.isArray(parsed)) {
        // Only take the number needed
        onUpdateQuestions(parsed.slice(0, requiredQuestions))
        setIsAIModalOpen(false)
      }
    } catch (err) {
      alert("Format JSON غير صالح. يرجى التأكد من لصق الكود بشكل صحيح.")
    }
  }

  return (
    <div className="w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-on-surface-prism">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface-container-high text-on-surface-prism font-bold border border-outline-variant-prism/10 hover:bg-surface-bright transition-all shadow-sm"
        >
          <Home size={18} /> العودة للرئيسية
        </Link>
        <button
          onClick={() => {
            if (confirm("هل أنت متأكد من مسح جميع الأسئلة والبيانات؟")) {
              onClearData()
            }
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-error-container/10 text-error font-bold border border-error-container/20 hover:bg-error-container/20 transition-all shadow-sm"
        >
          <Trash2 size={18} /> مسح البيانات
        </button>
      </div>

      {/* Header Container */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 glass-panel p-8 rounded-xl shadow-xl border border-outline-variant-prism/10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-primary-prism/10 flex items-center justify-center text-primary-prism shadow-inner">
            <Grid size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-on-surface-prism">لعبة Memory Strong</h1>
            <p className="text-on-surface-variant-prism mt-1 text-lg font-medium opacity-80">أداة ذاكرة تفاعلية بنظام المراجعة</p>
          </div>
        </div>

        <button
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-linear-to-br from-primary-prism to-primary-container text-on-primary font-black shadow-lg shadow-primary-prism/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles size={18} />
          توليد الأسئلة بـ AI
        </button>
      </div>

      {/* Grid Settings & Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Matrix Selection */}
        <div className="glass-panel p-8 rounded-xl shadow-xl border border-outline-variant-prism/10 space-y-4">
          <h3 className="font-headline font-black text-xl text-primary-fixed">إعدادات اللوحة</h3>
          <div className="grid grid-cols-2 gap-3">
            {MATRIX_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => onUpdateMatrix(opt.rows, opt.cols)}
                className={cn(
                  "px-4 py-3 rounded-xl border-2 transition-all font-bold",
                  matrix.rows === opt.rows && matrix.cols === opt.cols
                    ? "bg-primary-prism/10 border-primary-prism text-primary-prism"
                    : "bg-surface-container-low border-outline-variant-prism/10 text-on-surface-variant-prism hover:border-primary-prism/30"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="pt-2 flex items-center justify-between bg-surface-container-highest/30 p-4 rounded-xl">
            <span className="text-on-surface-variant-prism font-bold">الأسئلة المطلوبة (للقراءة فقط):</span>
            <span className={cn(
              "text-2xl font-headline font-black px-4 py-1 rounded-lg",
              isReady ? "text-primary-prism bg-primary-prism/10" : "text-error bg-error-container/10"
            )}>
              {questions.length} / {requiredQuestions}
            </span>
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-headline font-black text-primary-fixed">وقت السؤال (ثانية)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={questionTime}
                  onChange={(e) => onUpdateQuestionTime(Number(e.target.value))}
                  className="w-20 text-center text-2xl font-black text-primary-prism bg-surface-container-high border-2 border-outline-variant-prism/10 rounded-xl py-1 focus:border-primary-prism outline-none transition-all"
                />
                <span className="text-xs font-bold text-on-surface-variant-prism opacity-60">ثانية</span>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={questionTime}
              onChange={(e) => onUpdateQuestionTime(Number(e.target.value))}
              className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary-prism"
            />
            <div className="relative h-4 mt-2">
              <span className="absolute right-0 text-[10px] font-black text-on-surface-variant-prism/40">5 ثوانٍ</span>
              <span
                className="absolute text-[10px] font-black text-on-surface-variant-prism/60 translate-x-1/2"
                style={{ right: `${((30 - 5) / (60 - 5)) * 100}%` }}
              >
                30 ثانية
              </span>
              <span className="absolute left-0 text-[10px] font-black text-on-surface-variant-prism/40">60 ثانية</span>
            </div>
          </div>
        </div>

        {/* Team Config */}
        <div className="glass-panel p-8 rounded-xl shadow-xl border border-outline-variant-prism/10 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-primary-prism px-2">اسم الفريق الأول</label>
            <input
              value={greenName}
              onChange={(e) => setGreenName(e.target.value)}
              className="w-full px-6 py-3 rounded-xl bg-surface-container-low border border-outline-variant-prism/20 text-lg font-bold text-on-surface-prism outline-none focus:border-primary-prism/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-secondary-prism px-2">اسم الفريق الثاني</label>
            <input
              value={blueName}
              onChange={(e) => setBlueName(e.target.value)}
              className="w-full px-6 py-3 rounded-xl bg-surface-container-low border border-outline-variant-prism/20 text-lg font-bold text-on-surface-prism outline-none focus:border-secondary-prism/50 transition-all"
            />
          </div>

          <button
            disabled={!isReady}
            onClick={() => onStartGame(greenName, blueName)}
            className="w-full py-5 rounded-full bg-linear-to-br from-primary-prism to-primary-container text-on-primary font-black text-xl shadow-xl shadow-primary-prism/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:grayscale flex items-center justify-center gap-3"
          >
            <Play size={24} fill="currentColor" />
            بدء التحدي
          </button>
          {!isReady && (
            <p className="text-center text-xs text-error font-bold flex items-center justify-center gap-1">
              <AlertCircle size={14} /> أضف {requiredQuestions} أسئلة للبدء
            </p>
          )}
        </div>
      </div>

      {/* Question List */}
      <h3 className="font-headline font-black text-2xl px-2 flex items-center gap-2">
        <CheckCircle2 size={24} className={isReady ? "text-primary-prism" : "text-on-surface-variant-prism"} />
        قائمة الأسئلة
      </h3>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {questions.map((q, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={q.id}
              className="glass-panel p-6 rounded-xl shadow-md border border-outline-variant-prism/10 group hover:border-primary-prism/30 transition-all"
            >
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center font-black text-on-surface-variant-prism group-hover:bg-primary-prism/10 group-hover:text-primary-prism transition-colors shrink-0">
                  {idx + 1}
                </div>

                <div className="flex-1 space-y-6">
                  {/* Pair Configuration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-surface-container-highest/20 rounded-2xl border border-outline-variant-prism/10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-primary-prism uppercase px-2">نص البطاقة 1 (المطابقة)</label>
                       <input
                         value={q.pairA}
                         onChange={(e) => handleUpdateQuestion(q.id, { pairA: e.target.value })}
                         placeholder="مثال: H2O"
                         className="w-full px-4 py-2 bg-surface-container-low rounded-xl border border-transparent focus:border-primary-prism/30 outline-none font-bold text-on-surface-prism shadow-inner"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-secondary-prism uppercase px-2">نص البطاقة 2 (المطابقة)</label>
                       <input
                         value={q.pairB}
                         onChange={(e) => handleUpdateQuestion(q.id, { pairB: e.target.value })}
                         placeholder="مثال: أوكسجين"
                         className="w-full px-4 py-2 bg-surface-container-low rounded-xl border border-transparent focus:border-secondary-prism/30 outline-none font-bold text-on-surface-prism shadow-inner"
                       />
                    </div>
                  </div>

                  {/* Modal Question Configuration */}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-on-surface-variant-prism/60 px-2 italic">سؤال التحقق (المودال)</label>
                      <input
                        value={q.text}
                        onChange={(e) => handleUpdateQuestion(q.id, { text: e.target.value })}
                        placeholder="اكتب سؤال التحدي هنا للمودال..."
                        className="w-full text-lg font-bold bg-transparent border-b-2 border-outline-variant-prism/20 focus:border-primary-prism outline-none py-2 transition-all"
                      />
                    </div>
  
                    <div className="grid grid-cols-2 gap-3">
                      {q.choices.map((choice, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuestion(q.id, { correctAnswerIndex: cIdx })}
                            className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                              q.correctAnswerIndex === cIdx ? "bg-primary-prism border-primary-prism text-on-primary" : "border-outline-variant-prism/30"
                            )}
                          >
                            {q.correctAnswerIndex === cIdx && <div className="w-2 h-2 rounded-full bg-white" />}
                          </button>
                          <input
                            value={choice}
                            onChange={(e) => {
                              const newChoices = [...q.choices]
                              newChoices[cIdx] = e.target.value
                              handleUpdateQuestion(q.id, { choices: newChoices })
                            }}
                            placeholder={`خيار ${cIdx + 1}`}
                            className="flex-1 bg-surface-container-low px-3 py-1.5 rounded-lg text-sm border border-transparent focus:border-primary-prism/30 outline-none font-medium"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveQuestion(q.id)}
                  className="p-3 text-error hover:bg-error-container/10 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {questions.length < requiredQuestions && (
          <button
            onClick={handleAddQuestion}
            className="w-full py-8 rounded-xl border-4 border-dashed border-outline-variant-prism/10 text-on-surface-variant-prism hover:border-primary-prism/30 hover:text-primary-prism hover:bg-primary-prism/5 transition-all font-bold flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-surface-container-high shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            إضافة سؤال جديد
          </button>
        )}
      </div>

      <MemoryAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onImport={handleAIImport}
        count={requiredQuestions}
      />
    </div>
  )
}
