"use client"

import { useState } from "react"
import { Users, HelpCircle, Gift, Clock, Trash2, ArrowLeft } from "lucide-react"
import type { TimerState } from "./TimerTool"
import type { RandomStudentState } from "./RandomStudentTool"
import type { QuestionToolState } from "./QuestionTool"
import type { RewardToolState } from "./RewardTool"

interface SetupViewProps {
  timerState: TimerState
  setTimerState: (u: Partial<TimerState>) => void
  studentState: RandomStudentState
  setStudentState: (u: Partial<RandomStudentState>) => void
  questionState: QuestionToolState
  setQuestionState: (u: Partial<QuestionToolState>) => void
  rewardState: RewardToolState
  setRewardState: (u: Partial<RewardToolState>) => void
  onStart: () => void
}

export default function SetupView({
  timerState,
  setTimerState,
  studentState,
  setStudentState,
  questionState,
  setQuestionState,
  rewardState,
  setRewardState,
  onStart
}: SetupViewProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'questions' | 'rewards' | 'timer'>('students')

  const handleTimeChange = (type: 'm' | 's', v: number) => {
    const m = type === 'm' ? v : timerState.minutes
    const s = type === 's' ? v : timerState.seconds
    const tot = m * 60 + s
    setTimerState({ minutes: m, seconds: s, timeLeft: tot, totalTime: tot, isRunning: false, isFinished: false })
  }

  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-xl border border-border overflow-hidden min-h-[600px] flex flex-col">
      <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 gap-2 overflow-x-auto" data-tour="setup-tabs">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'students' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-gray-100'}`}
          data-tour="tab-students"
        >
          <Users size={18} /> الطلاب
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'questions' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-gray-100'}`}
          data-tour="tab-questions"
        >
          <HelpCircle size={18} /> الأسئلة
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'rewards' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-gray-100'}`}
          data-tour="tab-rewards"
        >
          <Gift size={18} /> المكافآت
        </button>
        <button
          onClick={() => setActiveTab('timer')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'timer' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-gray-100'}`}
          data-tour="tab-timer"
        >
          <Clock size={18} /> الوقت
        </button>
      </div>

      <div className="flex-1 p-6 sm:p-8 flex flex-col">
        {activeTab === 'students' && (
          <div className="flex-1 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">قائمة الطلاب</h3>
              <span className="text-sm text-muted-foreground">{studentState.studentsText.split('\n').filter(s => s.trim()).length} اسم</span>
            </div>
            <textarea
              value={studentState.studentsText}
              onChange={(e) => setStudentState({ studentsText: e.target.value })}
              placeholder="اكتب أسماء الطلاب هنا (كل اسم في سطر مستقل)..."
              className="flex-1 w-full p-4 rounded-2xl border-2 border-border focus:border-primary outline-none resize-none min-h-[300px]"
              data-tour="setup-students"
            />
            {studentState.excludedStudents.length > 0 && (
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <h4 className="text-sm font-bold text-red-600 mb-2">المستبعدون ({studentState.excludedStudents.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {studentState.excludedStudents.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setStudentState({ excludedStudents: studentState.excludedStudents.filter(item => item !== s) })}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-colors"
                      title="إعادة للقائمة"
                    >
                      {s} <Trash2 size={10} className="rotate-45" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="flex-1 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">قائمة الأسئلة</h3>
              <span className="text-sm text-muted-foreground">{questionState.questions.split('\n').filter(s => s.trim()).length} سؤال</span>
            </div>
            <textarea
              value={questionState.questions}
              onChange={(e) => setQuestionState({ questions: e.target.value })}
              placeholder="اكتب الأسئلة هنا (كل سؤال في سطر مستقل)..."
              className="flex-1 w-full p-4 rounded-2xl border-2 border-border focus:border-primary outline-none resize-none min-h-[300px]"
              data-tour="setup-questions"
            />
            {questionState.excludedQuestions.length > 0 && (
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <h4 className="text-sm font-bold text-red-600 mb-2">الأسئلة المستبعدة ({questionState.excludedQuestions.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {questionState.excludedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setQuestionState({ excludedQuestions: questionState.excludedQuestions.filter(item => item !== q) })}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-colors"
                      title="إعادة للقائمة"
                    >
                      {q.substring(0, 30)}{q.length > 30 ? '...' : ''} <Trash2 size={10} className="rotate-45" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="flex-1 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">قائمة المكافآت</h3>
              <span className="text-sm text-muted-foreground">{rewardState.rewardsText.split('\n').filter(s => s.trim()).length} مكافأة</span>
            </div>
            <textarea
              value={rewardState.rewardsText}
              onChange={(e) => setRewardState({ rewardsText: e.target.value })}
              placeholder="اكتب المكافآت هنا (كل مكافأة في سطر مستقل)..."
              className="flex-1 w-full p-4 rounded-2xl border-2 border-border focus:border-primary outline-none resize-none min-h-[300px]"
              data-tour="setup-rewards"
            />
          </div>
        )}

        {activeTab === 'timer' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex gap-4 sm:gap-6 justify-center items-center bg-gray-50 p-8 rounded-[2rem] border border-border" data-tour="setup-timer">
              <div className="text-center">
                <label className="block text-sm font-bold mb-2">دقائق</label>
                <input
                  type="number"
                  value={timerState.minutes}
                  onChange={(e) => handleTimeChange('m', parseInt(e.target.value) || 0)}
                  className="w-24 h-24 text-4xl text-center rounded-2xl border-2 border-border focus:border-primary outline-none bg-white"
                />
              </div>
              <div className="text-3xl font-bold mt-6">:</div>
              <div className="text-center">
                <label className="block text-sm font-bold mb-2">ثواني</label>
                <input
                  type="number"
                  value={timerState.seconds}
                  onChange={(e) => handleTimeChange('s', parseInt(e.target.value) || 0)}
                  className="w-24 h-24 text-4xl text-center rounded-2xl border-2 border-border focus:border-primary outline-none bg-white"
                />
              </div>
            </div>

            <div className="w-full max-w-md space-y-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-border">
                <label className="block text-sm font-bold mb-2 text-center text-muted-foreground">صوت التنبيه (اختياري)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    id="sound-alarm"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const url = URL.createObjectURL(file)
                        setTimerState({ soundUrl: url })
                      }
                    }}
                    className="flex-1 text-sm text-center bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                  {timerState.soundUrl && (
                    <button onClick={() => setTimerState({ soundUrl: undefined })} className="p-2 text-destructive hover:bg-destructive/10 rounded-full" title="إزالة الصوت">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-border">
                <label className="block text-sm font-bold mb-2 text-center text-muted-foreground">صوت الثواني (العقارب)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    id="sound-tick"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const url = URL.createObjectURL(file)
                        setTimerState({ tickSoundUrl: url })
                      }
                    }}
                    className="flex-1 text-sm text-center bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                  {timerState.tickSoundUrl && (
                    <button onClick={() => setTimerState({ tickSoundUrl: undefined })} className="p-2 text-destructive hover:bg-destructive/10 rounded-full" title="إزالة الصوت">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button
          onClick={onStart}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 active:scale-95 duration-200"
          data-tour="setup-start-btn"
        >
          ابدأ الجولة <ArrowLeft className="rtl:rotate-180" size={24} />
        </button>
      </div>
    </div>
  )
}
