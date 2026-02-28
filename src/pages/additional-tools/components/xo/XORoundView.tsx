"use client"

import * as React from "react"
import { RotateCcw, ArrowRight, Trophy, Clock, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { XOGameLogic, type GameState, type Question } from "@/lib/XOGameLogic"
import { XOQuestionModal } from "./XOQuestionModal"
import confetti from "canvas-confetti"

interface XORoundViewProps {
  gameLogic: XOGameLogic
  onBack: () => void
}



/**
 * TimerCard
 * A card that smoothly transitions its background and text colors 
 * as the time remaining decreases.
 */
function TimerCard({
  label,
  time,
  active,
  color,
  muted,
  initialTime
}: {
  label: string,
  time: number,
  active: boolean,
  color: 'green' | 'blue',
  muted?: boolean,
  initialTime: number
}) {
  const mm = Math.floor(time / 60)
  const ss = String(time % 60).padStart(2, '0')
  const percentage = initialTime > 0 ? (time / initialTime) * 100 : 0

  // Define colors based on team and percentage
  const isUrgent = percentage < 25
  const isWarning = percentage < 50

  const getTargetColors = () => {
    if (muted) return { bg: "#f9fafb", text: "#9ca3af", border: "#e5e7eb" }
    if (percentage <= 0) return { bg: "#ef4444", text: "#ffffff", border: "#b91c1c" }

    // Smooth transition logic: Green/Blue -> Red
    if (isUrgent) return { bg: "#ef4444", text: "#ffffff", border: "#b91c1c" }
    if (isWarning) return { bg: "#f97316", text: "#ffffff", border: "#c2410c" }

    return {
      bg: color === 'green' ? "#16a34a" : "#2563eb",
      text: "#ffffff",
      border: color === 'green' ? "#15803d" : "#1d4ed8"
    }
  }

  const colors = getTargetColors()
  const inactiveColors = { bg: "#ffffff", text: "#4b5563", border: color === 'green' ? "#22c55e" : "#3b82f6" }

  return (
    <motion.div
      animate={{
        backgroundColor: active ? colors.bg : inactiveColors.bg,
        color: active ? colors.text : inactiveColors.text,
        borderColor: active ? colors.border : inactiveColors.border,
        scale: active ? 1.1 : 1,
      }}
      className={cn(
        "px-6 py-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-1 min-w-[160px] shadow-sm",
        active ? "shadow-xl z-10" : "bg-white"
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 text-center">{label}</span>
      <div className="flex items-center justify-center gap-2 font-mono text-2xl font-bold">
        <Clock size={18} />
        {mm}:{ss}
      </div>
    </motion.div>
  )
}

export function XORoundView({ gameLogic, onBack }: XORoundViewProps) {
  const [state, setState] = React.useState<GameState>(gameLogic.getState())
  const [activeQuestion, setActiveQuestion] = React.useState<{ question: Question; index: number } | null>(null)
  const [resultFeedback, setResultFeedback] = React.useState<{ index: number; type: 'correct' | 'wrong' } | null>(null)

  // Audio refs
  const tickAudio = React.useRef<HTMLAudioElement | null>(null)
  const switchAudio = React.useRef<HTMLAudioElement | null>(null)
  const wrongAudio = React.useRef<HTMLAudioElement | null>(null)

  // Initialize audio on mount
  React.useEffect(() => {
    // Create audio objects
    const tick = new Audio("/sounds/tick.mp3")
    const switchAlarm = new Audio("/sounds/switch-alarm.mp3")
    const wrong = new Audio("/sounds/wrong-answer.mp3")

    // Pre-load
    tick.load()
    switchAlarm.load()
    wrong.load()

    tickAudio.current = tick
    switchAudio.current = switchAlarm
    wrongAudio.current = wrong

    // Wire up the logic callback to audio
    gameLogic.onEffect = (effect) => {
      let audio: HTMLAudioElement | null = null

      if (effect === 'tick') audio = tickAudio.current
      else if (effect === 'switch-alarm') audio = switchAudio.current
      else if (effect === 'wrong-answer') audio = wrongAudio.current

      if (audio) {
        audio.currentTime = 0
        audio.play().catch(err => {
          // Some browsers require interaction or have issues with rapid playback
          console.warn(`Audio playback failed for ${effect}:`, err)
        })
      }
    }

    return () => {
      gameLogic.onEffect = undefined
    }
  }, [gameLogic])

  // Force update trigger for logic values
  const forceUpdate = React.useCallback(() => {
    setState(gameLogic.getState())
  }, [gameLogic])

  // Timer loop for team timers
  React.useEffect(() => {
    // Ticking continues even if question modal is open (removed activeQuestion check)
    if (state.status !== 'playing' || state.initialTimerValue === 0) return;

    const interval = setInterval(() => {
      const team = state.currentPlayer === 'X' ? 'green' : 'blue'
      gameLogic.updateTimer(team, 1)
      forceUpdate()
    }, 1000)

    return () => clearInterval(interval)
  }, [state.status, state.currentPlayer, state.initialTimerValue, gameLogic, forceUpdate])

  // Auto-close modal if game ends
  React.useEffect(() => {
    if (state.status === 'finished' && activeQuestion) {
      setActiveQuestion(null)
    }
  }, [state.status, activeQuestion])

  const handleCellClick = (index: number) => {
    if (state.board[index] || state.status !== 'playing' || activeQuestion) return

    const question = gameLogic.selectBox(index)
    if (question) {
      // Set default question limit to 30s, capped by team's remaining time
      const teamTime = state.currentPlayer === 'X' ? state.greenTimer : state.blueTimer
      const cappedLimit = Math.min(30, teamTime)
      setActiveQuestion({
        question: { ...question, timeLimit: cappedLimit },
        index
      })
    }
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (!activeQuestion) return

    const cellIndex = activeQuestion.index
    gameLogic.handleAnswer(cellIndex, isCorrect, activeQuestion.question.id)

    // Set visual feedback
    setResultFeedback({ index: cellIndex, type: isCorrect ? 'correct' : 'wrong' })

    // Smooth delay before closing modal to show the icon on the board
    setTimeout(() => {
      setResultFeedback(null)
      setActiveQuestion(null)
      forceUpdate()

      if (gameLogic.getState().winner && gameLogic.getState().winner !== 'Draw') {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: gameLogic.getState().winner === 'X' ? ['#22c55e', '#16a34a'] : ['#3b82f6', '#2563eb']
        })
      }
    }, 1200) // 1.2s to show rotation
  }

  const teamColor = state.currentPlayer === 'X' ? 'text-green-600' : 'text-blue-600'
  const teamBg = state.currentPlayer === 'X' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
  const isMuted = state.initialTimerValue === 0

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-gray-700 font-bold border-2 border-border hover:bg-gray-50 transition-all shadow-sm"
        >
          <ArrowRight className="rotate-0 transition-transform" /> العودة للإعدادات
        </button>

        <div className="flex gap-4">
          <TimerCard
            label="فريق الأخضر (X)"
            time={state.greenTimer}
            active={state.currentPlayer === 'X'}
            color="green"
            muted={isMuted}
            initialTime={state.initialTimerValue}
          />
          <TimerCard
            label="فريق الأزرق (O)"
            time={state.blueTimer}
            active={state.currentPlayer === 'O'}
            color="blue"
            muted={isMuted}
            initialTime={state.initialTimerValue}
          />
        </div>
      </div>

      {/* Game Board */}
      <div className="relative aspect-square w-full max-w-[600px] mx-auto grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-4xl shadow-inner border-4 border-white/50">
        {state.board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            className={cn(
              "relative bg-white rounded-3xl shadow-md border-b-8 border-gray-200 flex flex-col items-center justify-center group transition-all active:translate-y-1 active:border-b-0",
              !cell && state.status === 'playing' ? "hover:scale-105 hover:shadow-xl hover:border-primary/20" : "",
              cell === 'X' ? "bg-green-50 border-green-200" : cell === 'O' ? "bg-blue-50 border-blue-200" : ""
            )}
          >
            <span className="text-sm font-bold text-gray-300 absolute top-4 left-4">{idx + 1}</span>
            <AnimatePresence mode="wait">
              {cell ? (
                <motion.span
                  key="cell"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className={cn(
                    "text-7xl font-black",
                    cell === 'X' ? "text-green-600" : "text-blue-600"
                  )}
                >
                  {cell}
                </motion.span>
              ) : (
                <div key="placeholder" className="opacity-0 group-hover:opacity-10 transition-opacity">
                  <HelpCircle size={64} className="text-gray-400" />
                </div>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      {/* Status Bar */}
      <div className={cn(
        "p-6 rounded-4xl border-4 text-center transition-all shadow-lg",
        state.status === 'finished' ? "bg-white border-primary" : teamBg
      )}>
        {state.status === 'finished' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 text-3xl font-black text-gray-800">
              <Trophy className="text-yellow-500 animate-bounce" size={48} />
              <span>
                {state.winner === 'Draw' ? "تعادل!" : `فاز الفريق ${state.winner === 'X' ? 'الأخضر' : 'الأزرق'}!`}
              </span>
            </div>
            {state.greenTimer === 0 || state.blueTimer === 0 ? (
              <p className="text-red-500 font-bold">انتهى الوقت المسموح للفريق!</p>
            ) : null}
            <button
              onClick={() => {
                gameLogic.startGame()
                forceUpdate()
              }}
              className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw size={18} /> لعب جولة جديدة
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md animate-pulse">
              <span className={cn("text-4xl font-black", teamColor)}>{state.currentPlayer}</span>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold text-gray-800">دور الفريق {state.currentPlayer === 'X' ? 'الأخضر' : 'الأزرق'}</h3>
              <p className="text-muted-foreground">اختر مربعاً لبدء تحدي السؤال</p>
            </div>
          </div>
        )}
      </div>

      {activeQuestion && (
        <XOQuestionModal
          question={activeQuestion.question}
          team={state.currentPlayer === 'X' ? 'green' : 'blue'}
          onAnswer={handleAnswer}
          result={resultFeedback?.type || null}
        />
      )}
    </div>
  )
}
