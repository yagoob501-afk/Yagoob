import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Lesson, AttendanceMap } from './types'

interface AttendanceStoreState {
  lessons: Lesson[]
  attendance: AttendanceMap
  _hasHydrated: boolean
  
  // Storage Actions
  setLessons: (lessons: Lesson[]) => void
  setAttendance: (attendance: AttendanceMap) => void
  setHasHydrated: (state: boolean) => void
  reset: () => void
}

export const useAttendanceStore = create<AttendanceStoreState>()(
  persist(
    (set) => ({
      lessons: [],
      attendance: {},
      _hasHydrated: false,

      setLessons: (lessons) => set({ lessons }),
      setAttendance: (attendance) => set({ attendance }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      reset: () => set({ lessons: [], attendance: {} })
    }),
    {
      name: 'attendance_tool_state', // Matches legacy key for continuity
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)
