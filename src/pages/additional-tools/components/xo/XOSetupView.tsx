"use client"

import * as React from "react"
import {
  Plus,
  Trash2,
  Sparkles,
  Play,
  LayoutGrid,
  AlertCircle,
  Home,
  Timer
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { XOAIModal } from "./XOAIModal"
import type { Question } from "@/lib/XOGameLogic"
import { Link } from "react-router-dom"

interface XOSetupViewProps {
  questions: Question[]
  onUpdateQuestions: (questions: Question[]) => void
  onStartGame: (timerSeconds: number, greenName: string, blueName: string) => void
  onClearData: () => void
}

export function XOSetupView({
  questions,
  onUpdateQuestions,
  onStartGame,
  onClearData
}: XOSetupViewProps) {
  const [isAIModalOpen, setIsAIModalOpen] = React.useState(false)
  const [questionTimer, setQuestionTimer] = React.useState(60)
  const [greenName, setGreenName] = React.useState("فريق الابطال")
  const [blueName, setBlueName] = React.useState("فريق المميزين")

  const totalTimerSeconds = 0 // (timerMinutes * 60) + timerSeconds
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
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

  // maybe a dead code
  /*
  const handleExportTOON = () => {
    const data = gameRef.current.toJSON()
    try {
      const toonString = TOON.encode(data)
      const blob = new Blob([toonString], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `xo_game_${new Date().toISOString().split('T')[0]}.toon`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export failed", err)
      alert("فشل تصدير الملف.")
    }
  }
  */

  const handleRemoveQuestion = (id: string) => {
    onUpdateQuestions(questions.filter(q => q.id !== id))
  }

  const handleAIImport = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString)
      if (Array.isArray(parsed)) {
        onUpdateQuestions(parsed)
        setIsAIModalOpen(false)
      }
    } catch (err) {
      alert("Format JSON غير صالح. يرجى التأكد من لصق الكود بشكل صحيح.")
    }
  }
  return (
    <div className="w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-gray-700 font-bold border-2 border-border hover:bg-gray-50 transition-all shadow-sm"
        >
          <Home size={18} /> العودة للرئيسية
        </Link>
        <button
          onClick={() => {
            if (confirm("هل أنت متأكد من مسح جميع الأسئلة والبيانات؟")) {
              onClearData()
            }
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-50 text-red-600 font-bold border-2 border-red-100 hover:bg-red-100 transition-all shadow-sm"
        >
          <Trash2 size={18} /> مسح البيانات
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-4xl shadow-xl border border-border">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <LayoutGrid size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">لعبة XO التعليمية</h1>
            <p className="text-muted-foreground mt-1 text-lg">أداة تفاعلية للمراجعة والتقييم داخل الفصل</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* maybe a dead code
          <button
            onClick={onExportTOON}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-50 text-gray-700 font-bold border-2 border-border hover:bg-white hover:border-primary/50 transition-all shadow-sm"
          >
            <FileDown size={18} />
            تصدير ملف TOON
          </button>

          <button
            onClick={onImportTOON}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-50 text-gray-700 font-bold border-2 border-border hover:bg-white hover:border-primary/50 transition-all shadow-sm"
          >
            <FileUp size={18} />
            استيراد ملف TOON
          </button>
          */}

          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-primary/10 text-primary font-bold border-2 border-primary/20 hover:bg-primary/20 transition-all shadow-sm"
          >
            <Sparkles size={18} />
            توليد AI
          </button>
        </div>
      </div>

      {/* Team Names Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-4xl shadow-xl border border-border">
        <div className="space-y-3">
          <label className="text-sm font-bold text-emerald-600 px-2">اسم الفريق (X)</label>
          <input
            value={greenName}
            onChange={(e) => setGreenName(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-emerald-50 border-2 border-emerald-100 text-xl font-bold text-emerald-700 outline-none focus:border-emerald-300 transition-all"
            placeholder="اسم فريق X..."
          />
        </div>
        <div className="space-y-3">
          <label className="text-sm font-bold text-sky-600 px-2">اسم الفريق (O)</label>
          <input
            value={blueName}
            onChange={(e) => setBlueName(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-sky-50 border-2 border-sky-100 text-xl font-bold text-sky-700 outline-none focus:border-sky-300 transition-all"
            placeholder="اسم فريق O..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar / Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-4xl shadow-lg border border-border space-y-6">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <AlertCircle size={18} className="text-primary" />
              إعدادات الجولة
            </h3>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-600">وقت السؤال (بالثواني)</label>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 focus-within:border-primary/30 transition-all">
                <Timer className="w-5 h-5 text-primary" />
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={questionTimer}
                  onChange={(e) => setQuestionTimer(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent font-bold text-xl outline-none"
                />
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">
                * وقت التفكير المتاح لكل جولة بعد اختيار المربع.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-50">
              <div className="flex justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-muted-foreground">عدد الأسئلة</span>
                <span className="font-bold text-primary">{questions.length}</span>
              </div>
            </div>
          </div>

          <button
            disabled={questions.length < 9}
            onClick={() => onStartGame(questionTimer, greenName, blueName)}
            className="w-full py-6 rounded-4xl bg-green-600 text-white font-bold text-xl shadow-xl shadow-green-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
          >
            <Play size={24} />
            بدء اللعبة
          </button>
          {questions.length < 9 && (
            <p className="text-center text-xs text-destructive font-bold">أضف 9 أسئلة على الأقل للبدء</p>
          )}
        </div>

        {/* Question List */}
        <div className="lg:col-span-3 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {questions.map((q, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={q.id}
                className="bg-white p-6 rounded-4xl shadow-md border border-border group hover:border-primary/30 transition-all"
              >
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center font-bold text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    {idx + 1}
                  </div>

                  <div className="flex-1 space-y-4">
                    <input
                      value={q.text}
                      onChange={(e) => handleUpdateQuestion(q.id, { text: e.target.value })}
                      placeholder="اكتب نص السؤال هنا..."
                      className="w-full text-xl font-bold bg-transparent border-b-2 border-gray-100 focus:border-primary outline-none py-2 transition-all"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.choices.map((choice, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-3">
                          <button
                            onClick={() => handleUpdateQuestion(q.id, { correctAnswerIndex: cIdx })}
                            className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                              q.correctAnswerIndex === cIdx ? "bg-green-500 border-green-500 text-white" : "border-gray-200"
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
                            className="flex-1 bg-gray-50 px-4 py-2 rounded-xl text-sm border border-transparent focus:border-primary/30 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="p-3 text-destructive hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={handleAddQuestion}
            className="w-full py-8 rounded-[2.5rem] border-4 border-dashed border-gray-100 text-gray-300 hover:border-primary/20 hover:text-primary hover:bg-primary/5 transition-all font-bold flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            إضافة سؤال
          </button>
        </div>
      </div>

      <XOAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onImport={handleAIImport}
      />
    </div>
  )
}
