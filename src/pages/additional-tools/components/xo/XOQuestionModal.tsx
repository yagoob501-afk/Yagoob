"use client"

import * as React from "react"
import { Clock, HelpCircle, Check, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Question } from "@/lib/XOGameLogic"
import { cn } from "@/lib/utils"

interface XOQuestionModalProps {
  question: Question
  onAnswer: (isCorrect: boolean) => void
  team: 'green' | 'blue'
  result: 'correct' | 'wrong' | null
}

export function XOQuestionModal({ question, onAnswer, team, result }: XOQuestionModalProps) {
  const [timeLeft, setTimeLeft] = React.useState(question.timeLimit || 0)
  const timerActive = (question.timeLimit || 0) > 0

  React.useEffect(() => {
    if (!timerActive || timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timerActive, timeLeft])

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl border-8 border-gray-50 overflow-hidden flex flex-col relative"
      >
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ scale: 0, rotate: 0, opacity: 0 }}
              animate={{ scale: 1.2, rotate: 360, opacity: 1 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm pointer-events-none"
            >
              <div className="bg-white p-12 rounded-full shadow-2xl border-4 border-gray-100 flex items-center justify-center">
                {result === 'correct' ? (
                  <Check size={120} className="text-green-500 stroke-[5px]" />
                ) : (
                  <X size={120} className="text-red-500 stroke-[5px]" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className={cn(
          "p-8 text-center space-y-4",
          team === 'green' ? "bg-green-50" : "bg-blue-50"
        )}>
          <div className="flex justify-between items-center">
            <div className={cn(
              "px-6 py-2 rounded-2xl font-bold flex items-center gap-2",
              team === 'green' ? "bg-green-600 text-white" : "bg-blue-600 text-white"
            )}>
              {team === 'green' ? "الفريق الأخضر" : "الفريق الأزرق"}
            </div>

            {timerActive && (
              <div className={cn(
                "flex items-center gap-3 px-6 py-2 rounded-2xl font-mono text-2xl font-bold",
                timeLeft <= 5 ? "bg-red-500 text-white animate-pulse" : "bg-white text-gray-800 shadow-sm"
              )}>
                <Clock size={24} />
                {timeLeft}s
              </div>
            )}
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-gray-800 leading-tight">
            {question.text}
          </h2>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.choices.map((choice, idx) => (
            <button
              key={idx}
              disabled={!!result}
              onClick={() => onAnswer(idx === question.correctAnswerIndex)}
              className={cn(
                "group relative p-6 text-xl font-bold rounded-4xl border-2 border-gray-100 bg-gray-50 transition-all text-right flex items-center justify-between",
                !result && "hover:bg-white hover:border-primary hover:text-primary hover:shadow-xl",
                result && idx === question.correctAnswerIndex && "bg-green-50 border-green-500 text-green-700",
                result === 'wrong' && idx !== question.correctAnswerIndex && "opacity-50"
              )}
            >
              <span className="flex-1">{choice}</span>
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {String.fromCharCode(65 + idx)}
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 bg-gray-50 flex justify-center border-t border-gray-100">
          <p className="text-xs text-muted-foreground font-bold flex items-center gap-2">
            <HelpCircle size={14} /> اختر الإجابة الصحيحة للمواصلة
          </p>
        </div>
      </motion.div>
    </div>
  )
}
