"use client"

import * as React from "react"
import { MemoryGameLogic, type Question } from "@/lib/MemoryGameLogic"
import { MemorySetupView } from "./components/memory/MemorySetupView"
import { MemoryRoundView } from "./components/memory/MemoryRoundView"
import { LayoutGroup } from "framer-motion"

const STORAGE_KEY = "memory_strong_game_state"

export default function MemoryGame() {
  const [logic, setLogic] = React.useState<MemoryGameLogic>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          return MemoryGameLogic.fromJSON(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to load Memory game state:", e)
        }
      }
    }
    return new MemoryGameLogic()
  })

  const [view, setView] = React.useState<'setup' | 'round'>(() => {
    return logic.getState().status === 'setup' ? 'setup' : 'round'
  })

  // Persistence
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logic.toJSON()))
  }, [logic])

  const handleStartGame = (greenName: string, blueName: string) => {
    logic.setTeamInfo(greenName, blueName, 'emerald', 'sky')
    logic.prepareGame()
    setLogic(new MemoryGameLogic(logic.getState().questions, logic.getState().matrix))
    // We need to re-initialize or reset explicitly
    const newLogic = MemoryGameLogic.fromJSON(logic.toJSON())
    newLogic.prepareGame()
    setLogic(newLogic)
    setView('round')
  }

  const handleUpdateQuestions = (questions: Question[]) => {
    logic.setQuestions(questions)
    setLogic(MemoryGameLogic.fromJSON(logic.toJSON()))
  }

  const handleUpdateMatrix = (count: number) => {
    logic.setMatrixByCount(count)
    setLogic(MemoryGameLogic.fromJSON(logic.toJSON()))
  }

  const handleClearData = () => {
    const newLogic = new MemoryGameLogic()
    setLogic(newLogic)
    setView('setup')
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-base relative overflow-x-hidden selection:bg-primary/30">
      <LayoutGroup>
        <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
          {view === 'setup' ? (
            <MemorySetupView
              questions={logic.getState().questions}
              matrix={logic.getState().matrix}
              onUpdateQuestions={handleUpdateQuestions}
              onUpdateMatrix={handleUpdateMatrix}
              onStartGame={handleStartGame}
              onClearData={handleClearData}
            />
          ) : (
            <MemoryRoundView
              gameLogic={logic}
              onBack={() => {
                logic.prepareGame() // Keep setup state but reset game
                setView('setup')
              }}
            />
          )}
        </div>
      </LayoutGroup>

      {/* Global Background (Cognitive Prism) */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-prism/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary-prism/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10" />
      </div>
    </div>
  )
}
