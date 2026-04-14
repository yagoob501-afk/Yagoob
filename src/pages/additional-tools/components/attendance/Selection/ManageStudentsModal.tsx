import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Users, UserCheck, AlertCircle } from 'lucide-react';
import type { Lesson } from '@/lib/attendance';
import { studentsSchema } from '@/lib/attendance/validation';
import { cn } from '@/lib/utils';

interface ManageStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  onSave: (lessonId: string, studentNames: string) => void;
}

export const ManageStudentsModal: React.FC<ManageStudentsModalProps> = ({
  isOpen,
  onClose,
  lesson,
  onSave
}) => {
  const [bulkStudents, setBulkStudents] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lesson) {
      setBulkStudents((lesson.students || []).map(s => s.name).join("\n"));
      setError(null);
    } else {
      setBulkStudents("");
    }
  }, [lesson]);

  const handleSave = () => {
    if (!lesson) return;
    
    const result = studentsSchema.safeParse(bulkStudents);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    onSave(lesson.id, bulkStudents);
    setError(null);
    onClose();
  };

  const studentCount = bulkStudents.split("\n").filter(n => n.trim() !== "").length;

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
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-bg-container rounded-3xl overflow-hidden shadow-2xl border border-border"
          >
            <div className="h-2 bg-linear-to-r from-success via-success/50 to-success" />

            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-text-heading font-cairo">إدارة طلاب {lesson?.subject}</h3>
                  <p className="text-text-muted text-sm font-bold opacity-60">الحصة {lesson?.lessonNumber} • {lesson?.teacher}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-bg-layout rounded-xl transition-colors text-text-muted"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-bg-layout border border-border/50 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-success">
                    <Users className="w-6 h-6" />
                    <span className="font-black">قائمة الأسماء</span>
                  </div>
                  <div className="px-4 py-1.5 bg-success/10 text-success rounded-full text-xl font-black font-mono">
                    {studentCount}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={bulkStudents}
                    onChange={(e) => {
                      setBulkStudents(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="نايف بن محمد...&#10;خالد بن عبدالعزيز...&#10;سعد بن عبدالله..."
                    className={cn(
                      "w-full h-[350px] bg-bg-layout border rounded-3xl p-6 text-xl font-black text-text-heading transition-all outline-none resize-none shadow-inner",
                      error ? "border-error ring-4 ring-error/10" : "border-border/50 focus:border-success focus:ring-8 focus:ring-success/5"
                    )}
                    dir="rtl"
                  />
                  
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-4 right-6 flex items-center gap-2 text-error font-bold text-sm bg-bg-container px-3 py-1.5 rounded-lg shadow-sm border border-error/20"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10 text-xs text-primary font-bold">
                  <UserCheck className="w-5 h-5 opacity-60" />
                  <span>قم بكتابة كل اسم في سطر جديد. سيتم حفظ التغييرات واستبدال القائمة الحالية.</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-5 bg-success text-text-light-solid font-black text-xl rounded-2xl shadow-xl shadow-success/20 hover:shadow-success/40 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <Save className="w-6 h-6" />
                    <span>حفظ القائمة</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-8 py-5 bg-bg-layout text-text-muted font-black text-lg rounded-2xl border border-border hover:bg-bg-container transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
