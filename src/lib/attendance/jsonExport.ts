import type { Lesson, AttendanceStatus } from "./types";

export interface AttendanceExportData {
  version: string;
  type: "attendance_report";
  exportDate: string;
  lesson: {
    id: string;
    lessonNumber: string;
    subject: string;
    teacher: string;
    date: string;
    semester?: string;
  };
  attendance: Record<string, AttendanceStatus>;
  students: { id: string; name: string }[];
}

/**
 * Serializes lesson and attendance data into a standardized JSON string.
 */
export function serializeLessonData(
  lesson: Lesson,
  attendanceMap: Record<string, AttendanceStatus>
): string {
  const data: AttendanceExportData = {
    version: "1.0",
    type: "attendance_report",
    exportDate: new Date().toISOString(),
    lesson: {
      id: lesson.id,
      lessonNumber: lesson.lessonNumber,
      subject: lesson.subject,
      teacher: lesson.teacher,
      date: lesson.date,
      semester: lesson.semester,
    },
    attendance: attendanceMap,
    students: lesson.students.map(s => ({ id: s.id, name: s.name })),
  };

  return JSON.stringify(data);
}

/**
 * Encodes string to Base64 (supporting UTF-8).
 */
export function encodeData(data: string): string {
  // Use TextEncoder for UTF-8 support (names in Arabic)
  const codeUnits = new TextEncoder().encode(data);
  let binString = "";
  for (const byte of codeUnits) {
    binString += String.fromCharCode(byte);
  }
  return btoa(binString);
}
