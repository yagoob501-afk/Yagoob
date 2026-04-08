import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  RotateCcw,
  ArrowRight,
  Trophy,
  Play,
  Shield,
  Sparkles,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MemoryGameLogic, type MemoryGameState } from "@/lib/MemoryGameLogic"
import { MemoryCard } from "./MemoryCard"
import { MemoryQuestionModal } from "./MemoryQuestionModal"
import confetti from "canvas-confetti"
import "./MemoryStyles.css"

interface MemoryRoundViewProps {
  gameLogic: MemoryGameLogic
  onBack: () => void
}

export function MemoryRoundView({ gameLogic, onBack }: MemoryRoundViewProps) {
  const [state, setState] = React.useState<MemoryGameState>(gameLogic.getState())
  const [activeQuestion, setActiveQuestion] = React.useState<{ question: any; pairId: string } | null>(null)
  const [showResultModal, setShowResultModal] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [scale, setScale] = React.useState(1)
  const [contentHeight, setContentHeight] = React.useState<number | null>(null)

  // Audio refs
  const tickAudio = React.useRef<HTMLAudioElement | null>(null)
  const successAudio = React.useRef<HTMLAudioElement | null>(null)
  const wrongAudio = React.useRef<HTMLAudioElement | null>(null)

  // Initialize audio on mount
  React.useEffect(() => {
    tickAudio.current = new Audio("/sounds/tick.mp3")
    successAudio.current = new Audio("/sounds/switch-alarm.mp3")
    wrongAudio.current = new Audio("/sounds/wrong-answer.mp3")

    gameLogic.onEffect = (effect) => {
      let audio: HTMLAudioElement | null = null
      if (effect === 'tick') audio = tickAudio.current
      else if (effect === 'match-success') audio = successAudio.current
      else if (effect === 'wrong-answer') audio = wrongAudio.current

      if (audio) {
        audio.currentTime = 0
        audio.play().catch(() => { })
      }
    }
  }, [gameLogic])

  // Scaling Logic (Mobile Scale Technique)
  React.useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth
      const baseWidth = 1140
      const padding = 32
      const availableWidth = screenWidth - padding
      setScale(Math.min(availableWidth / baseWidth, 1))
    }
    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  // Sync content height for scaling transitions
  React.useEffect(() => {
    const updateHeight = () => {
      const gridElement = document.getElementById("memory-game-content")
      if (gridElement) {
        const actualHeight = gridElement.scrollHeight * scale
        setContentHeight(actualHeight)
      }
    }
    const timer = setTimeout(updateHeight, 100)
    return () => clearTimeout(timer)
  }, [scale, state])

  const forceUpdate = React.useCallback(() => {
    setState(gameLogic.getState())
  }, [gameLogic])

  const handleCardClick = (id: string) => {
    if (state.status !== 'playing' || activeQuestion || isProcessing) return

    // Don't flip if already flipped
    const card = state.board.find(c => c.id === id)
    if (card?.isFlipped || card?.isMatched) return

    gameLogic.flipCard(id)
    forceUpdate()

    // Check for match
    const match = gameLogic.checkMatch()
    if (match) {
      setTimeout(() => {
        setActiveQuestion(match)
      }, 600) // Wait for flip animation
    } else {
      // If two cards flipped but no match, reset them after delay
      const updatedState = gameLogic.getState()
      const flipped = updatedState.board.filter(c => c.isFlipped && !c.isMatched)
      
      if (flipped.length === 2) {
        setIsProcessing(true) // Lock the board
        setTimeout(() => {
          gameLogic.handleAnswer(false) // This will flip them back and switch players
          setIsProcessing(false) // Unlock
          forceUpdate()
        }, 1500)
      }
    }
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (!activeQuestion) return

    gameLogic.handleAnswer(isCorrect, activeQuestion.pairId)
    setActiveQuestion(null)
    forceUpdate()

    if (isCorrect) {
      const updatedState = gameLogic.getState()
      if (updatedState.status === 'finished') {
        setShowResultModal(true)
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#86fea7', '#34b5fa']
        })
      }
    }
  }

  const isReady = state.status === 'ready'
  const isFinished = state.status === 'finished'

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 pb-24 rtl font-cairo">
      {/* Header Info - Back button & Ready State */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface-container-high text-on-surface-prism font-bold border border-outline-variant-prism/10 hover:bg-surface-bright transition-all shadow-sm self-start"
        >
          <ArrowRight className="rotate-180" size={20} /> الإعدادات
        </button>

        {isReady && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex justify-center"
          >
            <button
              onClick={() => { gameLogic.startGame(); forceUpdate(); }}
              className="px-10 py-4 rounded-full bg-linear-to-br from-primary-prism to-primary-container text-on-primary font-black text-xl shadow-lg shadow-primary-prism/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <Play size={24} fill="currentColor" />
              بدء الجولة الآن
            </button>
          </motion.div>
        )}
      </div>

      {!isReady && (
        <div 
          style={{ height: contentHeight ? `${contentHeight}px` : "auto" }} 
          className="transition-[height] duration-300 w-full overflow-hidden flex justify-center"
        >
          <div
            id="memory-game-content"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              width: "1140px",
              flexShrink: 0
            }}
          >
            {/* Team Scoreboard (The Cognitive Prism Style) */}
            <section className="w-full flex flex-col md:flex-row justify-between items-center gap-8 relative mb-16">
              {/* Team Emerald */}
              <div className="relative flex-1 w-full">
                <div className={cn(
                  "flex items-center gap-6 p-6 rounded-xl bg-surface-container-high border-r-8 relative overflow-hidden transition-all duration-500",
                  state.currentPlayer === 'Team1' ? "border-primary-prism shadow-[0_0_40px_rgba(134,254,167,0.1)]" : "border-transparent opacity-60"
                )}>
                  {state.currentPlayer === 'Team1' && <div className="absolute inset-0 bg-primary-prism/5 pointer-events-none" />}
                  <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center shadow-lg shadow-primary-prism/20">
                    <Shield size={40} className="text-on-primary-container" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-headline font-black text-2xl text-primary-fixed tracking-tight">{state.greenTeamName}</span>
                      <span className="font-headline font-extrabold text-4xl text-primary-prism">{state.scores.Team1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-prism transition-all duration-500 rounded-full"
                          style={{ width: `${(state.scores.Team1 / (state.board.length / 2)) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-label text-primary-dim uppercase tracking-widest whitespace-nowrap">
                        {state.scores.Team1} تطابقات
                      </span>
                    </div>
                  </div>
                </div>
                {state.currentPlayer === 'Team1' && (
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-prism rounded-full blur-xl animate-pulse" />
                )}
              </div>

              {/* VS Divider */}
              <div className="flex flex-col items-center justify-center px-4">
                <span className="font-headline font-black text-outline-variant-prism text-3xl italic tracking-tighter opacity-40">مقابل</span>
              </div>

              {/* Team Sky */}
              <div className="relative flex-1 w-full">
                <div className={cn(
                  "flex items-center gap-6 p-6 rounded-xl bg-surface-container-low relative overflow-hidden transition-all duration-500 border-r-8",
                  state.currentPlayer === 'Team2' ? "border-secondary-prism shadow-[0_0_40px_rgba(52,181,250,0.1)] opacity-100" : "border-transparent opacity-60"
                )}>
                  <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center shadow-lg shadow-secondary-prism/20">
                    <Sparkles size={40} className="text-secondary-fixed" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-headline font-bold text-2xl text-secondary-fixed tracking-tight">{state.blueTeamName}</span>
                      <span className="font-headline font-extrabold text-4xl text-secondary-prism">{state.scores.Team2}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary-prism transition-all duration-500 rounded-full"
                          style={{ width: `${(state.scores.Team2 / (state.board.length / 2)) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-label text-secondary-fixed-dim uppercase tracking-widest whitespace-nowrap">
                        {state.scores.Team2} تطابقات
                      </span>
                    </div>
                  </div>
                </div>
                {state.currentPlayer === 'Team2' && (
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary-prism rounded-full blur-xl animate-pulse" />
                )}
              </div>
            </section>

            {/* Main Game Grid Container */}
            <main className="w-full relative">
              {/* Floating Status Bar */}
              {(() => {
                const totalPairs = state.board.length / 2;
                const matchedPairs = state.scores.Team1 + state.scores.Team2;
                const remainingPairs = totalPairs - matchedPairs;

                return (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
                    <div className="glass-panel py-3 px-8 rounded-full flex items-center justify-between shadow-2xl border border-outline-variant-prism/20 gap-4">
                      <div className="flex flex-col items-center flex-1">
                        <span className="text-[10px] font-bold text-on-surface-variant-prism/60 uppercase">المتبقي</span>
                        <span className="font-headline font-black text-xl text-primary-fixed leading-tight">{remainingPairs} تطابقات</span>
                      </div>
                      <div className="h-6 w-px bg-outline-variant-prism/30" />
                      <div className="flex flex-col items-center flex-1">
                        <span className="text-[10px] font-bold text-on-surface-variant-prism/60 uppercase">التطابقات المكتملة</span>
                        <span className="font-headline font-black text-xl text-primary-fixed leading-tight">{matchedPairs}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* The Grid */}
              <div
                className="grid gap-6 pt-12"
                style={{
                  gridTemplateColumns: `repeat(${state.matrix.cols}, minmax(0, 1fr))`
                }}
              >
                {state.board.map((card, idx) => (
                  <MemoryCard
                    key={card.id}
                    index={idx}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                    disabled={isFinished || !!activeQuestion}
                  />
                ))}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Finished State / Winner Display Modal */}
      <AnimatePresence>
        {isFinished && showResultModal && (
          <div className="fixed inset-0 z-101 flex items-center justify-center p-4 bg-background-prism/80 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl glass-panel p-12 rounded-4xl border-4 border-primary-prism/30 text-center space-y-10 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-prism/20 rounded-full blur-[80px] -z-10" />
              
              <button
                 onClick={() => setShowResultModal(false)}
                 className="absolute top-6 right-6 p-2 text-on-surface-variant-prism hover:bg-surface-bright rounded-full transition-all"
              >
                 <X size={24} />
              </button>

              <div className="space-y-6">
                <motion.div
                  initial={{ rotate: -10, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <Trophy size={140} className="text-yellow-400 mx-auto drop-shadow-[0_0_30px_rgba(250,204,21,0.4)]" />
                </motion.div>
                
                <div className="space-y-3">
                  <h2 className="text-6xl font-black text-on-surface-prism tracking-tight text-balance">
                    {state.winner === 'Draw' ? "تعادل الفريقين!" : `فاز ${state.winner === 'Team1' ? state.greenTeamName : state.blueTeamName}!`}
                  </h2>
                  <p className="text-2xl text-on-surface-variant-prism font-bold opacity-80">تهانينا على هذا التحدي الرائع!</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                <button
                  onClick={() => { 
                    gameLogic.prepareGame(); 
                    setShowResultModal(false);
                    forceUpdate(); 
                  }}
                  className="w-full sm:w-auto px-10 py-5 bg-linear-to-br from-primary-prism to-primary-container text-on-primary font-black text-xl rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                >
                  <RotateCcw size={28} /> جولة جديدة
                </button>
                
                <button
                  onClick={onBack}
                  className="w-full sm:w-auto px-10 py-5 bg-surface-container-high border border-outline-variant-prism/10 text-on-surface-prism font-bold text-xl rounded-full shadow-xl hover:bg-surface-bright transition-all flex items-center justify-center gap-4"
                >
                  <ArrowRight className="rotate-180" size={28} /> الإعدادات
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Question Challenge Modal */}
      {activeQuestion && (
        <MemoryQuestionModal
          question={activeQuestion.question}
          team={state.currentPlayer === 'Team1' ? 'green' : 'blue'}
          onAnswer={handleAnswer}
          questionTime={state.questionTime}
        />
      )}

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-prism/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-prism/10 rounded-full blur-[120px]" />
      </div>
    </div>
  )
}
