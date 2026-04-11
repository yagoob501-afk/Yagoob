import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, Copy, CheckCircle2, AlertCircle } from "lucide-react"
import "./MemoryStyles.css"

interface MemoryAIModalProps {
   isOpen: boolean
   onClose: () => void
   onImport: (json: string) => void
   count: number
}

export function MemoryAIModal({ isOpen, onClose, onImport, count }: MemoryAIModalProps) {
   const [jsonText, setJsonText] = React.useState("")
   const [topic, setTopic] = React.useState("")
   const [copied, setCopied] = React.useState(false)

   const examplePrompt = `قم بتوليد ${count} أسئلة عن (${topic || "قم بسؤال المستخدم عن موضوع"}) بصيغة JSON كالتالي:
[
  {
    "id": "1",
    "pairA": "المفهوم (يظهر على البطاقة 1)",
    "pairB": "التعريف (يظهر على البطاقة 2)"
  }
]`;

   const handleCopy = () => {
      navigator.clipboard.writeText(examplePrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
   }

   return (
      <AnimatePresence>
         {isOpen && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background-prism/80 backdrop-blur-3xl">
               <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="w-full max-w-4xl max-h-[95vh] overflow-y-auto glass-panel p-6 sm:p-10 rounded-xl border border-outline-variant-prism/10 shadow-2xl relative custom-scrollbar"
               >
                  <button
                     onClick={onClose}
                     className="absolute top-6 right-6 p-2 text-on-surface-variant-prism hover:bg-surface-bright rounded-full transition-all"
                  >
                     <X size={20} />
                  </button>

                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-14 h-14 rounded-2xl bg-primary-prism/10 flex items-center justify-center text-primary-prism shadow-inner">
                        <Sparkles size={28} />
                     </div>
                     <div>
                        <h2 className="text-3xl font-black text-on-surface-prism">توليد الأسئلة بـ AI</h2>
                        <p className="text-on-surface-variant-prism opacity-80">استخدم الذكاء الاصطناعي لإنشاء أسئلة Memory Strong بسرعة</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Column 1: Instructions & Prompt */}
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-sm font-black text-on-surface-prism px-2">موضوع الأسئلة</label>
                           <input
                              type="text"
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                              placeholder="مثال: مادة الكيمياء - الفصل الأول"
                              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant-prism/20 text-on-surface-prism outline-none focus:border-primary-prism transition-all"
                           />
                        </div>

                        <div className="bg-surface-container-high/40 p-5 rounded-xl border border-outline-variant-prism/10 space-y-3">
                           <h3 className="font-black text-base text-primary-fixed flex items-center gap-2">
                              <AlertCircle size={16} /> كيف يعمل؟
                           </h3>
                           <ol className="text-xs text-on-surface-variant-prism space-y-2 list-decimal pr-4 leading-relaxed">
                              <li>اكتب "الموضوع" الذي تريد توليد أسئلة له.</li>
                              <li>انسخ "أمر التوليد" المحدث تلقائياً بالأسفل.</li>
                              <li>الصق الأمر في ChatGPT المساعد.</li>
                              <li>الصق JSON الناتج في المربع المقابل.</li>
                           </ol>
                        </div>

                        <div className="space-y-3">
                           <label className="text-sm font-black text-on-surface-prism px-2">أمر التوليد (Prompt)</label>
                           <div className="relative group">
                              <pre className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant-prism/20 text-xs font-mono text-primary-fixed leading-relaxed overflow-x-auto whitespace-pre-wrap h-40 custom-scrollbar">
                                 {examplePrompt}
                              </pre>
                              <button
                                 onClick={handleCopy}
                                 className="absolute top-3 right-3 p-2 bg-surface-container-high text-on-surface-prism rounded-lg border border-outline-variant-prism/10 shadow-md hover:bg-surface-bright transition-all"
                              >
                                 {copied ? <CheckCircle2 size={16} className="text-primary-prism" /> : <Copy size={16} />}
                              </button>
                           </div>
                        </div>
                     </div>

                     {/* Column 2: Import Area */}
                     <div className="space-y-3 h-full flex flex-col">
                        <label className="text-sm font-black text-on-surface-prism px-2">JSON الناتج</label>
                        <textarea
                           value={jsonText}
                           onChange={(e) => setJsonText(e.target.value)}
                           placeholder='الصق كود JSON هنا (مثال: [{ "pairA": "...", "pairB": "..." }])'
                           className="flex-1 w-full p-4 rounded-xl bg-surface-container-lowest border border-outline-variant-prism/20 font-mono text-xs text-on-surface-prism outline-none focus:border-primary-prism transition-all resize-none min-h-[400px] custom-scrollbar"
                        />
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between mt-10 p-6 bg-surface-container-highest/20 rounded-xl border border-outline-variant-prism/10 gap-6">
                     <div className="flex items-center gap-2 text-sm text-on-surface-variant-prism justify-center sm:justify-start">
                        <CheckCircle2 size={16} className="text-primary-prism" />
                        <p>تأكد من أن البيانات بصيغة JSON صالحة.</p>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button
                           onClick={onClose}
                           className="px-8 py-3 rounded-xl text-on-surface-variant-prism font-bold hover:bg-surface-bright transition-all w-full sm:w-auto order-2 sm:order-1"
                        >
                           إلغاء
                        </button>
                        <button
                           onClick={() => onImport(jsonText)}
                           disabled={!jsonText.trim()}
                           className="px-10 py-3 rounded-full bg-linear-to-br from-primary-prism to-primary-container text-on-primary font-black shadow-lg shadow-primary-prism/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2"
                        >
                           بناء اللعبة <CheckCircle2 size={20} />
                        </button>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
   );
}
