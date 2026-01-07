"use client"

import { useEffect, useState, useRef } from 'react'

export interface WheelComponentProps {
  segments: string[]
  segColors: string[]
  winningSegment?: string
  onFinished: (segment: string) => void
  primaryColor?: string
  contrastColor?: string
  buttonText?: string
  isOnlyOnce?: boolean
  size?: number
  upDuration?: number
  downDuration?: number
  fontFamily?: string
  fontSize?: string
  outlineWidth?: number
}

const WheelComponent = ({
  segments,
  segColors,
  winningSegment,
  onFinished,
  primaryColor = 'black',
  contrastColor = 'white',
  buttonText = 'Spin',
  isOnlyOnce = true,
  size = 250,
  upDuration = 100,
  downDuration = 1000,
  fontFamily = 'proxima-nova',
  fontSize = '1em',
  outlineWidth = 10
}: WheelComponentProps) => {
  const randomString = () => {
    const chars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('')
    const length = 8
    let str = ''
    for (let i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str
  }
  const canvasId = useRef(`canvas-${randomString()}`)
  const wheelId = useRef(`wheel-${randomString()}`)
  const dimension = (size + 20) * 2

  // Use refs for animation and drawing state to persist across renders
  const currentSegmentRef = useRef('')
  const isStartedRef = useRef(false)
  const timerHandleRef = useRef<number>(0)
  const angleCurrentRef = useRef(0)
  const angleDeltaRef = useRef(0)
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null)
  const spinStartRef = useRef(0)
  const framesRef = useRef(0)

  // Latest props refs to avoid stale closures in timers
  const segmentsRef = useRef(segments)
  const segColorsRef = useRef(segColors)
  const winningSegmentRef = useRef(winningSegment)

  const [isFinished, setFinished] = useState(false)

  const timerDelay = segments.length
  const upTime = segments.length * upDuration
  const downTime = segments.length * downDuration
  const centerX = size + 20
  const centerY = size + 20

  useEffect(() => {
    segmentsRef.current = segments
    segColorsRef.current = segColors
    winningSegmentRef.current = winningSegment
    wheelInit()
    return () => {
      if (timerHandleRef.current) clearInterval(timerHandleRef.current)
    }
  }, [segments, segColors, winningSegment])

  const wheelInit = () => {
    initCanvas()
    wheelDraw()
  }

  const initCanvas = () => {
    let canvas: HTMLCanvasElement | null = document.getElementById(
      canvasId.current
    ) as HTMLCanvasElement

    if (canvas) {
      // Remove old listener if re-initializing
      canvas.removeEventListener('click', spin)
      canvas.addEventListener('click', spin, false)
      canvasContextRef.current = canvas.getContext('2d')
    }
  }

  const spin = () => {
    isStartedRef.current = true
    if (timerHandleRef.current === 0) {
      spinStartRef.current = new Date().getTime()
      framesRef.current = 0
      timerHandleRef.current = window.setInterval(onTimerTick, timerDelay)
    }
  }

  const onTimerTick = () => {
    framesRef.current++
    draw()
    const duration = new Date().getTime() - spinStartRef.current
    let progress = 0
    let finished = false
    const currentSegments = segmentsRef.current
    const maxSpeed = Math.PI / currentSegments.length

    if (duration < upTime) {
      progress = duration / upTime
      angleDeltaRef.current = maxSpeed * Math.sin((progress * Math.PI) / 2)
    } else {
      if (winningSegmentRef.current) {
        if (currentSegmentRef.current === winningSegmentRef.current && framesRef.current > currentSegments.length) {
          progress = duration / upTime
          angleDeltaRef.current =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
          progress = 1
        } else {
          progress = duration / downTime
          angleDeltaRef.current =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
        }
      } else {
        progress = duration / downTime
        angleDeltaRef.current = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
      }
      if (progress >= 1) finished = true
    }

    angleCurrentRef.current += angleDeltaRef.current
    while (angleCurrentRef.current >= Math.PI * 2) angleCurrentRef.current -= Math.PI * 2
    if (finished) {
      setFinished(true)
      onFinished(currentSegmentRef.current)
      clearInterval(timerHandleRef.current)
      timerHandleRef.current = 0
      angleDeltaRef.current = 0
    }
  }

  const wheelDraw = () => {
    clear()
    drawWheel()
    drawNeedle()
  }

  const draw = () => {
    clear()
    drawWheel()
    drawNeedle()
  }

  const drawSegment = (key: number, lastAngle: number, angle: number) => {
    if (!canvasContextRef.current) return
    const ctx = canvasContextRef.current
    const currentSegments = segmentsRef.current
    const currentSegColors = segColorsRef.current
    const value = currentSegments[key]
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, size, lastAngle, angle, false)
    ctx.lineTo(centerX, centerY)
    ctx.closePath()
    ctx.fillStyle = currentSegColors[key % currentSegColors.length]
    ctx.fill()
    ctx.stroke()
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((lastAngle + angle) / 2)
    ctx.fillStyle = contrastColor
    ctx.font = `bold ${fontSize} ${fontFamily}`
    ctx.fillText(value.substring(0, 21), size / 2 + 20, 0)
    ctx.restore()
  }

  const drawWheel = () => {
    if (!canvasContextRef.current) return
    const ctx = canvasContextRef.current
    let lastAngle = angleCurrentRef.current
    const currentSegments = segmentsRef.current
    const len = currentSegments.length
    const PI2 = Math.PI * 2
    ctx.lineWidth = 1
    ctx.strokeStyle = primaryColor
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = '1em ' + fontFamily
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrentRef.current
      drawSegment(i - 1, lastAngle, angle)
      lastAngle = angle
    }

    // Draw a center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 50, 0, PI2, false)
    ctx.closePath()
    ctx.fillStyle = primaryColor
    ctx.lineWidth = 10
    ctx.strokeStyle = contrastColor
    ctx.fill()
    ctx.font = 'bold 1em ' + fontFamily
    ctx.fillStyle = contrastColor
    ctx.textAlign = 'center'
    ctx.fillText(buttonText, centerX, centerY + 3)
    ctx.stroke()

    // Draw outer circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, size, 0, PI2, false)
    ctx.closePath()

    ctx.lineWidth = outlineWidth
    ctx.strokeStyle = primaryColor
    ctx.stroke()
  }

  const drawNeedle = () => {
    if (!canvasContextRef.current) return
    const ctx = canvasContextRef.current
    ctx.lineWidth = 1
    ctx.strokeStyle = contrastColor
    ctx.fillStyle = contrastColor
    ctx.beginPath()
    ctx.moveTo(centerX + 20, centerY - 50)
    ctx.lineTo(centerX - 20, centerY - 50)
    ctx.lineTo(centerX, centerY - 70)
    ctx.closePath()
    ctx.fill()
    const change = angleCurrentRef.current + Math.PI / 2
    const currentSegments = segmentsRef.current
    let i =
      currentSegments.length -
      Math.floor((change / (Math.PI * 2)) * currentSegments.length) -
      1
    if (i < 0) i = i + currentSegments.length
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = primaryColor
    ctx.font = 'bold 1.5em ' + fontFamily
    currentSegmentRef.current = currentSegments[i]
    isStartedRef.current && ctx.fillText(currentSegmentRef.current, centerX + 10, centerY + size + 50)
  }

  const clear = () => {
    if (!canvasContextRef.current) return
    const ctx = canvasContextRef.current
    ctx.clearRect(0, 0, dimension, dimension)
  }

  return (
    <div id={wheelId.current}>
      <canvas
        id={canvasId.current}
        width={dimension}
        height={dimension}
        style={{
          pointerEvents: isFinished && isOnlyOnce ? 'none' : 'auto'
        }}
      />
    </div>
  )
}

export default WheelComponent
