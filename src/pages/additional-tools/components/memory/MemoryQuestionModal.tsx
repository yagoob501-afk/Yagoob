import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Timer, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Question } from "@/lib/MemoryGameLogic"
import "./MemoryStyles.css"

interface MemoryQuestionModalProps {
  question: Question
  team: 'green' | 'blue'
  onAnswer: (isCorrect: boolean) => void
  questionTime: number
}

export function MemoryQuestionModal({ question, team, onAnswer, questionTime }: MemoryQuestionModalProps) {
  const [timeLeft, setTimeLeft] = React.useState(questionTime)
  const [status, setStatus] = React.useState<'pending' | 'correct' | 'wrong' | 'timeout'>('pending')

  React.useEffect(() => {
    if (status !== 'pending') return;
    if (timeLeft <= 0) {
      setStatus('timeout');
      setTimeout(() => onAnswer(false), 2000);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, status, onAnswer]);

  const handleChoice = (idx: number) => {
    if (status !== 'pending') return;
    
    const isCorrect = idx === question.correctAnswerIndex;
    setStatus(isCorrect ? 'correct' : 'wrong');
    
    // Show big feedback for 2 seconds before closing
    setTimeout(() => onAnswer(isCorrect), 2000);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background-prism/90 backdrop-blur-3xl rtl font-cairo">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass-panel p-10 rounded-4xl border border-outline-variant-prism/20 shadow-2xl space-y-10 relative overflow-hidden"
      >
        {/* Header: Team & Timer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className={cn(
               "px-6 py-2 rounded-full font-black text-on-primary shadow-lg text-lg",
               team === 'green' ? "bg-primary-prism shadow-primary-prism/20" : "bg-secondary-prism shadow-secondary-prism/20"
             )}>
               فريق {team === 'green' ? 'الزمرد' : 'السماء'}
             </div>
          </div>

          <div className="flex items-center gap-4 bg-surface-container-high px-5 py-2 rounded-full border border-outline-variant-prism/10">
            <Timer className="text-primary-fixed" size={24} />
            <span className={cn("text-3xl font-black tabular-nums", timeLeft <= 5 ? "text-error animate-pulse" : "text-primary-fixed")}>
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Question Area */}
        <div className="space-y-6 text-center">
            <h3 className="text-4xl font-black text-on-surface-prism leading-tight px-4">
              {question.text}
            </h3>
            <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-primary-prism"
                 initial={{ width: "100%" }}
                 animate={{ width: `${(timeLeft / questionTime) * 100}%` }}
                 transition={{ duration: 1, ease: "linear" }}
               />
            </div>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
          {question.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => handleChoice(idx)}
              disabled={status !== 'pending'}
              className="p-8 rounded-2xl bg-surface-container-low border-2 border-outline-variant-prism/10 font-bold text-2xl transition-all flex items-center justify-center relative hover:bg-surface-bright hover:border-primary-prism/40 active:scale-95 disabled:grayscale-50 disabled:opacity-50"
            >
               {choice}
            </button>
          ))}
        </div>

        {/* High-Impact Feedback Overlay (Modal on Modal) */}
        <AnimatePresence>
          {status !== 'pending' && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-surface-container-highest/60 backdrop-blur-md"
            >
               <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="flex flex-col items-center gap-6"
               >
                  {status === 'correct' && (
                    <>
                      <div className="w-40 h-40 rounded-full bg-primary-prism/20 flex items-center justify-center shadow-[0_0_50px_rgba(134,254,167,0.3)]">
                        <CheckCircle2 className="text-primary-prism" size={120} />
                      </div>
                      <span className="text-5xl font-black text-primary-prism drop-shadow-sm">إجابة صحيحة!</span>
                    </>
                  )}
                  {status === 'wrong' && (
                    <>
                      <div className="w-40 h-40 rounded-full bg-error-container/20 flex items-center justify-center shadow-[0_0_50px_rgba(255,108,108,0.3)]">
                        <XCircle className="text-error" size={120} />
                      </div>
                      <span className="text-5xl font-black text-error drop-shadow-sm">إجابة خاطئة!</span>
                    </>
                  )}
                  {status === 'timeout' && (
                    <>
                      <div className="w-40 h-40 rounded-full bg-yellow-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                        <AlertTriangle className="text-yellow-500" size={120} />
                      </div>
                      <span className="text-5xl font-black text-yellow-500 drop-shadow-sm">انتهى الوقت!</span>
                    </>
                  )}
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
