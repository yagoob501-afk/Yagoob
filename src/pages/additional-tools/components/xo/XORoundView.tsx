"use client"

import * as React from "react"
import { RotateCcw, ArrowRight, Trophy, Play } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { XOGameLogic, type GameState, type Question } from "@/lib/XOGameLogic"
import { XOQuestionModal } from "./XOQuestionModal"
import confetti from "canvas-confetti"

interface XORoundViewProps {
  gameLogic: XOGameLogic
  onBack: () => void
}



import type { TeamColor } from "@/lib/XOGameLogic"

const COLOR_MAP: Record<TeamColor, { bg: string, text: string, border: string, hover: string, light: string, hex: string }> = {
  red: { bg: "bg-red-600", text: "text-red-600", border: "border-red-600", hover: "hover:bg-red-50", light: "bg-red-50", hex: "#dc2626" },
  emerald: { bg: "bg-emerald-600", text: "text-emerald-600", border: "border-emerald-600", hover: "hover:bg-emerald-50", light: "bg-emerald-50", hex: "#059669" },
  sky: { bg: "bg-sky-600", text: "text-sky-600", border: "border-sky-600", hover: "hover:bg-sky-50", light: "bg-sky-50", hex: "#0284c7" },
  purple: { bg: "bg-purple-600", text: "text-purple-600", border: "border-purple-600", hover: "hover:bg-purple-50", light: "bg-purple-50", hex: "#9333ea" },
  yellow: { bg: "bg-yellow-500", text: "text-yellow-500", border: "border-yellow-500", hover: "hover:bg-yellow-50", light: "bg-yellow-50", hex: "#eab308" },
  orange: { bg: "bg-orange-500", text: "text-orange-500", border: "border-orange-500", hover: "hover:bg-orange-50", light: "bg-orange-50", hex: "#f97316" },
  green: { bg: "bg-green-600", text: "text-green-600", border: "border-green-600", hover: "hover:bg-green-50", light: "bg-green-50", hex: "#16a34a" },
  blue: { bg: "bg-blue-600", text: "text-blue-600", border: "border-blue-600", hover: "hover:bg-blue-50", light: "bg-blue-50", hex: "#2563eb" },
}

const COLORS: TeamColor[] = ['red', 'emerald', 'sky', 'purple', 'yellow', 'orange']

function TeamCard({
  name,
  symbol,
  active,
  color,
  onColorChange,
  isReadyMode
}: {
  name: string,
  symbol: string,
  active: boolean,
  color: TeamColor,
  onColorChange?: (color: TeamColor) => void,
  isReadyMode: boolean
}) {
  const styles = COLOR_MAP[color]

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{
          backgroundColor: active ? styles.hex : "#ffffff",
          color: active ? "#ffffff" : styles.hex,
          borderColor: styles.hex,
          scale: active ? 1.05 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "px-8 py-6 rounded-3xl border-4 transition-all flex flex-col items-center gap-2 min-w-[200px] shadow-sm relative overflow-hidden",
          active ? "shadow-2xl z-10" : "bg-white"
        )}
      >
        <span className="text-xs font-black uppercase tracking-widest opacity-70">
          فريق ({symbol})
        </span>
        <div className="text-2xl font-black text-center whitespace-nowrap">
          {name}
        </div>

        {active && (
          <motion.div
            layoutId="active-indicator"
            className="absolute bottom-0 left-0 w-full h-1 bg-white/30"
          />
        )}
      </motion.div>

      {isReadyMode && onColorChange && (
        <div className="flex gap-2 p-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => onColorChange(c)}
              className={cn(
                "w-6 h-6 rounded-full transition-transform hover:scale-125 border-2",
                c === color ? "border-gray-400 scale-110" : "border-transparent",
                COLOR_MAP[c].bg
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function XORoundView({ gameLogic, onBack }: XORoundViewProps) {
  const [state, setState] = React.useState<GameState>(gameLogic.getState())
  const [activeQuestion, setActiveQuestion] = React.useState<{ question: Question; index: number } | null>(null)
  const [resultFeedback, setResultFeedback] = React.useState<{ index: number; type: 'correct' | 'wrong' | 'timeout' } | null>(null)

  // Audio refs
  const tickAudio = React.useRef<HTMLAudioElement | null>(null)
  const switchAudio = React.useRef<HTMLAudioElement | null>(null)
  const wrongAudio = React.useRef<HTMLAudioElement | null>(null)

  // Initialize audio on mount
  React.useEffect(() => {
    const tick = new Audio("/sounds/tick.mp3")
    const switchAlarm = new Audio("/sounds/switch-alarm.mp3")
    const wrong = new Audio("/sounds/wrong-answer.mp3")

    tick.load()
    switchAlarm.load()
    wrong.load()

    tickAudio.current = tick
    switchAudio.current = switchAlarm
    wrongAudio.current = wrong

    gameLogic.onEffect = (effect) => {
      let audio: HTMLAudioElement | null = null
      if (effect === 'tick') audio = tickAudio.current
      else if (effect === 'switch-alarm') audio = switchAudio.current
      else if (effect === 'wrong-answer') audio = wrongAudio.current

      if (audio) {
        audio.currentTime = 0
        audio.play().catch(err => console.warn(`Audio playback failed for ${effect}:`, err))
      }
    }

    return () => {
      gameLogic.onEffect = undefined
    }
  }, [gameLogic])

  const forceUpdate = React.useCallback(() => {
    setState(gameLogic.getState())
  }, [gameLogic])

  // Timer loop for team timers - maybe a dead code
  /*
  React.useEffect(() => {
    if (state.status !== 'playing' || state.initialTimerValue === 0) return;
    const interval = setInterval(() => {
      const team = state.currentPlayer === 'X' ? 'green' : 'blue'
      gameLogic.updateTimer(team, 1)
      forceUpdate()
    }, 1000)
    return () => clearInterval(interval)
  }, [state.status, state.currentPlayer, state.initialTimerValue, gameLogic, forceUpdate])
  */

  React.useEffect(() => {
    if (state.status === 'finished' && activeQuestion) {
      setActiveQuestion(null)
    }
  }, [state.status, activeQuestion])

  const handleCellClick = (index: number) => {
    if (state.board[index] || state.status !== 'playing' || activeQuestion) return

    const question = gameLogic.selectBox(index)
    if (question) {
      // maybe a dead code
      /*
      const teamTime = state.currentPlayer === 'X' ? state.greenTimer : state.blueTimer
      const cappedLimit = state.initialTimerValue > 0 ? Math.min(30, teamTime) : 30
      */
      const cappedLimit = 30;
      setActiveQuestion({
        question: { ...question, timeLimit: cappedLimit },
        index
      })
    }
  }

  const handleAnswer = (isCorrect: boolean, reason: 'wrong' | 'timeout' = 'wrong') => {
    if (!activeQuestion) return
    const cellIndex = activeQuestion.index
    // A timeout is effectively a wrong answer (meaning the cell is not taken, but turn passes)
    gameLogic.handleAnswer(cellIndex, isCorrect, activeQuestion.question.id)
    setResultFeedback({
      index: cellIndex,
      type: isCorrect ? 'correct' : reason
    })

    setTimeout(() => {
      setResultFeedback(null)
      setActiveQuestion(null)
      // Call forceUpdate again just in case there are lagging state changes
      forceUpdate()

      if (gameLogic.getState().winner && gameLogic.getState().winner !== 'Draw') {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: [COLOR_MAP[state.greenTeamColor].hex, COLOR_MAP[state.blueTeamColor].hex]
        })
      }
    }, 1200)
  }

  const handleStartGame = () => {
    gameLogic.startGame()
    forceUpdate()
  }

  const currentTeamColor = state.currentPlayer === 'X' ? state.greenTeamColor : state.blueTeamColor
  const teamStyles = COLOR_MAP[currentTeamColor]
  const isReady = state.status === 'ready'

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-gray-700 font-bold border-2 border-border hover:bg-gray-50 transition-all shadow-sm self-start"
        >
          <ArrowRight className="rotate-0 transition-transform" /> الإعدادات
        </button>

        <div className="flex gap-8 items-start">
          <TeamCard
            name={state.greenTeamName}
            symbol="X"
            active={state.status === 'playing' && state.currentPlayer === 'X'}
            color={state.greenTeamColor}
            isReadyMode={isReady}
            onColorChange={(c) => {
              gameLogic.setTeamInfo(state.greenTeamName, state.blueTeamName, c, state.blueTeamColor)
              forceUpdate()
            }}
          />
          <TeamCard
            name={state.blueTeamName}
            symbol="O"
            active={state.status === 'playing' && state.currentPlayer === 'O'}
            color={state.blueTeamColor}
            isReadyMode={isReady}
            onColorChange={(c) => {
              gameLogic.setTeamInfo(state.greenTeamName, state.blueTeamName, state.greenTeamColor, c)
              forceUpdate()
            }}
          />
        </div>
      </div>

      {isReady && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 py-12 bg-white rounded-5xl border-4 border-dashed border-gray-100"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-gray-800">هل أنتم مستعدون؟</h2>
            <p className="text-gray-500 font-bold">قوموا باختيار ألوان الفرق ثم اضغطوا ابدأ</p>
          </div>
          <button
            onClick={handleStartGame}
            className="px-12 py-5 bg-green-600 text-white font-black text-2xl rounded-3xl shadow-2xl shadow-green-200 hover:scale-110 active:scale-95 transition-all flex items-center gap-4"
          >
            <Play size={32} fill="currentColor" />
            بدء التحدي الآن
          </button>
        </motion.div>
      )}

      {(state.status === 'playing' || state.status === 'finished') && (
        <>
          {/* Game Board */}
          <div className="relative aspect-square w-full max-w-[600px] mx-auto grid grid-cols-3 gap-6 bg-gray-100 p-6 rounded-[3rem] shadow-inner border-8 border-white">
            {state.board.map((cell, idx) => {
              const cellColor = cell === 'X' ? COLOR_MAP[state.greenTeamColor] : cell === 'O' ? COLOR_MAP[state.blueTeamColor] : null
              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  className={cn(
                    "relative bg-white rounded-4xl shadow-md border-b-12 border-gray-200 flex flex-col items-center justify-center group transition-all active:translate-y-2 active:border-b-0",
                    !cell && state.status === 'playing' ? "hover:scale-105 hover:shadow-2xl" : "",
                    cell === 'X' ? `${cellColor?.light} ${cellColor?.border.replace('border-', 'border-')}` :
                      cell === 'O' ? `${cellColor?.light} ${cellColor?.border.replace('border-', 'border-')}` : ""
                  )}
                >
                  <div className="absolute top-4 right-6">
                    <span className={cn(
                      "text-2xl font-black",
                      cell ? "opacity-40 text-gray-400" : "sr-only"
                    )}>
                      {idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center justify-center w-full h-full">
                    {cell ? (
                      <motion.span
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className={cn(
                          "text-7xl font-black",
                          cell === 'X' ? COLOR_MAP[state.greenTeamColor].text : COLOR_MAP[state.blueTeamColor].text
                        )}
                      >
                        {cell}
                      </motion.span>
                    ) : (
                      <span className="text-8xl font-black text-primary/40 group-hover:text-primary/80 transition-colors">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Status Bar */}
          <div className={cn(
            "p-8 rounded-[3rem] border-4 text-center transition-all shadow-xl",
            state.status === 'finished' ? "bg-white border-primary" : `${teamStyles.light} ${teamStyles.border}`
          )}>
            {state.status === 'finished' ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Trophy className="text-yellow-500 animate-bounce" size={64} />
                  <span className="text-4xl font-black text-gray-800">
                    {state.winner === 'Draw' ? "تعادل الفريقين!" : `فاز ${state.winner === 'X' ? state.greenTeamName : state.blueTeamName}!`}
                  </span>
                </div>
                <button
                  onClick={() => {
                    gameLogic.prepareGame()
                    forceUpdate()
                  }}
                  className="px-10 py-4 bg-primary text-white font-black text-xl rounded-2xl shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto"
                >
                  <RotateCcw size={24} /> جولة جديدة
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-8">
                <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg animate-pulse", teamStyles.bg)}>
                  <span className="text-5xl font-black text-white">{state.currentPlayer}</span>
                </div>
                <div className="text-right">
                  <h3 className="text-3xl font-black text-gray-800">دور {state.currentPlayer === 'X' ? state.greenTeamName : state.blueTeamName}</h3>
                  <p className="text-gray-500 font-bold text-lg">اختر مربعاً لبدء التحدي</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {activeQuestion && (
        <XOQuestionModal
          question={activeQuestion.question}
          team={state.currentPlayer === 'X' ? 'green' : 'blue'}
          onAnswer={(isCorrect) => handleAnswer(isCorrect, 'wrong')}
          onTimeout={() => handleAnswer(false, 'timeout')}
          result={resultFeedback?.type || null}
        />
      )}
    </div>
  )
}
