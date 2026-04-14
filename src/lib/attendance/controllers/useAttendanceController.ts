import { useAttendanceStore } from '../store'
import type { AttendanceStatus, AttendanceStats } from '../types'

/**
 * Helper to parse status strings into semantic booleans.
 */
export function getStatusInfo(status: AttendanceStatus | undefined) {
  return {
    isPresent: status === 'present' || status === 'present_participating',
    isAbsent: status === 'absent',
    isParticipating: status === 'present_participating',
    isUnmarked: !status || status === 'ignore'
  }
}

export function useAttendanceController() {
  const { attendance, setAttendance, lessons } = useAttendanceStore()

  const markStudent = (lessonId: string, studentId: string, status: AttendanceStatus) => {
    const lessonAttendance = { ...(attendance[lessonId] || {}) }

    // Toggle logic
    if (lessonAttendance[studentId] === status) {
      delete lessonAttendance[studentId]
    } else {
      lessonAttendance[studentId] = status
    }

    setAttendance({
      ...attendance,
      [lessonId]: lessonAttendance
    })
  }

  const toggleParticipation = (lessonId: string, studentId: string) => {
    const lessonAttendance = { ...(attendance[lessonId] || {}) }
    const current = lessonAttendance[studentId]
    // const info = getStatusInfo(current)

    if (current === 'present') {
      lessonAttendance[studentId] = 'present_participating'
    } else if (current === 'present_participating') {
      lessonAttendance[studentId] = 'present'
    }

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
    let totalParticipating = 0

    lessons.forEach(lesson => {
      totalStudents += lesson.students?.length || 0
      const lessonAttendance = attendance[lesson.id] || {}
      Object.values(lessonAttendance).forEach(status => {
        const { isPresent, isAbsent, isParticipating } = getStatusInfo(status)
        if (isPresent) totalPresent++
        else if (isAbsent) totalAbsent++

        if (isParticipating) totalParticipating++
      })
    })

    const totalMarked = totalPresent + totalAbsent
    const rateVal = totalMarked > 0 ? (totalPresent / totalMarked) * 100 : 0
    const rate = rateVal % 1 === 0 ? rateVal.toFixed(0) : rateVal.toFixed(1)

    return {
      totalStudents,
      totalPresent,
      totalAbsent,
      totalParticipating,
      rate
    }
  }

  return {
    markStudent,
    toggleParticipation,
    getLessonAttendance,
    getGlobalStats,
    getStatusInfo // Expose helper here for components
  }
}
