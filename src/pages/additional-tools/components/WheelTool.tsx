"use client"

import { useState, useRef, useEffect } from "react"
import { Trash2, Maximize2, Minimize2, Fan, Play } from "lucide-react"
import confetti from "canvas-confetti"

export interface WheelState {
  itemsText: string
  spinning: boolean
  rotation: number
  winner: string | null
}

interface WheelToolProps {
  state: WheelState
  setState: (updates: Partial<WheelState>) => void
}

export default function WheelTool({ state, setState }: WheelToolProps) {
  const { itemsText, spinning, rotation, winner } = state
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [scale, setScale] = useState(1)

  // Responsive scaling based on core logic
  useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth
      const baseWidth = 1000 // Width design base
      const padding = 32
      const availableWidth = screenWidth - padding
      const newScale = Math.min(availableWidth / baseWidth, 1)
      setScale(newScale)
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.max(150, textareaRef.current.scrollHeight)}px`
    }
  }, [itemsText])

  // Parse items
  const itemList = itemsText.split('\n').map(i => i.trim()).filter(i => i !== "")
  const hasEnoughItems = itemList.length >= 2

  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#F1948A"]

  useEffect(() => {
    drawWheel()
  }, [itemList])

  const drawWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = 500
    canvas.width = size
    canvas.height = size
    const center = size / 2
    const radius = size / 2 - 10

    ctx.clearRect(0, 0, size, size)

    if (itemList.length === 0) {
      ctx.fillStyle = "#f3f4f6"
      ctx.beginPath()
      ctx.arc(center, center, radius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = "#9ca3af"
      ctx.font = "24px Cairo"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("أضف عناصر للبدء", center, center)
      return
    }

    const sliceAngle = (2 * Math.PI) / itemList.length
    itemList.forEach((item, index) => {
      const startAngle = index * sliceAngle
      const endAngle = (index + 1) * sliceAngle

      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.arc(center, center, radius, startAngle, endAngle)
      ctx.fillStyle = colors[index % colors.length]
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.save()
      ctx.translate(center, center)
      ctx.rotate(startAngle + sliceAngle / 2)
      ctx.textAlign = "right"
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 18px Cairo"
      const displayText = item.length > 15 ? item.substring(0, 15) + "..." : item
      ctx.fillText(displayText, radius - 30, 10)
      ctx.restore()
    })
  }

  const spin = () => {
    if (!hasEnoughItems || spinning) return
    setState({ spinning: true, winner: null })

    const spins = 5 + Math.random() * 5
    const newRotation = rotation + spins * 360 + Math.random() * 360
    setState({ rotation: newRotation })

    setTimeout(() => {
      setState({ spinning: false })
      const normalizedRotation = newRotation % 360
      const segmentAngle = 360 / itemList.length
      const effectiveAngle = (360 - normalizedRotation % 360) % 360
      const winningIndex = Math.floor(effectiveAngle / segmentAngle)
      setState({ winner: itemList[winningIndex % itemList.length] })

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }, 5000)
  }

  const toggleFullscreen = () => {
    const elem = document.getElementById("wheel-tool-container");
    if (!document.fullscreenElement && elem) {
      elem.requestFullscreen().catch(err => console.error(err))
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  return (
    <div id="wheel-tool-container" className={`flex flex-col items-center justify-center p-4 bg-bg-layout transition-all ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto bg-bg-layout' : 'relative min-h-[600px]'}`}>

      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: '1000px'
        }}
        className="flex flex-col md:flex-row gap-8 items-center justify-center"
      >
        {/* Controls Area */}
        <div className="w-[400px] flex flex-col gap-6 bg-white p-6 rounded-3xl border-2 border-border shadow-sm">
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
            onChange={(e) => setState({ itemsText: e.target.value })}
            disabled={spinning}
          />

          <div className="flex gap-3">
            <button
              onClick={spin}
              disabled={spinning || !hasEnoughItems}
              className="btn-primary flex-1 py-4 text-lg font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {spinning ? <Fan className="animate-spin" /> : <Play />}
              {spinning ? "جاري التدوير..." : "تدوير العجلة"}
            </button>
            <button
              onClick={() => setState({ itemsText: "", winner: null })}
              disabled={spinning}
              className="btn-secondary px-4 rounded-2xl border border-border hover:bg-white"
            >
              <Trash2 size={24} />
            </button>
          </div>

          {!hasEnoughItems && itemsText.trim() !== "" && (
            <p className="text-destructive text-sm text-center font-medium">أدخل عنصرين على الأقل</p>
          )}
        </div>

        {/* Wheel Area */}
        <div className="w-[550px] flex flex-col items-center justify-center relative">
          {/* Winner Display */}
          {winner && !spinning && (
            <div className="absolute -top-10 z-20 animate-in fade-in zoom-in duration-500">
              <div className="px-8 py-3 bg-primary text-white rounded-full shadow-2xl font-bold text-3xl border-4 border-white flex items-center gap-3">
                <Fan className="animate-spin" />
                {winner}
              </div>
            </div>
          )}

          <div
            className={`relative w-[500px] h-[500px] flex items-center justify-center ${hasEnoughItems && !spinning ? 'cursor-pointer hover:scale-[1.02] transition-transform' : ''}`}
            onClick={() => !spinning && hasEnoughItems && spin()}
          >
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10 pointer-events-none">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-destructive filter drop-shadow-md"></div>
            </div>

            {/* Visual Wheel */}
            <div
              className="w-[460px] h-[460px] rounded-full border-[10px] border-white shadow-2xl relative transition-transform cubic-bezier(0.15, 0, 0.15, 1) overflow-hidden"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionDuration: spinning ? '5000ms' : '0ms'
              }}
            >
              <canvas ref={canvasRef} className="w-full h-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-inner border-4 border-border z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Fullscreen Toggle */}
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
