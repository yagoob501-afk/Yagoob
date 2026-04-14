/**
 * types.ts
 * Core data definitions for the Attendance Tool.
 */

export type AttendanceStatus = 'present' | 'absent' | 'ignore';

export interface Student {
  id: string;
  name: string;
}

export interface Lesson {
  id: string;
  lessonNumber: string;
  subject: string;
  teacher: string;
  date: string;
  status: 'pending' | 'completed';
  students: Student[];
}

// attendance[lessonId][studentId] = status
export type AttendanceMap = Record<string, Record<string, AttendanceStatus>>;

export interface AttendanceState {
  lessons: Lesson[];
  attendance: AttendanceMap;
  _hasHydrated: boolean; // For Zustand persist safety
}

export interface AttendanceStats {
  totalStudents: number;
  totalPresent: number;
  totalAbsent: number;
  rate: string; // Formatted percentage
}
