import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Download, X, AlertOctagon } from 'lucide-react';

interface AttendanceImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName?: string;
}

export const AttendanceImportModal: FC<AttendanceImportModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fileName
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 isolate">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800"
          >
            {/* Header Decor */}
            <div className="h-2 bg-linear-to-r from-amber-500 via-orange-500 to-amber-500" />

            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500">
                <AlertOctagon className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-bold text-center text-zinc-900 dark:text-white mb-2 font-almaria">
                تأكيد استيراد البيانات
              </h3>

              <div className="text-center text-zinc-500 dark:text-zinc-400 mb-8 space-y-4">
                <p className="font-almaria text-lg leading-relaxed">
                  سيتم <span className="text-amber-600 dark:text-amber-500 font-black">استبدال</span> جميع الدروس وحالات الحضور الحالية بالبيانات الموجودة في:
                </p>

                {fileName && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-mono border border-zinc-200 dark:border-zinc-700">
                    <Download className="w-4 h-4" />
                    {fileName}
                  </div>
                )}

                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 text-sm text-right flex gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="font-almaria">
                    يرجى التأكد من <span className="underline decoration-2 underline-offset-4">تصدير بياناتك الحالية</span> كملف PDF قبل المتابعة، حيث لا يمكن التراجع عن هذه العملية بعد الاستبدال.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row-reverse gap-3">
                <button
                  onClick={onConfirm}
                  className="flex-1 px-6 py-4 rounded-2xl bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] font-almaria"
                >
                  نعم، استبدال البيانات
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold transition-all active:scale-[0.98] font-almaria flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  إلغاء
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
