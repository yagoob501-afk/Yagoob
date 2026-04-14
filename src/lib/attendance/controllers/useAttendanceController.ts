import { useAttendanceStore } from '../store'
import type { AttendanceStatus, AttendanceStats } from '../types'

export function useAttendanceController() {
  const { attendance, setAttendance, lessons } = useAttendanceStore()

  const markStudent = (lessonId: string, studentId: string, status: AttendanceStatus) => {
    const lessonAttendance = { ...(attendance[lessonId] || {}) }
    lessonAttendance[studentId] = status

    setAttendance({
      ...attendance,
      [lessonId]: lessonAttendance
    })
  }

  const getLessonAttendance = (lessonId: string) => {
    return attendance[lessonId] || {}
  }

  const getGlobalStats = (): AttendanceStats => {
    let totalStudents = 0
    let totalPresent = 0
    let totalAbsent = 0

    lessons.forEach(lesson => {
      totalStudents += lesson.students?.length || 0
      const lessonAttendance = attendance[lesson.id] || {}
      Object.values(lessonAttendance).forEach(status => {
        if (status === 'present') totalPresent++
        else if (status === 'absent') totalAbsent++
      })
    })

    const totalMarked = totalPresent + totalAbsent
    const rateVal = totalMarked > 0 ? (totalPresent / totalMarked) * 100 : 100
    const rate = rateVal % 1 === 0 ? rateVal.toFixed(0) : rateVal.toFixed(1)

    return {
      totalStudents,
      totalPresent,
      totalAbsent,
      rate
    }
  }

  return {
    markStudent,
    getLessonAttendance,
    getGlobalStats
  }
}
