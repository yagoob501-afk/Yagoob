import { createAttendanceImage } from "./createAttendanceImage";
import type { Lesson, AttendanceMap } from "./types";
import { serializeLessonData, encodeData } from "./jsonExport";

interface ExportOptions {
  lessons: Lesson[];
  attendance: AttendanceMap;
  onProgress?: (current: number, total: number) => void;
}

/**
 * Captures all listed lessons into a single PDF document.
 * 1. Capture stage: Generates images via DOM in the main thread.
 * 2. Assembly stage: Uses Web Worker to bundle images into PDF securely.
 */
export async function exportAllToPdf({ lessons, attendance, onProgress }: ExportOptions) {
  // 1. Filter valid lessons
  const validLessons = lessons.filter(l => l.students && l.students.length > 0);
  if (validLessons.length === 0) {
    throw new Error("لا توجد دروس تحتوي على طلاب لتصديرها.");
  }

  // 2. Capture Stage (Main Thread)
  const images: string[] = [];
  const lessonDataStrings: string[] = [];

  for (let i = 0; i < validLessons.length; i++) {
    const lesson = validLessons[i];

    // Progress during capture (0-50%)
    onProgress?.((i / validLessons.length) * 50, 100);

    const lessonAttendance = attendance[lesson.id] || {};
    const vals = Object.values(lessonAttendance);
    const stats = {
      total: lesson.students.length,
      present: vals.filter(v => v === 'present').length,
      absent: vals.filter(v => v === 'absent').length
    };

    // Serialize data for embedding
    const rawJson = serializeLessonData(lesson, lessonAttendance);
    lessonDataStrings.push(encodeData(rawJson));

    const imageData = await createAttendanceImage({
      lesson,
      students: lesson.students,
      attendance: lessonAttendance,
      stats
    });
    images.push(imageData);
  }

  // 3. Assembly Stage (Worker Thread)
  return new Promise<void>((resolve, reject) => {
    // Correct URL syntax for Vite workers
    const worker = new Worker(new URL("../../workers/attendanceWorker.js", import.meta.url), { type: "module" });

    worker.onmessage = (event) => {
      const { type, progress, blob } = event.data;

      if (type === "progress") {
        // Progress during PDF assembly (50-100%)
        onProgress?.(50 + (progress / 2), 100);
      }

      if (type === "done" && blob) {
        const url = URL.createObjectURL(blob);
        const dateStr = new Date().toLocaleDateString('ar-EG').replace(/\//g, '-');

        const link = document.createElement("a");
        link.href = url;
        link.download = `تصدير_الحضور_الشامل_${dateStr}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
        worker.terminate();
        resolve();
      }
    };

    worker.onerror = (err) => {
      console.error("PDF Worker Error:", err);
      worker.terminate();
      reject(new Error("حدث خطأ أثناء تجميع ملف الـ PDF."));
    };

    // Send images and metadata to worker to start processing
    worker.postMessage({ images, metadata: lessonDataStrings });
  });
}
