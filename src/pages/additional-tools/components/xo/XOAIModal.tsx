"use client"

import * as React from "react"
import { X, Copy, Check, Sparkles, Wand2, FileJson, ArrowRight, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Stepper, StepperItem, StepperContent, useStepper } from "@/components/ui/stepper"
import { cn } from "@/lib/utils"

interface XOAIModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (questionsJson: string) => void
}

export function XOAIModal({ isOpen, onClose, onImport }: XOAIModalProps) {
  const [topic, setTopic] = React.useState("")
  const [prompt, setPrompt] = React.useState("")
  const [jsonInput, setJsonInput] = React.useState("")
  const [copied, setCopied] = React.useState(false)

  if (!isOpen) return null

  const generatePrompt = (topicText: string) => {
    return `Create a JSON for an XO Game (Tic-Tac-Toe) about "${topicText}". 
The JSON should be an array of objects. Each object represents a question:
{
  "id": "unique-id",
  "text": "The question text",
  "choices": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswerIndex": 0,
  "timeLimit": 30
}
Please provide exactly 15 questions. 
`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-2xl rounded-4xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">توليد الأسئلة بالذكاء الاصطناعي</h2>
              <p className="text-xs text-muted-foreground">أضف محتوى تعليمي بضغطة زر</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <Stepper steps={3} onStepChange={(step) => {
          if (step === 1 && topic) {
            setPrompt(generatePrompt(topic))
          }
        }} className="flex-1 flex flex-col">
          <StepperContent className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            {/* Step 0: Topic Input */}
            <StepperItem step={0} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto text-blue-500 mb-4">
                  <Wand2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">ما هو موضوع الأسئلة؟</h3>
                <p className="text-muted-foreground">اكتب عنوان الدرس أو الموضوع (مثال: الجهاز الهضمي، تاريخ النهضة)</p>
              </div>
              <textarea
                autoFocus
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="اكتب هنا..."
                className="w-full h-32 p-6 text-xl rounded-3xl border-2 border-border focus:border-primary outline-none transition-all resize-none shadow-sm"
              />
            </StepperItem>

            {/* Step 1: Prompt & Instructions */}
            <StepperItem step={1} className="space-y-6">
              <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 flex gap-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-yellow-200">
                  <ArrowRight size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-yellow-800">الخطوة التالية</h4>
                  <p className="text-sm text-yellow-700">انسخ النص البرمجي أدناه واستخدمه في ChatGPT أو Claude، ثم انسخ الرد للخطوة التالية.</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all border-2",
                      copied
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-border text-gray-700 hover:border-primary hover:text-primary shadow-sm"
                    )}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? "تم النسخ" : "نسخ النص"}</span>
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-300 p-8 pt-16 rounded-[2.5rem] text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono border-4 border-gray-800 shadow-xl">
                  {prompt}
                </pre>
              </div>
            </StepperItem>

            {/* Step 2: Paste JSON */}
            <StepperItem step={2} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto text-purple-500 mb-4">
                  <FileJson size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">ألصق الرد هنا</h3>
                <p className="text-muted-foreground">تأكد من لصق كود JSON الذي تم إنشاؤه فقط</p>
              </div>
              <textarea
                dir="ltr"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='[ { "text": "...", ... } ]'
                className="w-full h-48 p-6 text-sm font-mono rounded-3xl border-2 border-border focus:border-primary outline-none transition-all resize-none shadow-sm bg-gray-50"
              />
            </StepperItem>
          </StepperContent>

          <ModalNavigation topic={topic} jsonInput={jsonInput} onImport={() => onImport(jsonInput)} />
        </Stepper>
      </motion.div>
    </div>
  )
}

function ModalNavigation({ topic, jsonInput, onImport }: { topic: string, jsonInput: string, onImport: () => void }) {
  const { activeStep, nextStep, prevStep, totalSteps } = useStepper()

  return (
    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              activeStep === i ? "bg-primary w-8" : "bg-gray-200"
            )}
          />
        ))}
      </div>

      <div className="flex gap-3">
        {activeStep > 0 && (
          <button
            onClick={prevStep}
            className="px-6 py-3 rounded-2xl font-bold text-gray-700 hover:bg-gray-100 transition-all flex items-center gap-2"
          >
            <ArrowRight className="rtl:rotate-0 rotate-180" size={18} />
            السابق
          </button>
        )}

        {activeStep < totalSteps - 1 ? (
          <button
            disabled={activeStep === 0 && !topic}
            onClick={nextStep}
            className="px-8 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            التالي
            <ArrowLeft className="rtl:rotate-0 rotate-180" size={18} />
          </button>
        ) : (
          <button
            disabled={!jsonInput}
            onClick={onImport}
            className="px-8 py-3 rounded-2xl bg-green-600 text-white font-bold shadow-lg shadow-green-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <Check size={18} />
            استيراد الأسئلة
          </button>
        )}
      </div>
    </div>
  )
}
