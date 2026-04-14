import { z } from 'zod';

/**
 * Validation schema for a single Lesson's general details.
 */
export const lessonSchema = z.object({
  lessonNumber: z.string()
    .min(1, "رقم الحصة مطلوب")
    .max(5, "رقم الحصة طويل جداً"),
  subject: z.string()
    .min(2, "اسم المادة يجب أن يكون حرفين على الأقل")
    .max(50, "اسم المادة طويل جداً"),
  teacher: z.string()
    .max(100, "اسم المعلم طويل جداً")
    .optional()
    .or(z.literal("")),
});

/**
 * Validation schema for the bulk students roster (textarea).
 */
export const studentsSchema = z.string().refine(
  (val) => {
    const lines = val.split('\n').map(n => n.trim()).filter(n => n !== "");
    return lines.length > 0;
  },
  { message: "يجب إضافة طالب واحد على الأقل في القائمة" }
);

export type LessonFormData = z.infer<typeof lessonSchema>;
