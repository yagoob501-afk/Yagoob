import { useEffect, useRef } from "react"
import { Check, X, Clock, Users, Star, GraduationCap, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Lesson, Student, AttendanceStatus } from "@/lib/attendance/types"
import { getStatusInfo } from "@/lib/attendance/controllers/useAttendanceController"
import html2canvas from "html2canvas-pro"

interface MarkingExportViewProps {
  lesson: Lesson
  students: Student[]
  attendance: Record<string, AttendanceStatus>
  stats: {
    total: number
    present: number
    absent: number
    participating: number
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
          <div className="flex flex-col gap-8 flex-1 min-w-0 text-right">
            {/* Title Row with Subject & Lesson Number Icons */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-6 min-w-0">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h1 className="text-5xl font-bold text-slate-900 leading-tight truncate">
                  {lesson.subject}
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-slate-600 font-bold text-2xl">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                  <Users className="w-6 h-6" />
                </div>
                <span>{lesson.teacher}</span>
              </div>

              {lesson.semester && (
                <div className="flex items-center gap-4 text-slate-600 font-bold text-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span>{lesson.semester}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <ExportHeaderStat label="إجمالي الطلاب" value={stats.total} color="neutral" />
          <ExportHeaderStat label="حضور" value={stats.present} color="success" />
          <ExportHeaderStat label="غياب" value={stats.absent} color="error" />
          <ExportHeaderStat label="مشاركة" value={stats.participating} color="warning" />
        </div>
      </header>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <th className="px-10 py-6 text-xs font-bold uppercase text-center">#</th>
              <th className="px-10 py-6 text-xs font-bold uppercase text-right">اسم الطالب</th>
              <th className="px-10 py-6 text-xs font-bold uppercase text-center">المشاركة</th>
              <th className="px-10 py-6 text-xs font-bold uppercase text-center">حالة الحضور</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student, idx) => {
              const info = getStatusInfo(attendance[student.id])
              return (
                <tr
                  key={student.id}
                  className={cn(
                    "transition-colors",
                    info.isPresent ? "bg-green-50/30" :
                      info.isAbsent ? "bg-red-50/30" : ""
                  )}
                >
                  <td className="px-10 py-6 text-center align-middle">
                    <span className="text-lg font-bold text-slate-400 font-mono leading-none">{idx + 1}</span>
                  </td>
                  <td className="px-10 py-6 align-middle">
                    <span className="text-xl font-bold text-slate-800 leading-none">{student.name}</span>
                  </td>
                  <td className="px-10 py-6 text-center align-middle">
                    {info.isParticipating ? (
                      <div className="inline-block bg-amber-500 text-white rounded-xl px-4 py-2 shadow-lg shadow-amber-200 min-w-[124px] text-center">
                        <Star className="inline-block w-4 h-4 fill-white align-middle" style={{ verticalAlign: 'middle' }} />
                        <span className="inline-block font-bold text-xs uppercase mr-2 align-middle" style={{ verticalAlign: 'middle' }}>مشارك</span>
                      </div>
                    ) : (
                      <span className="text-slate-200">-</span>
                    )}
                  </td>
                  <td className="px-10 py-6 text-center align-middle">
                    {info.isPresent ? (
                      <div className="inline-block bg-green-600 text-white rounded-xl px-4 py-2 shadow-lg shadow-green-100 min-w-[124px] text-center">
                        <Check className="inline-block w-4 h-4 align-middle" style={{ verticalAlign: 'middle' }} />
                        <span className="inline-block font-bold text-xs uppercase mr-2 align-middle" style={{ verticalAlign: 'middle' }}>حاضر</span>
                      </div>
                    ) : info.isAbsent ? (
                      <div className="inline-block bg-red-600 text-white rounded-xl px-4 py-2 shadow-lg shadow-red-100 min-w-[124px] text-center">
                        <X className="inline-block w-4 h-4 align-middle" style={{ verticalAlign: 'middle' }} />
                        <span className="inline-block font-bold text-xs uppercase mr-2 align-middle" style={{ verticalAlign: 'middle' }}>غائب</span>
                      </div>
                    ) : (
                      <span className="text-slate-200">-</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 font-bold">
        <div className="flex gap-8 text-sm">
          <span>التاريخ: {new Date().toLocaleDateString('ar-EG')}</span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            الحصة: {lesson.lessonNumber}
          </span>
          <span>وقت التصدير: {new Date().toLocaleTimeString('ar-EG')}</span>
        </div>
        <span className="text-xs font-bold uppercase">نظام رصد الحضور الذكي</span>
      </div>
    </div>
  )
}

function ExportHeaderStat({ label, value, color }: { label: string, value: number, color: 'success' | 'error' | 'neutral' | 'warning' }) {
  const colors = {
    success: "text-green-600 border-green-200 bg-green-50",
    error: "text-red-600 border-red-200 bg-red-50",
    neutral: "text-slate-500 border-slate-200 bg-slate-50",
    warning: "text-amber-600 border-amber-200 bg-amber-50"
  }
  return (
    <div className={cn("px-8 py-5 rounded-3xl border min-w-[160px] flex flex-col items-center gap-1 shadow-sm", colors[color])}>
      <span className="text-xs font-bold uppercase opacity-60">{label}</span>
      <span className="text-4xl font-bold font-cairo">{value}</span>
    </div>
  )
}
