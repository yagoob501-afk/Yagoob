"use client"

import { useState, useRef, useEffect } from "react"
import { Gift, RotateCcw, X, Edit2 } from "lucide-react"
import confetti from "canvas-confetti"

export interface RewardToolState {
  rewardsText: string
  currentReward: string | null
  excludedRewards: string[]
  isAnimating: boolean
}

interface RewardToolProps {
  state: RewardToolState
  setState: (updates: Partial<RewardToolState>) => void
}

export default function RewardTool({ state, setState }: RewardToolProps) {
  const { rewardsText, currentReward, excludedRewards, isAnimating } = state
  const [viewMode, setViewMode] = useState<'input' | 'list'>('input')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current && viewMode === 'input') {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.max(200, textareaRef.current.scrollHeight)}px`
    }
  }, [rewardsText, viewMode])

  const list = rewardsText.split("\n").map(r => r.trim()).filter(r => r !== "")
  const available = list.filter(r => !excludedRewards.includes(r))

  const pick = () => {
    if (available.length === 0) return
    setState({ isAnimating: true })
    let c = 0
    const int = setInterval(() => {
      setState({ currentReward: available[Math.floor(Math.random() * available.length)] })
      if (++c > 20) {
        clearInterval(int)
        setState({ isAnimating: false })
        confetti({ 
            particleCount: 200, 
            spread: 100, 
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF4500'] // Gold/Orange colors for rewards
        })
      }
    }, 80)
  }

  return (
    <div className="flex flex-col items-center p-6 sm:p-8 md:p-12 min-h-[500px]">
      {!currentReward ? (
        <div className="flex flex-col gap-6 w-full max-w-4xl">
          <div className="text-center">
            <Gift className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl sm:text-3xl font-bold">المكافأة</h2>
          </div>
          <div className="bg-white rounded-3xl border-2 border-border shadow-inner overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-b border-border bg-bg-layout/50">
              <span className="font-bold text-muted-foreground text-sm sm:text-base">
                {list.length} خيارات • {available.length} متاح • {excludedRewards.length} مستبعد
              </span>
              <div className="flex bg-bg-container rounded-xl p-1 border border-border">
                <button
                  onClick={() => setViewMode('input')}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${viewMode === 'input' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
                >
                  إدخال نصي
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
                >
                  القائمة
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[400px] overflow-auto">
              {viewMode === 'input' ? (
                <textarea
                  ref={textareaRef}
                  className="w-full text-base sm:text-lg bg-transparent border-none outline-none resize-none min-h-[200px]"
                  placeholder="اكتب الخيارات/المكافآت هنا، خيار في كل سطر..."
                  value={rewardsText}
                  onChange={e => setState({ rewardsText: e.target.value })}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setState({
                          excludedRewards: excludedRewards.includes(r)
                            ? excludedRewards.filter(x => x !== r)
                            : [...excludedRewards, r]
                        })
                      }}
                      className={`p-3 rounded-xl border-2 transition-all font-medium text-sm sm:text-base ${excludedRewards.includes(r)
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'bg-white border-border hover:shadow-md'
                        }`}
                    >
                      <span className={excludedRewards.includes(r) ? 'line-through' : ''}>{r}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={pick}
            disabled={available.length === 0}
            className="btn-primary w-full py-4 text-lg sm:text-xl rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Gift size={24} /> اختيار مكافأة
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 py-10 w-full max-w-2xl">
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-br from-yellow-300 to-yellow-500 text-white p-12 sm:p-16 rounded-[2.5rem] shadow-2xl border-4 border-white min-w-[300px] text-center transform hover:scale-105 transition-transform duration-300">
            {isAnimating ? "..." : currentReward}
          </div>
          {!isAnimating && (
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={pick}
                className="btn-primary px-8 sm:px-10 py-4 rounded-2xl flex items-center gap-2 text-base sm:text-lg"
              >
                <RotateCcw size={24} /> مرة أخرى
              </button>
              <button
                onClick={() => setState({ excludedRewards: [...excludedRewards, currentReward || ''] })}
                disabled={excludedRewards.includes(currentReward || '')}
                className="btn-destructive px-6 sm:px-8 py-4 rounded-2xl bg-red-500 text-white disabled:opacity-50 text-base sm:text-lg"
              >
                <X size={22} /> استبعاد
              </button>
              <button
                onClick={() => setState({ currentReward: null })}
                className="btn-outline px-6 sm:px-8 py-4 rounded-2xl border-border border-2 text-base sm:text-lg"
              >
                <Edit2 size={22} /> تعديل
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
