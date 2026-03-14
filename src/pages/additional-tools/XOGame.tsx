"use client"

import * as React from "react"
import { XOGameLogic, type Question } from "@/lib/XOGameLogic"
import { XOSetupView } from "./components/xo/XOSetupView"
import { XORoundView } from "./components/xo/XORoundView"
// maybe a dead code
// import * as TOON from "@toon-format/toon"

export default function XOGamePage() {
  const [view, setView] = React.useState<'setup' | 'round'>('setup')
  // maybe a dead code
  // const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Game instance held in ref to persist across re-renders
  const gameRef = React.useRef(new XOGameLogic())
  const [questions, setQuestions] = React.useState<Question[]>([])

  // Load initial state
  React.useEffect(() => {
    const saved = localStorage.getItem('xo_game_data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        gameRef.current = XOGameLogic.fromJSON(data)
        setQuestions(gameRef.current.getQuestions())
      } catch (e) {
        console.error("Failed to load saved game", e)
      }
    }
  }, [])

  // Save to local storage whenever questions change
  React.useEffect(() => {
    localStorage.setItem('xo_game_data', JSON.stringify(gameRef.current.toJSON()))
  }, [questions])

  const handleUpdateQuestions = (newQuestions: Question[]) => {
    gameRef.current.setQuestions(newQuestions)
    setQuestions([...newQuestions]) // Trigger re-render
  }

  // maybe a dead code
  /*
  const handleExportTOON = () => {
    const data = gameRef.current.toJSON()
    try {
      const toonString = TOON.encode(data)
      const blob = new Blob([toonString], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `xo_game_${new Date().toISOString().split('T')[0]}.toon`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export failed", err)
      alert("فشل تصدير الملف.")
    }
  }

  const handleImportTOON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const decoded = TOON.decode(content)
        gameRef.current = XOGameLogic.fromJSON(decoded)
        setQuestions(gameRef.current.getQuestions())
        alert("تم استيراد الملف بنجاح!")
      } catch (err) {
        console.error("Import failed", err)
        alert("فشل استيراد الملف. تأكد من أنه ملف .toon صالح.")
      }
    }
    reader.readAsText(file)
    // Clear input
    e.target.value = ''
  }
  */

  return (
    <div className="min-h-screen bg-bg-layout rtl text-right py-12 px-4">
      <div className="container mx-auto flex flex-col items-center">
        {view === 'setup' ? (
          <XOSetupView
            questions={questions}
            onUpdateQuestions={handleUpdateQuestions}
            onStartGame={(_timerSeconds, greenName, blueName) => {
              // maybe a dead code
              // gameRef.current.setTimers(timerSeconds, timerSeconds)
              gameRef.current.setTeamInfo(greenName, blueName, 'emerald', 'sky') // Default colors
              gameRef.current.prepareGame()
              setView('round')
            }}
            onClearData={() => {
              gameRef.current = new XOGameLogic()
              setQuestions([])
              localStorage.removeItem('xo_game_data')
            }}
          />
        ) : (
          <XORoundView
            gameLogic={gameRef.current}
            onBack={() => setView('setup')}
          />
        )}
      </div>

      {/* maybe a dead code
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportTOON}
        accept=".toon"
        className="hidden"
      />
      */}
    </div>
  )
}
