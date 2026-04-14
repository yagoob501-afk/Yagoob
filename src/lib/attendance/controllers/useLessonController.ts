import { useAttendanceStore } from '../store'
import { Lesson, Student } from '../types'

export function useLessonController() {
  const { lessons, setLessons, attendance, setAttendance } = useAttendanceStore()

  const addLesson = (lessonNumber: string, subject: string, teacher: string, date: string) => {
    const id = crypto.randomUUID()
    const newLesson: Lesson = {
      id,
      lessonNumber,
      subject,
      teacher,
      date,
      status: 'pending',
      students: []
    }
    setLessons([...lessons, newLesson])
    
    // Initialize attendance map for this lesson
    setAttendance({
      ...attendance,
      [id]: {}
    })
    
    return id
  }

  const removeLesson = (id: string) => {
    setLessons(lessons.filter(l => l.id !== id))
    
    // Clean up attendance
    const newAttendance = { ...attendance }
    delete newAttendance[id]
    setAttendance(newAttendance)
  }

  const setLessonStudents = (lessonId: string, students: Student[]) => {
    setLessons(lessons.map(l => 
      l.id === lessonId ? { ...l, students } : l
    ))
  }

  const setLessonStatus = (lessonId: string, status: Lesson['status']) => {
    setLessons(lessons.map(l => 
      l.id === lessonId ? { ...l, status } : l
    ))
  }

  const getLessonById = (id: string) => {
    return lessons.find(l => l.id === id)
  }

  return {
    lessons,
    addLesson,
    removeLesson,
    setLessonStudents,
    setLessonStatus,
    getLessonById
  }
}
