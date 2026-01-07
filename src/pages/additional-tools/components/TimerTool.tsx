"use client"

import { useState } from "react"
import { Play, Pause, RotateCcw, Maximize2, Clock, Bell } from "lucide-react"

export interface TimerState {
  minutes: number
  seconds: number
  timeLeft: number
  totalTime: number
  isRunning: boolean
  isFinished: boolean
}

interface TimerToolProps {
  state: TimerState
  setState: (newState: Partial<TimerState>) => void
  stopAlarm: () => void
}

export default function TimerTool({ state, setState, stopAlarm }: TimerToolProps) {
  const { minutes, seconds, timeLeft, isRunning, isFinished, totalTime } = state
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isEditing, setIsEditing] = useState(!isRunning && !isFinished && timeLeft === totalTime)

  const toggleTimer = () => {
    if (isFinished) { stopAlarm(); return; }
    setState({ isRunning: !isRunning, isFinished: false })
    setIsEditing(false)
  }

  const resetTimer = () => {
    stopAlarm()
    setState({ timeLeft: minutes * 60 + seconds, totalTime: minutes * 60 + seconds, isRunning: false, isFinished: false })
    setIsEditing(false)
  }

  const handleTimeChange = (type: 'm' | 's', v: number) => {
    const m = type === 'm' ? v : minutes
    const s = type === 's' ? v : seconds
    const tot = m * 60 + s
    setState({ minutes: m, seconds: s, timeLeft: tot, totalTime: tot, isRunning: false, isFinished: false })
  }

  const toggleFullscreen = () => {
    const el = document.getElementById("timer-tool-container")
    if (!document.fullscreenElement) {
      el?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (t: number) => `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0
  const colors = timeLeft / totalTime > 0.66 ? ['#10B981', '#059669', '#047857'] : timeLeft / totalTime > 0.33 ? ['#F59E0B', '#D97706', '#B45309'] : ['#EF4444', '#DC2626', '#B91C1C']

  return (
    <div
      id="timer-tool-container"
      className={`flex flex-col items-center p-6 sm:p-8 md:p-12 min-h-[600px] transition-all ${isFullscreen ? 'bg-bg-layout fixed inset-0 z-50' : ''}`}
    >
      {!isEditing ? (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
          <div className="relative w-full max-w-[320px] sm:max-w-[400px] aspect-square flex items-center justify-center">
            {!isFinished ? (
              <>
                <svg className="w-full h-full -rotate-90 absolute">
                  <circle cx="50%" cy="50%" r="45%" stroke="#eee" strokeWidth="8" fill="none" className="opacity-20" />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke={colors[1]}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="283%"
                    strokeDashoffset={`${283 - (progress / 100) * 283}%`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute flex flex-col items-center gap-4">
                  <span className="text-5xl sm:text-6xl md:text-7xl font-mono font-bold">{formatTime(timeLeft)}</span>
                  {isRunning && (
                    <button
                      onClick={() => setState({ isRunning: false })}
                      className="px-4 sm:px-6 py-2 bg-white/90 rounded-full shadow flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Pause size={18} /> إيقاف مؤقت
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center animate-pulse">
                <Bell size={100} className="sm:w-[120px] sm:h-[120px] text-destructive animate-[swing_0.5s_infinite] mx-auto" />
                <span className="text-3xl sm:text-4xl font-bold text-destructive block mt-4">انتهى الوقت!</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mt-4">
            {isFinished ? (
              <button
                onClick={() => { stopAlarm() }}
                className="btn-destructive px-8 sm:px-10 py-4 rounded-full shadow-lg flex items-center gap-2 text-base sm:text-lg"
              >
                <Bell size={24} /> إيقاف المنبه
              </button>
            ) : (
              <>
                <button
                  onClick={toggleTimer}
                  className="btn-primary px-8 sm:px-10 py-4 rounded-full shadow-lg flex items-center gap-2 text-base sm:text-lg"
                >
                  {isRunning ? <Pause size={24} /> : <Play size={24} />} {isRunning ? "إيقاف" : "بدء"}
                </button>
                <button
                  onClick={resetTimer}
                  className="btn-secondary px-6 sm:px-8 py-4 rounded-full border border-border flex items-center gap-2 text-base sm:text-lg"
                >
                  <RotateCcw size={22} /> إعادة
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-outline px-5 sm:px-6 py-4 rounded-full border border-border flex items-center gap-1 text-base sm:text-lg"
                >
                  وقت آخر
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-md">
          <div className="text-center">
            <Clock className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-bold">ضبط المؤقّت</h2>
          </div>
          <div className="flex gap-4 sm:gap-6 justify-center items-center bg-white p-6 sm:p-8 rounded-[2rem] border-2 border-border shadow-inner">
            <div className="text-center">
              <label className="block text-sm font-bold mb-2">دقائق</label>
              <input
                type="number"
                value={minutes}
                onChange={(e) => handleTimeChange('m', parseInt(e.target.value) || 0)}
                className="w-20 h-20 sm:w-24 sm:h-24 text-3xl sm:text-4xl text-center rounded-2xl border-2 border-border focus:border-primary outline-none"
              />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mt-6">:</div>
            <div className="text-center">
              <label className="block text-sm font-bold mb-2">ثواني</label>
              <input
                type="number"
                value={seconds}
                onChange={(e) => handleTimeChange('s', parseInt(e.target.value) || 0)}
                className="w-20 h-20 sm:w-24 sm:h-24 text-3xl sm:text-4xl text-center rounded-2xl border-2 border-border focus:border-primary outline-none"
              />
            </div>
          </div>
          <button
            onClick={toggleTimer}
            className="btn-primary w-full py-4 text-lg sm:text-xl rounded-2xl shadow-lg"
          >
            بدء المؤقت
          </button>
        </div>
      )}
      {!isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 p-2 bg-white/50 rounded-lg hover:bg-white transition-colors"
        >
          <Maximize2 size={20} />
        </button>
      )}
    </div>
  )
}
