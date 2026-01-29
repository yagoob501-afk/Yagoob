"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { RotateCcw, ArrowLeft, Pause, HelpCircle } from "lucide-react"

// Type imports for state
import type { TimerState } from "./components/TimerTool"
import type { QuestionToolState } from "./components/QuestionTool"
import type { RandomStudentState } from "./components/RandomStudentTool"
import type { RewardToolState } from "./components/RewardTool"

// New view components
import SetupView from "./components/SetupView"
import RoundView from "./components/RoundView"

// Removed Header/Footer imports

import { useTour } from "@/components/tour/TourProvider"
import { classroomToolsSteps } from "@/components/tour/steps"

export default function ClassroomToolsPage() {
  const [view, setView] = useState<'setup' | 'round'>('setup')
  const { startTour } = useTour()

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('tour_seen_classroom_tools')
    if (!hasSeenTour) {
      // Small delay to ensure render
      setTimeout(() => {
        startTour(classroomToolsSteps)
        localStorage.setItem('tour_seen_classroom_tools', 'true')
      }, 1000)
    }
  }, [startTour])

  // --- Master States ---
  const [timerState, setTimerState] = useState<TimerState>({
    minutes: 0,
    seconds: 0,
    timeLeft: 0,
    totalTime: 0,
    isRunning: false,
    isFinished: false,
    backgroundSoundUrl: undefined
  })

  const [questionState, setQuestionState] = useState<QuestionToolState>({
    questions: "",
    mode: 'text',
    questionItems: [],
    currentQuestion: null,
    excludedQuestions: [],
    excludedQuestionItems: [],
    isAnimating: false
  })

  const [studentState, setStudentState] = useState<RandomStudentState>({
    studentsText: "",
    excludedStudents: [],
    currentStudent: null,
    isAnimating: false
  })

  const [rewardState, setRewardState] = useState<RewardToolState>({
    rewardsText: "",
    excludedRewards: [],
    currentReward: null,
    isAnimating: false
  })

  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null)
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null)
  const tickAudioRef = useRef<HTMLAudioElement | null>(null)

  // Load from local storage
  useEffect(() => {
    const savedTimer = localStorage.getItem('timerState')
    const savedQuestion = localStorage.getItem('questionState')
    const savedStudent = localStorage.getItem('studentState')
    const savedReward = localStorage.getItem('rewardState')

    if (savedTimer) {
      const parsed = JSON.parse(savedTimer)
      setTimerState(prev => ({
        ...prev,
        minutes: parsed.minutes,
        seconds: parsed.seconds,
        totalTime: parsed.minutes * 60 + parsed.seconds,
        timeLeft: parsed.minutes * 60 + parsed.seconds,
        backgroundSoundUrl: parsed.backgroundSoundUrl
      }))
    }
    if (savedQuestion) setQuestionState(JSON.parse(savedQuestion))
    if (savedStudent) setStudentState(JSON.parse(savedStudent))
    if (savedReward) setRewardState(JSON.parse(savedReward))
  }, [])

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('timerState', JSON.stringify({
      minutes: timerState.minutes,
      seconds: timerState.seconds,
      backgroundSoundUrl: timerState.backgroundSoundUrl
    }))
  }, [timerState.minutes, timerState.seconds, timerState.backgroundSoundUrl])

  useEffect(() => {
    localStorage.setItem('questionState', JSON.stringify(questionState))
  }, [questionState])

  useEffect(() => {
    localStorage.setItem('studentState', JSON.stringify(studentState))
  }, [studentState])

  useEffect(() => {
    localStorage.setItem('rewardState', JSON.stringify(rewardState))
  }, [rewardState])

  // Reset All Data
  const resetAllData = () => {
    localStorage.removeItem('timerState')
    localStorage.removeItem('questionState')
    localStorage.removeItem('studentState')
    localStorage.removeItem('rewardState')
    window.location.reload()
  }

  // Global Timer Execution
  useEffect(() => {
    let interval: any
    if (timerState.isRunning && timerState.timeLeft > 0) {
      interval = setInterval(() => {
        setTimerState(prev => {
          if (prev.timeLeft <= 1) {
            return { ...prev, timeLeft: 0, isRunning: false, isFinished: true }
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        })

        // Play tick sound every second
        try {
          if (tickAudioRef.current) {
            tickAudioRef.current.currentTime = 0
            tickAudioRef.current.play().catch(() => { })
          } else {
            const audio = new Audio('/sounds/tick.mp3')
            audio.volume = 0.5
            audio.play().catch(() => { })
            tickAudioRef.current = audio
          }
        } catch (e) {
          console.error("Tick sound failed", e)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerState.isRunning, timerState.timeLeft])

  // Background Sound Playback Logic
  useEffect(() => {
    if (timerState.isRunning && timerState.backgroundSoundUrl) {
      if (!backgroundAudioRef.current) {
        const audio = new Audio(timerState.backgroundSoundUrl)
        audio.loop = false
        audio.play().catch(err => console.log('Audio playback failed:', err))
        backgroundAudioRef.current = audio
      } else {
        // If the URL has changed, update the source
        if (backgroundAudioRef.current.src !== timerState.backgroundSoundUrl) {
          backgroundAudioRef.current.src = timerState.backgroundSoundUrl
          backgroundAudioRef.current.load()
        }
        backgroundAudioRef.current.play().catch(() => { })
      }
    } else {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause()
      }
    }
  }, [timerState.isRunning, timerState.backgroundSoundUrl])

  // Alarm Sound Logic
  useEffect(() => {
    if (timerState.isFinished) {
      if (!alarmAudioRef.current) {
        const audio = new Audio('/sounds/alarm.mp3')
        audio.loop = true
        audio.play().catch(err => console.log('Alarm playback failed:', err))
        alarmAudioRef.current = audio
      } else {
        alarmAudioRef.current.play().catch(() => { })
      }
    } else {
      if (alarmAudioRef.current) {
        alarmAudioRef.current.pause()
        alarmAudioRef.current.currentTime = 0
        alarmAudioRef.current = null
      }
    }
  }, [timerState.isFinished])

  return (
    <div className="min-h-screen flex flex-col bg-bg-layout rtl text-right">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center">

          <div className="mb-8 w-full">
            {/* Buttons row - responsive layout */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Back to Home Button */}
                <Link
                  to="/"
                  className="text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border-2 border-border px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <ArrowLeft size={18} className="rotate-180" /> العودة للرئيسية
                </Link>

                {/* Global Timer Controls */}
                <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border-2 border-border shadow-sm">
                  {timerState.isRunning && (
                    <button
                      onClick={() => setTimerState(p => ({ ...p, isRunning: false }))}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold transition-all bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                    >
                      <Pause size={16} fill="currentColor" /> إيقاف
                    </button>
                  )}
                  <button
                    onClick={() => setTimerState(p => ({ ...p, isRunning: false, isFinished: false, timeLeft: p.totalTime }))}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    title="إعادة ضبط"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <div className="px-4 py-1.5 bg-gray-50 rounded-lg font-mono font-bold text-lg min-w-[80px] text-center border border-gray-100">
                    {Math.floor(timerState.timeLeft / 60)}:{String(timerState.timeLeft % 60).padStart(2, '0')}
                  </div>
                </div>

                {/* Usage Explanation Button */}
                <button
                  onClick={() => startTour(classroomToolsSteps)}
                  className="text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 border-2 border-primary/20 px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <HelpCircle size={18} /> شرح الاستخدام
                </button>
              </div>

              {/* Reset All button - on the left (RTL) */}
              <button
                onClick={() => {
                  if (confirm('هل أنت متأكد من رغبتك في حذف جميع البيانات وإعادة تعيين الأدوات؟')) {
                    resetAllData()
                  }
                }}
                className="text-sm font-semibold text-destructive bg-destructive/10 hover:bg-destructive/20 border-2 border-destructive/30 px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm hover:shadow-md sm:order-last"
                data-tour="reset-btn"
              >
                <RotateCcw size={18} /> إعادة تعيين الكل
              </button>
            </div>

            {/* Title and subtitle - centered */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-heading mb-3">أدوات الصف التفاعلية</h1>
              <p className="text-lg text-muted-foreground">{view === 'setup' ? 'إعداد البيانات' : 'الجولة التفاعلية'}</p>
            </div>
          </div>

          {view === 'setup' ? (
            <SetupView
              timerState={timerState}
              setTimerState={(u) => setTimerState(p => ({ ...p, ...u }))}
              studentState={studentState}
              setStudentState={(u) => setStudentState(p => ({ ...p, ...u }))}
              questionState={questionState}
              setQuestionState={(u) => setQuestionState(p => ({ ...p, ...u }))}
              rewardState={rewardState}
              setRewardState={(u) => setRewardState(p => ({ ...p, ...u }))}
              onStart={() => setView('round')}
            />
          ) : (
            <RoundView
              timerState={timerState}
              setTimerState={(u) => setTimerState(p => ({ ...p, ...u }))}
              studentState={studentState}
              setStudentState={(u) => setStudentState(p => ({ ...p, ...u }))}
              questionState={questionState}
              setQuestionState={(u) => setQuestionState(p => ({ ...p, ...u }))}
              rewardState={rewardState}
              setRewardState={(u) => setRewardState(p => ({ ...p, ...u }))}
              onBack={() => setView('setup')}
              startTour={startTour}
            />
          )}
        </div>
      </main>
    </div>
  )
}
