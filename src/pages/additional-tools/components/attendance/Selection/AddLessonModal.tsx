import { type FC, useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderPlus, AlertCircle } from 'lucide-react';
import { lessonSchema, type LessonFormData } from '@/lib/attendance/validation';
import { cn } from '@/lib/utils';

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (lessonNumber: string, subject: string, teacher: string, semester?: string) => void;
  initialData?: {
    lessonNumber: string;
    subject: string;
    teacher: string;
    semester?: string;
  } | null;
}

export const AddLessonModal: FC<AddLessonModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  initialData
}) => {
  const [newLesson, setNewLesson] = useState<LessonFormData>({ lessonNumber: "", subject: "", teacher: "", semester: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof LessonFormData, string>>>({});
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNewLesson({
        lessonNumber: initialData.lessonNumber,
        subject: initialData.subject,
        teacher: initialData.teacher,
        semester: initialData.semester || ""
      });
    } else {
      setNewLesson({ lessonNumber: "", subject: "", teacher: "", semester: "" });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const result = lessonSchema.safeParse(newLesson);

    if (result.success) {
      onAdd(result.data.lessonNumber, result.data.subject, result.data.teacher || "", result.data.semester);
      setNewLesson({ lessonNumber: "", subject: "", teacher: "", semester: "" });
      setErrors({});
      onClose();
    } else {
      const fieldErrors: Partial<Record<keyof LessonFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof LessonFormData] = issue.message;
        }
      });
      setErrors(fieldErrors);

      // Trigger shake animation
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 isolate">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              x: shake ? [-10, 10, -10, 10, 0] : 0
            }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-full max-w-lg bg-bg-container rounded-3xl overflow-hidden shadow-2xl border border-border"
          >
            <div className="h-2 bg-linear-to-r from-primary via-primary/50 to-primary" />

            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-text-heading font-cairo">
                  {initialData ? "تعديل بيانات الحصة" : "إضافة حصة جديدة"}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-bg-layout rounded-xl transition-colors text-text-muted"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 space-y-2">
                    <label className="text-xs font-black text-text-muted px-2">الحصة</label>
                    <input
                      type="text"
                      placeholder="#"
                      value={newLesson.lessonNumber}
                      onChange={(e) => {
                        setNewLesson({ ...newLesson, lessonNumber: e.target.value });
                        if (errors.lessonNumber) setErrors({ ...errors, lessonNumber: undefined });
                      }}
                      className={cn(
                        "w-full bg-bg-layout border rounded-2xl py-4 text-center font-black text-2xl transition-all outline-none text-text-heading",
                        errors.lessonNumber ? "border-error ring-4 ring-error/10" : "border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/5"
                      )}
                      autoFocus
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <label className="text-xs font-black text-text-muted px-2">اسم المادة / الدرس</label>
                    <input
                      type="text"
                      placeholder="مثال: رياضيات، فيزياء..."
                      value={newLesson.subject}
                      onChange={(e) => {
                        setNewLesson({ ...newLesson, subject: e.target.value });
                        if (errors.subject) setErrors({ ...errors, subject: undefined });
                      }}
                      className={cn(
                        "w-full bg-bg-layout border rounded-2xl px-6 py-4 font-black text-xl transition-all outline-none text-text-heading",
                        errors.subject ? "border-error ring-4 ring-error/10" : "border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/5"
                      )}
                    />
                  </div>
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                  {(errors.lessonNumber || errors.subject) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-error text-xs font-bold px-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.lessonNumber || errors.subject}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="text-xs font-black text-text-muted px-2">اسم المعلم (اختياري)</label>
                  <input
                    type="text"
                    placeholder="اسم المعلم القائم بالحصة"
                    value={newLesson.teacher}
                    onChange={(e) => setNewLesson({ ...newLesson, teacher: e.target.value })}
                    className="w-full bg-bg-layout border border-border/50 rounded-2xl px-6 py-4 font-bold text-xl focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-text-heading"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-text-muted px-2">الفصل الدراسي (اختياري)</label>
                  <input
                    type="text"
                    placeholder="مثال: الفصل الأول، الفصل الثاني..."
                    value={newLesson.semester}
                    onChange={(e) => setNewLesson({ ...newLesson, semester: e.target.value })}
                    className="w-full bg-bg-layout border border-border/50 rounded-2xl px-6 py-4 font-bold text-xl focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-text-heading"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-6 bg-primary text-text-light-solid font-black text-2xl rounded-3xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                >
                  <FolderPlus className="w-8 h-8" />
                  <span>{initialData ? "تحديث بيانات الحصة" : "إدراج الحصة في الجدول"}</span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
