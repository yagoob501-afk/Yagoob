"use client"

import type { TimerState } from "./TimerTool"
import type { RandomStudentState } from "./RandomStudentTool"
import type { QuestionToolState, QuestionItem } from "./QuestionTool"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { Image as ImageIcon, Play, Pause, SkipForward, RotateCcw, HelpCircle, Dices, Users } from "lucide-react"
import { useState } from "react"

interface ActiveSessionToolProps {
  timerState: TimerState
  setTimerState: (updates: Partial<TimerState>) => void
  studentState: RandomStudentState
  setStudentState: (updates: Partial<RandomStudentState>) => void
  questionState: QuestionToolState
  setQuestionState: (updates: Partial<QuestionToolState>) => void
  onNext: () => void
  onRestart: () => void
}

export default function ActiveSessionTool({
  timerState,
  setTimerState,
  studentState,
  setStudentState,
  questionState,
  setQuestionState,
  onNext,
  onRestart
}: ActiveSessionToolProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const pickAllAndStart = () => {
    // Pick Student if not already picked
    if (!studentState.currentStudent) {
      const studentsList = studentState.studentsText.split("\n").map(s => s.trim()).filter(s => s !== "")
      const availableStudents = studentsList.filter(s => !studentState.excludedStudents.includes(s))
      if (availableStudents.length > 0) {
        const randomStudent = availableStudents[Math.floor(Math.random() * availableStudents.length)]
        setStudentState({ currentStudent: randomStudent })
      }
    }

    // Pick Question if not already picked
    if (!questionState.currentQuestion) {
      const mode = questionState.mode || 'text'
      let available: any[] = []

      if (mode === 'text') {
        const list = questionState.questions.split("\n").map(q => q.trim()).filter(q => q !== "")
        available = list.filter(q => !questionState.excludedQuestions.includes(q))
      } else {
        available = questionState.questionItems.filter(i => !questionState.excludedQuestionItems.includes(i.id))
      }

      if (available.length > 0) {
        setQuestionState({ currentQuestion: available[Math.floor(Math.random() * available.length)] })
      }
    }

    // Start Timer
    if (timerState.totalTime > 0) {
      setTimerState({ isRunning: true, isFinished: false, timeLeft: timerState.totalTime })
    }
  }

  const formatTime = (t: number) => `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`
  const progress = timerState.totalTime > 0 ? ((timerState.totalTime - timerState.timeLeft) / timerState.totalTime) * 100 : 0
  const colors = timerState.timeLeft / timerState.totalTime > 0.66 ? ['#10B981', '#059669', '#047857'] : timerState.timeLeft / timerState.totalTime > 0.33 ? ['#F59E0B', '#D97706', '#B45309'] : ['#EF4444', '#DC2626', '#B91C1C']


  const hasStarted = timerState.isRunning || timerState.timeLeft < timerState.totalTime || timerState.isFinished

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 min-h-[500px] w-full max-w-5xl mx-auto gap-8">

      {!hasStarted && !studentState.currentStudent && !questionState.currentQuestion ? (
        <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-primary">الجولة النشطة</h2>
            <p className="text-muted-foreground">اضغط ابدأ لاختيار طالب وسؤال وبدء المؤقت معاً</p>
          </div>

          <button
            onClick={pickAllAndStart}
            className="btn-primary px-12 py-6 rounded-[2rem] text-2xl font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-4 animate-bounce"
          >
            <Play size={32} fill="currentColor" /> ابدأ الجولة
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-8 animate-in slide-in-from-bottom duration-500">

          <div className="flex flex-col gap-6 w-full">
            {/* Question Card - FULL WIDTH TOP */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-border flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden group min-h-[250px]">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <HelpCircle size={150} />
              </div>
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider bg-gray-50 px-4 py-1 rounded-full border border-border">السؤال</span>

              <div className="w-full flex-1 flex flex-col items-center justify-center gap-6">
                {questionState.currentQuestion ? (
                  typeof questionState.currentQuestion === 'string' ? (
                    <h3 className="text-2xl md:text-4xl font-bold text-gray-800 break-words max-w-4xl leading-relaxed">
                      {questionState.currentQuestion}
                    </h3>
                  ) : (
                    <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
                      {questionState.currentQuestion.text && (
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 break-words leading-relaxed">
                          {questionState.currentQuestion.text}
                        </h3>
                      )}
                      {questionState.currentQuestion.image && (
                        <div className="relative group cursor-pointer" onClick={() => setLightboxOpen(true)}>
                          <img src={questionState.currentQuestion.image} className="max-h-[200px] w-auto rounded-2xl border-2 border-border shadow-md transition-all" alt="Question" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 flex items-center justify-center transition-colors rounded-2xl">
                            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <h3 className="text-2xl md:text-4xl font-bold text-gray-300">لم يتم اختيار سؤال</h3>
                )}
              </div>

              <div className="flex flex-wrap gap-2 justify-center z-10">
                {!timerState.isRunning && (
                  <button
                    onClick={() => {
                      const mode = questionState.mode || 'text'
                      let available: any[] = []
                      if (mode === 'text') {
                        const list = questionState.questions.split("\n").map(q => q.trim()).filter(q => q !== "")
                        available = list.filter(q => !questionState.excludedQuestions.includes(q))
                      } else {
                        available = questionState.questionItems.filter(i => !questionState.excludedQuestionItems.includes(i.id))
                      }

                      if (available.length > 0) {
                        setQuestionState({ currentQuestion: available[Math.floor(Math.random() * available.length)] })
                      }
                    }}
                    className="btn-outline text-xs px-4 py-2 rounded-full flex items-center gap-2 bg-white"
                  >
                    <Dices size={14} /> تغيير السؤال
                  </button>
                )}
                {questionState.currentQuestion && (
                  <button
                    onClick={() => {
                      if (typeof questionState.currentQuestion === 'string') {
                        setQuestionState({
                          excludedQuestions: [...questionState.excludedQuestions, questionState.currentQuestion]
                        })
                      } else {
                        setQuestionState({
                          excludedQuestionItems: [...questionState.excludedQuestionItems, (questionState.currentQuestion as QuestionItem).id]
                        })
                      }
                    }}
                    className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-4 py-2 rounded-full transition-colors flex items-center gap-2 border border-red-100"
                  >
                    استبعاد
                  </button>
                )}
              </div>
            </div>

            {/* Student/Name Card - CENTERED BELOW */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-border flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden group max-w-2xl mx-auto w-full">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users size={100} />
              </div>
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">الاسم المختار</span>
              <h3 className="text-3xl md:text-4xl font-bold text-primary break-words max-w-full">
                {studentState.currentStudent || "لم يتم الاختيار"}
              </h3>

              <div className="flex flex-wrap gap-2 justify-center z-10">
                {!timerState.isRunning && (
                  <button
                    onClick={() => {
                      const studentsList = studentState.studentsText.split("\n").map(s => s.trim()).filter(s => s !== "")
                      const availableStudents = studentsList.filter(s => !studentState.excludedStudents.includes(s))
                      if (availableStudents.length > 0) {
                        setStudentState({ currentStudent: availableStudents[Math.floor(Math.random() * availableStudents.length)] })
                      }
                    }}
                    className="btn-outline text-xs px-4 py-2 rounded-full flex items-center gap-2 bg-white"
                  >
                    <RotateCcw size={14} /> تغيير الاسم
                  </button>
                )}
                {studentState.currentStudent && (
                  <button
                    onClick={() => {
                      setStudentState({
                        excludedStudents: [...studentState.excludedStudents, studentState.currentStudent!]
                      })
                    }}
                    className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-4 py-2 rounded-full transition-colors flex items-center gap-2 border border-red-100"
                  >
                    استبعاد
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Timer Section */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 absolute">
                <circle cx="50%" cy="50%" r="45%" stroke="#eee" strokeWidth="6" fill="none" className="opacity-20" />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke={colors[1]}
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="283%"
                  strokeDashoffset={`${283 - (progress / 100) * 283}%`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="flex flex-col items-center">
                <span className={`text-4xl font-mono font-bold ${timerState.timeLeft <= 5 && timerState.timeLeft > 0 ? 'text-red-500 animate-pulse' : 'text-gray-800'}`}>
                  {formatTime(timerState.timeLeft)}
                </span>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              {/* Timer Controls */}
              <button
                onClick={() => setTimerState({ isRunning: !timerState.isRunning })}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${timerState.isRunning ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-primary text-white hover:bg-primary/90'}`}
                title={timerState.isRunning ? "إيقاف مؤقت" : "استئناف"}
              >
                {timerState.isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </button>

              <button
                onClick={onNext}
                className="px-6 py-3 rounded-2xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg"
              >
                المكافأة <SkipForward size={20} className="rtl:rotate-180" />
              </button>

              <button
                onClick={onRestart}
                className="px-6 py-3 rounded-2xl border-2 border-gray-200 font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                إنهاء
              </button>
            </div>
          </div>

        </div>
      )}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={(questionState.currentQuestion && typeof questionState.currentQuestion !== 'string' && questionState.currentQuestion.image) ? [{ src: questionState.currentQuestion.image }] : []}
      />
    </div>
  )
}
