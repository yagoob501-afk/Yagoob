"use client"

import { useState, useRef, useEffect } from "react"
import { RotateCcw, HelpCircle } from "lucide-react"

// Type imports for state
import type { TimerState } from "./components/TimerTool"
import type { QuestionToolState } from "./components/QuestionTool"
import type { RandomStudentState } from "./components/RandomStudentTool"
import type { RewardToolState } from "./components/RewardTool"

// New view components
import SetupView from "./components/SetupView"
import RoundView from "./components/RoundView"

import PrimaryHeader from "@/components/sections/Header/PrimaryHeader"
import PrimaryFooter from "@/components/sections/Footer/PrimaryFooter"

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
    soundUrl: undefined,
    tickSoundUrl: undefined
  })

  const [questionState, setQuestionState] = useState<QuestionToolState>({
    questions: "",
    currentQuestion: null,
    excludedQuestions: [],
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

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const tickAudioRef = useRef<HTMLAudioElement | null>(null)

  // Load from local storage
  useEffect(() => {
    const savedTimer = localStorage.getItem('timerState')
    const savedQuestion = localStorage.getItem('questionState')
    const savedStudent = localStorage.getItem('studentState')
    const savedReward = localStorage.getItem('rewardState')

    if (savedTimer) {
      // Only load settings (minutes/seconds/sounds), not running state
      const parsed = JSON.parse(savedTimer)
      // Ensure UI stays consistent
      setTimerState(prev => ({
        ...prev,
        minutes: parsed.minutes,
        seconds: parsed.seconds,
        totalTime: parsed.minutes * 60 + parsed.seconds,
        timeLeft: parsed.minutes * 60 + parsed.seconds,
        soundUrl: parsed.soundUrl,
        tickSoundUrl: parsed.tickSoundUrl
      }))
    }
    if (savedQuestion) setQuestionState(JSON.parse(savedQuestion))
    if (savedStudent) setStudentState(JSON.parse(savedStudent))
    if (savedReward) setRewardState(JSON.parse(savedReward))
  }, [])

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('timerState', JSON.stringify({ minutes: timerState.minutes, seconds: timerState.seconds, soundUrl: timerState.soundUrl, tickSoundUrl: timerState.tickSoundUrl }))
  }, [timerState.minutes, timerState.seconds, timerState.soundUrl, timerState.tickSoundUrl])

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

        // Play tick sound (throttled/managed by browser mostly, but logic is here)
        if (timerState.tickSoundUrl) {
          if (tickAudioRef.current) {
            tickAudioRef.current.currentTime = 0
            tickAudioRef.current.play().catch(() => { })
          } else {
            const audio = new Audio(timerState.tickSoundUrl)
            audio.volume = 0.5
            audio.play().catch(() => { })
            tickAudioRef.current = audio
          }
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerState.isRunning, timerState.timeLeft, timerState.tickSoundUrl])

  // Alarm Sound Logic
  useEffect(() => {
    if (timerState.isFinished && !audioRef.current) {
      const audio = new Audio(timerState.soundUrl || '/sounds/alarm.mp3')
      audio.loop = true
      audio.play().catch(err => console.log('Audio wait interaction:', err))
      audioRef.current = audio
    } else if (!timerState.isFinished && audioRef.current) {
      // Stop alarm if isFinished becomes false
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }, [timerState.isFinished, timerState.soundUrl])

  return (
    <div className="min-h-screen flex flex-col bg-bg-layout rtl text-right">
      <PrimaryHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center">

          <div className="text-center mb-8 relative w-full">
            <h1 className="text-4xl font-bold text-heading mb-3">أدوات الصف التفاعلية</h1>
            <p className="text-lg text-muted-foreground">{view === 'setup' ? 'إعداد البيانات' : 'الجولة التفاعلية'}</p>

            <button
              onClick={() => {
                if (confirm('هل أنت متأكد من رغبتك في حذف جميع البيانات وإعادة تعيين الأدوات؟')) {
                  resetAllData()
                }
              }}
              className="absolute top-0 left-0 text-xs text-destructive hover:bg-destructive/10 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
              data-tour="reset-btn"
            >
              <RotateCcw size={12} /> إعادة تعيين الكل
            </button>

            <button
              onClick={() => startTour(classroomToolsSteps)}
              className="absolute top-0 right-0 text-xs text-primary hover:bg-primary/10 px-3 py-1 rounded-full transition-colors flex items-center gap-1 animate-pulse"
            >
              <HelpCircle size={12} /> شرح الاستخدام
            </button>
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
            />
          )}

        </div>
      </main>
      <PrimaryFooter />
    </div>
  )
}
