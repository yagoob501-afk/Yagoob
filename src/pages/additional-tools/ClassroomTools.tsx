"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Dices, Users, Fan, Bell } from "lucide-react"

import TimerTool, { type TimerState } from "./components/TimerTool"
import QuestionTool, { type QuestionToolState } from "./components/QuestionTool"
import RandomStudentTool, { type RandomStudentState } from "./components/RandomStudentTool"
import WheelTool, { type WheelState } from "./components/WheelTool"
import PrimaryHeader from "@/components/sections/Header/PrimaryHeader"
import PrimaryFooter from "@/components/sections/Footer/PrimaryFooter"

export default function ClassroomToolsPage() {
  // --- Master States ---
  const [timerState, setTimerState] = useState<TimerState>({
    minutes: 0,
    seconds: 0,
    timeLeft: 0,
    totalTime: 0,
    isRunning: false,
    isFinished: false
  })

  const [questionState, setQuestionState] = useState<QuestionToolState>({
    questions: "",
    currentQuestion: null,
    isAnimating: false
  })

  const [studentState, setStudentState] = useState<RandomStudentState>({
    studentsText: "",
    excludedStudents: [],
    currentStudent: null,
    isAnimating: false
  })

  const [wheelState, setWheelState] = useState<WheelState>({
    itemsText: "",
    spinning: false,
    rotation: 0,
    winner: null
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Global Timer Logic (Persistent)
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
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerState.isRunning, timerState.timeLeft])

  // Alarm Sound Manager
  useEffect(() => {
    if (timerState.isFinished && !audioRef.current) {
      const audio = new Audio('/sounds/alarm.mp3')
      audio.loop = true
      audio.play().catch(err => console.log('Audio wait interaction:', err))
      audioRef.current = audio
    }
  }, [timerState.isFinished])

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setTimerState(prev => ({ ...prev, isFinished: false }))
  }

  // --- Navigation ---
  const tabs = [
    { id: "timer", label: "المؤقّت", icon: Clock },
    { id: "question", label: "سؤال عشوائي", icon: Dices },
    { id: "student", label: "طالب عشوائي", icon: Users },
    { id: "wheel", label: "العجلة", icon: Fan },
  ]
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  const getGradientColors = () => {
    if (timerState.isFinished) return ['#EF4444', '#DC2626', '#B91C1C']
    const percentage = (timerState.timeLeft / timerState.totalTime) * 100
    if (percentage > 66) return ['#10B981', '#059669', '#047857']
    if (percentage > 33) return ['#F59E0B', '#D97706', '#B45309']
    return ['#EF4444', '#DC2626', '#B91C1C']
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-layout rtl text-right">
      <PrimaryHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center">

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-heading mb-3">أدوات الصف التفاعلية</h1>
            <p className="text-lg text-muted-foreground">وسائل ذكية لتعزيز الحماس والتفاعل التعليمي</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10 bg-white p-2 rounded-3xl shadow-sm border border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 rounded-2xl font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-transparent text-muted-foreground hover:bg-bg-layout'
                    }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tool Container */}
          <div className="w-full bg-white rounded-[2.5rem] shadow-xl border border-border overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "timer" && (
                  <TimerTool
                    state={timerState}
                    setState={(u) => setTimerState(p => ({ ...p, ...u }))}
                    stopAlarm={stopAlarm}
                  />
                )}
                {activeTab === "question" && (
                  <QuestionTool
                    state={questionState}
                    setState={(u) => setQuestionState(p => ({ ...p, ...u }))}
                  />
                )}
                {activeTab === "student" && (
                  <RandomStudentTool
                    state={studentState}
                    setState={(u) => setStudentState(p => ({ ...p, ...u }))}
                  />
                )}
                {activeTab === "wheel" && (
                  <WheelTool
                    state={wheelState}
                    setState={(u) => setWheelState(p => ({ ...p, ...u }))}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mini Widget */}
          {activeTab !== "timer" && (timerState.isRunning || timerState.isFinished || (timerState.timeLeft > 0 && timerState.timeLeft < timerState.totalTime)) && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="fixed bottom-10 right-10 z-[100] cursor-pointer"
              onClick={() => setActiveTab("timer")}
            >
              <div className={`p-4 bg-white rounded-3xl shadow-2xl border-2 flex items-center gap-4 ${timerState.isFinished ? 'border-destructive animate-pulse' : 'border-primary/20'}`}>
                {timerState.isFinished ? (
                  <>
                    <Bell size={40} className="text-destructive animate-[swing_0.5s_infinite]" />
                    <div className="flex flex-col"><span className="font-bold text-destructive">انتهى الوقت!</span><span className="text-xs">اضغط للإيقاف</span></div>
                  </>
                ) : (
                  <>
                    <div className="relative w-12 h-12">
                      <svg className="w-full h-full -rotate-90"><circle cx="24" cy="24" r="20" stroke="#eee" strokeWidth="4" fill="none" /><circle cx="24" cy="24" r="20" stroke={getGradientColors()[0]} strokeWidth="4" fill="none" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * (timerState.timeLeft / timerState.totalTime))} strokeLinecap="round" /></svg>
                      <Clock size={16} className="absolute inset-0 m-auto text-primary" />
                    </div>
                    <div className="flex flex-col"><span className="font-bold">المؤقت</span><span className="font-mono text-sm">{Math.floor(timerState.timeLeft / 60)}:{String(timerState.timeLeft % 60).padStart(2, '0')}</span></div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <PrimaryFooter />
    </div>
  )
}
