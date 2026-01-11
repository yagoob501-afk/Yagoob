"use client"

import { useState, useRef, useEffect } from "react"
import { Trash2, Maximize2, Minimize2, Fan } from "lucide-react"
import confetti from "canvas-confetti"
import WheelComponent from "./WheelComponent"

export interface WheelState {
  itemsText: string
  winner: string | null
}

interface WheelToolProps {
  state: WheelState
  setState: (updates: Partial<WheelState>) => void
}

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#F1948A"]

export default function WheelTool({ state, setState }: WheelToolProps) {
  const { itemsText, winner } = state
  const [isFullscreen, setIsFullscreen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Handle fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [itemsText])

  // Parse items
  const itemList = itemsText.split('\n').map(i => i.trim()).filter(i => i !== "")
  const hasEnoughItems = itemList.length >= 2

  const onFinished = (winnerItem: string) => {
    setState({ winner: winnerItem })
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const toggleFullscreen = () => {
    const elem = document.getElementById("wheel-tool-container")
    if (!document.fullscreenElement && elem) {
      elem.requestFullscreen().catch(err => console.error('Fullscreen error:', err))
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error('Exit fullscreen error:', err))
    }
  }

  return (
    <div
      id="wheel-tool-container"
      className={`flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 transition-all min-h-[600px] ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto bg-bg-layout' : 'relative'
        }`}
    >
      <div className="w-full max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Controls Area */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6 bg-white p-6 rounded-3xl border-2 border-border shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Fan className="w-6 h-6 animate-pulse" />
                <h2 className="text-xl font-bold">إعدادات العجلة</h2>
              </div>
              <p className="text-muted-foreground text-sm">أدخل الخيارات (خيار واحد في كل سطر)</p>
            </div>

            <textarea
              ref={textareaRef}
              className="w-full p-4 text-base rounded-2xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none bg-bg-layout min-h-[150px] max-h-[300px]"
              placeholder="طالب 1&#10;طالب 2&#10;طالب 3"
              value={itemsText}
              onChange={(e) => {
                setState({ itemsText: e.target.value, winner: null })
              }}
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setState({ itemsText: "", winner: null })
                }}
                className="btn-secondary w-full py-4 rounded-2xl border border-border hover:bg-white flex items-center justify-center gap-2"
              >
                < Trash2 size={20} /> مسح الكل
              </button>
            </div>

            <div className="text-xs text-muted-foreground bg-primary/5 p-4 rounded-xl border border-primary/10">
              <p className="font-bold mb-1">تعليمات:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>يجب إضافة عنصرين على الأقل.</li>
                <li>اضغط على زر البدأ في منتصف العجلة للبدء.</li>
                <li>العجلة تتجاوب مع تغيير الخيارات فوراً.</li>
              </ul>
            </div>

            {!hasEnoughItems && itemsText.trim() !== "" && (
              <p className="text-destructive text-sm text-center font-medium">أدخل عنصرين على الأقل</p>
            )}
          </div>

          {/* Wheel Area */}
          <div className="w-full lg:w-auto flex-1 flex flex-col items-center justify-center min-h-[500px]">
            {/* Winner Display */}
            {winner && (
              <div className="mb-6 animate-in fade-in zoom-in duration-500 w-full flex justify-center">
                <div className="px-8 py-4 bg-primary text-white rounded-full shadow-2xl font-bold text-2xl sm:text-3xl border-4 border-white flex items-center justify-center gap-3 text-center">
                  <Fan className="animate-spin flex-shrink-0" size={32} />
                  <span className="break-words">{winner}</span>
                </div>
              </div>
            )}

            {/* The Wheel Library Integration */}
            <div className="relative wheel-container overflow-visible flex items-center justify-center w-full max-w-[500px] mx-auto">
              {hasEnoughItems ? (
                <WheelComponent
                  segments={itemList}
                  segColors={COLORS}
                  onFinished={onFinished}
                  primaryColor="#3b82f6"
                  contrastColor="white"
                  buttonText="ابدأ"
                  isOnlyOnce={false}
                  size={250}
                  upDuration={1000}
                  downDuration={1000}
                  fontFamily="Cairo"
                />
              ) : (
                <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border-8 border-dashed border-border flex items-center justify-center bg-white/50">
                  <div className="text-center text-muted-foreground p-8">
                    <Fan className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-xl">أضف عناصر لعرض العجلة</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Toggle */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={toggleFullscreen}
          className="p-3 rounded-xl bg-white hover:bg-bg-layout border border-border shadow-sm text-muted-foreground hover:text-primary transition-all"
        >
          {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
        </button>
      </div>
    </div>
  )
}
