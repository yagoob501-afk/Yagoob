import { useEffect, useRef } from "react"
import { Check, X, Minus, LayoutDashboard, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Lesson, Student, AttendanceStatus } from "@/lib/attendance/types"
import html2canvas from "html2canvas-pro"

interface MarkingExportViewProps {
  lesson: Lesson
  students: Student[]
  attendance: Record<string, AttendanceStatus>
  stats: {
    total: number
    present: number
    absent: number
  }
  onImageReady?: (image: string) => void
}

export function MarkingExportView({ lesson, students, attendance, stats, onImageReady }: MarkingExportViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const capture = async () => {
        try {
          // Ensure fonts are ready
          await document.fonts.ready

          // Specifically try to load Cairo if not ready
          if (!document.fonts.check('1em cairo')) {
            await document.fonts.load('1em cairo')
          }

          // Slightly longer delay to ensure shaping settles (matches certificate logic timing)
          await new Promise(r => setTimeout(r, 400))

          const canvas = await html2canvas(containerRef.current!, {
            useCORS: true,
            allowTaint: true,
            scale: 2, // High quality
            backgroundColor: "#ffffff",
          })

          const img = canvas.toDataURL("image/png")
          onImageReady?.(img)
        } catch (error) {
          console.error("Attendance export capture failed:", error)
        }
      }

      capture()
    }
  }, [onImageReady])

  return (
    <div
      ref={containerRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "1200px",
          backgroundColor: "white",
          padding: "60px",
          direction: "rtl",
          // Fix for Arabic disconnected letters and shaping
          fontFamily: "'cairo', sans-serif",
          textRendering: "optimizeLegibility",
          fontFeatureSettings: "'kern' 1",
          letterSpacing: "0"
        }}
        lang="ar"
        className="text-gray-900 border"
      >
        {/* Header */}
        <header className="flex justify-between items-end gap-10 border-b-2 border-slate-200 pb-12 mb-12">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 border border-blue-100">
              <LayoutDashboard className="w-10 h-10" />
            </div>
            <div className="flex flex-col gap-2 text-right">
              <h1 className="text-5xl font-bold text-slate-900">{lesson.subject}</h1>
              <div className="flex items-center gap-6 text-slate-500 font-bold text-lg">
                <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> الحصة رقم {lesson.lessonNumber}</span>
                <span className="flex items-center gap-2 border-r border-slate-200 pr-6"><Users className="w-5 h-5" /> {lesson.teacher}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <ExportHeaderStat label="إجمالي الطلاب" value={stats.total} color="neutral" />
            <ExportHeaderStat label="حضور" value={stats.present} color="success" />
            <ExportHeaderStat label="غياب" value={stats.absent} color="error" />
          </div>
        </header>

        {/* Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <th className="px-10 py-6 text-xs font-bold uppercase text-center">#</th>
                <th className="px-10 py-6 text-xs font-bold uppercase text-right">اسم الطالب</th>
                <th className="px-10 py-6 text-xs font-bold uppercase text-center">حالة الحضور</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student, idx) => (
                <tr
                  key={student.id}
                  className={cn(
                    "transition-colors",
                    attendance[student.id] === 'present' ? "bg-green-50/30" :
                      attendance[student.id] === 'absent' ? "bg-red-50/30" : ""
                  )}
                >
                  <td className="px-10 py-6 text-center">
                    <span className="text-lg font-bold text-slate-400 font-mono">{idx + 1}</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-xl font-bold text-slate-800">{student.name}</span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex justify-center">
                      {attendance[student.id] === 'present' ? (
                        <div className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-green-200">
                          <Check className="w-4 h-4" />
                          <span>حاضر</span>
                        </div>
                      ) : attendance[student.id] === 'absent' ? (
                        <div className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-red-200">
                          <X className="w-4 h-4" />
                          <span>غائب</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-6 py-2 bg-slate-400 text-white rounded-xl font-bold text-xs">
                          <Minus className="w-4 h-4" />
                          <span>تجاوز</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 font-bold">
          <div className="flex gap-8 text-sm">
            <span>التاريخ: {new Date().toLocaleDateString('ar-EG')}</span>
            <span>وقت التصدير: {new Date().toLocaleTimeString('ar-EG')}</span>
          </div>
          <span className="text-xs font-bold uppercase">نظام رصد الحضور الذكي</span>
        </div>
      </div>
  )
}

function ExportHeaderStat({ label, value, color }: { label: string, value: number, color: 'success' | 'error' | 'neutral' }) {
  const colors = {
    success: "text-green-600 border-green-200 bg-green-50",
    error: "text-red-600 border-red-200 bg-red-50",
    neutral: "text-slate-500 border-slate-200 bg-slate-50"
  }
  return (
    <div className={cn("px-10 py-6 rounded-3xl border min-w-[200px] flex flex-col items-center gap-1 shadow-sm", colors[color])}>
      <span className="text-xs font-bold uppercase opacity-60">{label}</span>
      <span className="text-4xl font-bold font-cairo">{value}</span>
    </div>
  )
}
