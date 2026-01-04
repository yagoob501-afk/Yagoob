"use client"

import { useState, useEffect, useRef } from "react"
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
  const [scale, setScale] = useState(1)
  const [contentHeight, setContentHeight] = useState<number | string>('auto')
  const contentRef = useRef<HTMLDivElement>(null)

  // Dynamic scale and height logic
  useEffect(() => {
    const updateLayout = () => {
      const screenWidth = window.innerWidth
      const baseWidth = 800
      const availableWidth = screenWidth - 48
      const newScale = Math.min(availableWidth / baseWidth, 1)
      setScale(newScale)

      if (contentRef.current && !isFullscreen) {
        setContentHeight(contentRef.current.scrollHeight * newScale)
      } else {
        setContentHeight('auto')
      }
    }
    updateLayout()
    const t = setTimeout(updateLayout, 150)
    window.addEventListener('resize', updateLayout)
    return () => { window.removeEventListener('resize', updateLayout); clearTimeout(t); }
  }, [isFullscreen, isEditing, state.timeLeft, state.isFinished])

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
    const m = type === 'm' ? v : minutes; const s = type === 's' ? v : seconds
    const tot = m * 60 + s
    setState({ minutes: m, seconds: s, timeLeft: tot, totalTime: tot, isRunning: false, isFinished: false })
  }

  const toggleFullscreen = () => {
    const el = document.getElementById("timer-tool-container")
    if (!document.fullscreenElement) { el?.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  }

  const formatTime = (t: number) => `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0
  const colors = timeLeft / totalTime > 0.66 ? ['#10B981', '#059669', '#047857'] : timeLeft / totalTime > 0.33 ? ['#F59E0B', '#D97706', '#B45309'] : ['#EF4444', '#DC2626', '#B91C1C']

  return (
    <div id="timer-tool-container" className={`flex flex-col items-center p-4 transition-all ${isFullscreen ? 'bg-bg-layout' : ''}`} style={{ height: isFullscreen ? '100vh' : contentHeight }}>
      <div ref={contentRef} style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: '800px' }} className="flex flex-col items-center">
        {!isEditing ? (
          <div className="flex flex-col items-center gap-6 p-4">
            <div className="relative w-80 h-80 flex items-center justify-center">
              {!isFinished ? (
                <>
                  <svg className="w-full h-full -rotate-90 absolute">
                    <circle cx="160" cy="160" r="140" stroke="#eee" strokeWidth="8" fill="none" className="opacity-20" />
                    <circle cx="160" cy="160" r="140" stroke={colors[1]} strokeWidth="12" fill="none" strokeDasharray={879.6} strokeDashoffset={879.6 - (progress / 100) * 879.6} strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute flex flex-col items-center gap-4">
                    <span className="text-7xl font-mono font-bold">{formatTime(timeLeft)}</span>
                    {isRunning && <button onClick={() => setState({ isRunning: false })} className="px-6 py-2 bg-white/90 rounded-full shadow flex items-center gap-2 text-sm"><Pause size={18} /> إيقاف مؤقت</button>}
                  </div>
                </>
              ) : (
                <div className="text-center animate-pulse">
                  <Bell size={120} className="text-destructive animate-[swing_0.5s_infinite] mx-auto" />
                  <span className="text-4xl font-bold text-destructive block mt-4">انتهى الوقت!</span>
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-4">
              {isFinished ? <button onClick={() => { stopAlarm() }} className="btn-destructive px-10 py-4 rounded-full shadow-lg flex items-center gap-2"><Bell size={24} /> إيقاف المنبه</button> :
                <><button onClick={toggleTimer} className="btn-primary px-10 py-4 rounded-full shadow-lg flex items-center gap-2">{isRunning ? <Pause size={24} /> : <Play size={24} />} {isRunning ? "إيقاف" : "بدء"}</button>
                  <button onClick={resetTimer} className="btn-secondary px-8 py-4 rounded-full border border-border flex items-center gap-2"><RotateCcw size={22} /> إعادة</button>
                  <button onClick={() => setIsEditing(true)} className="btn-outline px-6 py-4 rounded-full border border-border flex items-center gap-1">وقت آخر</button></>}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 p-8 w-full max-w-md">
            <div className="text-center"><Clock className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" /><h2 className="text-3xl font-bold">ضبط المؤقّت</h2></div>
            <div className="flex gap-6 justify-center items-center bg-white p-8 rounded-[2rem] border-2 border-border shadow-inner">
              <div className="text-center"><label className="block text-sm font-bold mb-2">دقائق</label><input type="number" value={minutes} onChange={(e) => handleTimeChange('m', parseInt(e.target.value) || 0)} className="w-24 h-24 text-4xl text-center rounded-2xl border-2 border-border focus:border-primary outline-none" /></div>
              <div className="text-3xl font-bold mt-6">:</div>
              <div className="text-center"><label className="block text-sm font-bold mb-2">ثواني</label><input type="number" value={seconds} onChange={(e) => handleTimeChange('s', parseInt(e.target.value) || 0)} className="w-24 h-24 text-4xl text-center rounded-2xl border-2 border-border focus:border-primary outline-none" /></div>
            </div>
            <button onClick={toggleTimer} className="btn-primary w-full py-4 text-xl rounded-2xl shadow-lg">بدء المؤقت</button>
          </div>
        )}
      </div>
      {!isFullscreen && <button onClick={toggleFullscreen} className="absolute top-4 right-4 p-2 bg-white/50 rounded-lg"><Maximize2 size={20} /></button>}
    </div>
  )
}
