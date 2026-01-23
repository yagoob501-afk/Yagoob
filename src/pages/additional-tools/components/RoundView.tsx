"use client"

import { useEffect, useState } from "react"
import { Users, HelpCircle, Gift, RotateCcw, Ban, Dices, Bell, Play, Pause } from "lucide-react"
import type { TimerState } from "./TimerTool"
import type { RandomStudentState } from "./RandomStudentTool"
import type { QuestionToolState } from "./QuestionTool"
import type { RewardToolState } from "./RewardTool"
import confetti from "canvas-confetti"

interface RoundViewProps {
  timerState: TimerState
  setTimerState: (u: Partial<TimerState>) => void
  studentState: RandomStudentState
  setStudentState: (u: Partial<RandomStudentState>) => void
  questionState: QuestionToolState
  setQuestionState: (u: Partial<QuestionToolState>) => void
  rewardState: RewardToolState
  setRewardState: (u: Partial<RewardToolState>) => void
  onBack: () => void
  startTour: (steps: any) => void
}

type CardType = 'student' | 'question' | 'reward'

export default function RoundView({
  timerState,
  setTimerState,
  studentState,
  setStudentState,
  questionState,
  setQuestionState,
  rewardState,
  onBack,
}: RoundViewProps) {

  const [phase, setPhase] = useState<'idle' | 'selecting_student' | 'selecting_question' | 'selecting_reward' | 'ready' | 'running' | 'finished'>('idle')

  // Local state for animations to avoid expensive global re-renders during high-speed rolling
  const [displayStudent, setDisplayStudent] = useState<string | null>(null)
  const [displayQuestion, setDisplayQuestion] = useState<string | null>(null)
  const [displayReward, setDisplayReward] = useState<string | null>(null)

  // Exclusion States (Visual only until round finishes/resets, or immediate? User asked: disable button after click, show disabled effect)
  const [studentDisabled, setStudentDisabled] = useState(false)
  const [questionDisabled, setQuestionDisabled] = useState(false)

  // Sync phase with timer finished state
  useEffect(() => {
    if (timerState.isFinished) {
      setPhase('finished')
    }
  }, [timerState.isFinished])

  // --- Utilities ---

  const runSelectionAnimation = async (
    type: CardType,
    sourceText: string,
    excluded: string[],
    setter: (val: string) => void
  ) => {
    return new Promise<void>((resolve) => {
      let duration = 1500; // ms
      let interval = 50; // ms
      let elapsed = 0;

      const list = sourceText.split('\n').map(s => s.trim()).filter(s => s !== "" && !excluded.includes(s))
      if (list.length === 0) {
        resolve()
        return
      }

      const anim = setInterval(() => {
        const item = list[Math.floor(Math.random() * list.length)]
        setter(item)
        elapsed += interval

        // Slow down at end
        if (elapsed > duration * 0.7) interval = 150

        if (elapsed >= duration) {
          clearInterval(anim)
          // Final pick
          const finalItem = list[Math.floor(Math.random() * list.length)]
          setter(finalItem)

          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            disableForReducedMotion: true,
            colors: type === 'student' ? ['#0EA5E9', '#38BDF8'] : type === 'question' ? ['#F59E0B', '#FBBF24'] : ['#EC4899', '#F472B6']
          })
          resolve()
        }
      }, interval)
    })
  }

  // --- Main Action ---
  const handleSelectAll = async () => {
    // Reset Data State only (keep timer if running)
    setStudentDisabled(false)
    setQuestionDisabled(false)
    setDisplayStudent(null)
    setDisplayQuestion(null)
    setDisplayReward(null)

    // 1. Student
    setPhase('selecting_student')
    await runSelectionAnimation('student', studentState.studentsText, studentState.excludedStudents, setDisplayStudent)

    // 2. Question
    setPhase('selecting_question')
    await runSelectionAnimation('question', questionState.questions, questionState.excludedQuestions, setDisplayQuestion)

    // 3. Reward
    setPhase('selecting_reward')
    await runSelectionAnimation('reward', rewardState.rewardsText, rewardState.excludedRewards, setDisplayReward)

    setPhase('ready')

    // Start timer only if it's not running. Do not reset it if it is running.
    if (!timerState.isRunning) {
      setTimerState({ isRunning: true, isFinished: false })
    }
  }

  const handleEndRound = () => {
    setTimerState({ isRunning: false, isFinished: false, timeLeft: timerState.totalTime })
    setPhase('idle')
    setDisplayStudent(null)
    setDisplayQuestion(null)
    setDisplayReward(null)
    setStudentDisabled(false)
    setQuestionDisabled(false)
  }

  // const handleStartTimer = () => {
  //   setTimerState({ isRunning: true })
  //   setPhase('running')
  // }

  const handleReselectReward = async () => {
    setDisplayReward(null)
    await runSelectionAnimation('reward', rewardState.rewardsText, rewardState.excludedRewards, setDisplayReward)
  }

  // --- Exclusion Handlers ---
  const handleExcludeStudent = () => {
    if (displayStudent) {
      setStudentState({ excludedStudents: [...studentState.excludedStudents, displayStudent] })
      setStudentDisabled(true)
    }
  }

  const handleExcludeQuestion = () => {
    if (displayQuestion) {
      setQuestionState({ excludedQuestions: [...questionState.excludedQuestions, displayQuestion] })
      setQuestionDisabled(true)
    }
  }

  // Timer Circle
  const progress = timerState.totalTime > 0 ? ((timerState.totalTime - timerState.timeLeft) / timerState.totalTime) * 100 : 0
  const timerColor = timerState.timeLeft / timerState.totalTime > 0.66 ? '#10B981' : timerState.timeLeft / timerState.totalTime > 0.33 ? '#F59E0B' : '#EF4444'

  return (
    <div className="w-full flex flex-col gap-6">

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Student Card */}
        <div
          className={`relative bg-white rounded-3xl p-6 shadow-sm border-2 transition-all min-h-[250px] flex flex-col items-center justify-center gap-4 text-center overflow-hidden ${phase === 'selecting_student' ? 'border-primary shadow-xl scale-105 z-10' : 'border-border'} ${studentDisabled ? 'opacity-50 grayscale' : ''}`}
          data-tour="round-student-card"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Users size={120} />
          </div>
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">الطالب</span>
          <h3 className="text-3xl font-bold text-gray-800 break-words max-w-full">
            {displayStudent || "---"}
          </h3>
          {phase === 'selecting_student' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary animate-pulse" />}

          {(phase === 'ready' || phase === 'finished') && !studentDisabled && displayStudent && (
            <button onClick={handleExcludeStudent} className="btn-outline border-red-200 text-red-500 hover:bg-red-50 text-xs px-3 py-1 rounded-full flex items-center gap-1 absolute bottom-4">
              <Ban size={12} /> استبعاد
            </button>
          )}
          {studentDisabled && <span className="absolute bottom-4 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">تم الاستبعاد</span>}
        </div>

        {/* Question Card */}
        <div
          className={`relative bg-white rounded-3xl p-6 shadow-sm border-2 transition-all min-h-[250px] flex flex-col items-center justify-center gap-4 text-center overflow-hidden ${phase === 'selecting_question' ? 'border-yellow-500 shadow-xl scale-105 z-10' : 'border-border'} ${questionDisabled ? 'opacity-50 grayscale' : ''}`}
          data-tour="round-question-card"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <HelpCircle size={120} />
          </div>
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">السؤال</span>
          <h3 className="text-2xl font-bold text-gray-800 break-words max-w-full leading-relaxed">
            {displayQuestion || "---"}
          </h3>
          {phase === 'selecting_question' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 animate-pulse" />}

          {(phase === 'ready' || phase === 'finished') && !questionDisabled && displayQuestion && (
            <button onClick={handleExcludeQuestion} className="btn-outline border-red-200 text-red-500 hover:bg-red-50 text-xs px-3 py-1 rounded-full flex items-center gap-1 absolute bottom-4">
              <Ban size={12} /> استبعاد
            </button>
          )}
          {questionDisabled && <span className="absolute bottom-4 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">تم الاستبعاد</span>}
        </div>

        {/* Reward Card */}
        <div
          className={`relative bg-white rounded-3xl p-6 shadow-sm border-2 transition-all min-h-[250px] flex flex-col items-center justify-center gap-4 text-center overflow-hidden ${phase === 'selecting_reward' ? 'border-pink-500 shadow-xl scale-105 z-10' : 'border-border'}`}
          data-tour="round-reward-card"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Gift size={120} />
          </div>
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">المكافأة</span>
          <h3 className="text-2xl font-bold text-gray-800 break-words max-w-full">
            {displayReward || "---"}
          </h3>
          {phase === 'selecting_reward' && <div className="absolute bottom-0 left-0 w-full h-1 bg-pink-500 animate-pulse" />}

          {/* Controls for Reward (Reselect) */}
          {(phase === 'ready' || phase === 'running' || phase === 'finished') && displayReward && (
            <button onClick={handleReselectReward} className="btn-ghost text-muted-foreground hover:text-primary absolute top-2 left-2 p-2">
              <RotateCcw size={16} />
            </button>
          )}
        </div>

      </div>

      {/* Controls Area */}
      <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-border flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => {
              if (timerState.isFinished) {
                // If finished (alarm ringing), stop it and go back
                setTimerState({ isFinished: false, isRunning: false, timeLeft: timerState.totalTime })
                onBack()
              } else {
                onBack()
              }
            }}
            disabled={['selecting_student', 'selecting_question', 'selecting_reward'].includes(phase)}
            className="px-6 py-4 rounded-2xl font-bold text-muted-foreground hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            data-tour="round-back-btn"
          >
            <RotateCcw size={20} /> تعديل البيانات
          </button>


          {/* Pick Data Button - Always visible now */}
          <button
            onClick={handleSelectAll}
            disabled={['selecting_student', 'selecting_question', 'selecting_reward'].includes(phase)}
            className="px-8 py-4 rounded-2xl font-bold border-2 shadow-md flex items-center gap-2 bg-white border-primary text-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
            data-tour="round-start-selection"
          >
            <Dices size={24} /> {['selecting_student', 'selecting_question', 'selecting_reward'].includes(phase) ? 'جاري الاختيار...' : 'اختيار بيانات'}
          </button>

          {/* End Round Button - Visible only when NOT idle */}
          {phase !== 'idle' && (
            <button
              onClick={handleEndRound}
              className="px-8 py-4 rounded-2xl font-bold border-2 shadow-md flex items-center gap-2 bg-destructive/10 border-destructive text-destructive hover:bg-destructive/20"
              data-tour="round-end-btn"
            >
              <Ban size={20} /> إنهاء الجولة
            </button>
          )}
        </div>

        {/* Timer Display */}
        <div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">

          {/* Timer Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimerState({ isRunning: !timerState.isRunning })}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${timerState.isRunning ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
            >
              {timerState.isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="mr-0.5" />}
            </button>
            <button
              onClick={() => setTimerState({ isRunning: false, timeLeft: timerState.totalTime, isFinished: false })}
              className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center transition-all"
              title="إعادة المؤقت"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 absolute">
              <circle cx="50%" cy="50%" r="45%" stroke="#eee" strokeWidth="4" fill="none" className="opacity-20" />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke={timerColor}
                strokeWidth="4"
                fill="none"
                strokeDasharray="283%"
                strokeDashoffset={`${283 - (progress / 100) * 283}%`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <span className={`font-mono font-bold text-base ${timerState.timeLeft <= 5 && timerState.timeLeft > 0 ? 'text-red-500' : 'text-gray-800'}`}>
              {Math.floor(timerState.timeLeft / 60)}:{String(timerState.timeLeft % 60).padStart(2, '0')}
            </span>
          </div>
          {timerState.isFinished && (
            <button
              onClick={() => setTimerState({ isFinished: false, isRunning: false, timeLeft: timerState.totalTime })}
              className="p-3 bg-destructive text-white rounded-xl shadow-lg animate-pulse"
              title="إيقاف المنبه"
            >
              <Bell size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
