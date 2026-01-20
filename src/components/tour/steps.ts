

import type { Step } from "react-joyride"

export const classroomToolsSteps: Step[] = [
  // 1. Initial greeting / Force return to setup if in round view
  {
    target: 'body',
    content: 'أهلاً بك في جولة أدوات الصف التفاعلية! دعنا نستعرض كيف يمكنك استخدام هذه الأدوات لإدارة حصتك بفعالية',
    placement: 'center',
    disableBeacon: true,
  },
  // If the user happens to be in the "Round View", guide them back.
  // This step targets the "Edit Data" button which only exists in Round View.
  // If not found, Joyride skips it. If found, we force a click.
  {
    target: '[data-tour="round-back-btn"]',
    content: 'للبدء، دعنا نعود لشاشة إعداد البيانات.',
    spotlightClicks: true,
    styles: { buttonNext: { display: 'none' } },
    // @ts-ignore
    autoNextOnClick: true
  },

  // 2. Students Tab (Force Click)
  {
    target: '[data-tour="tab-students"]',
    content: 'لنبدأ بإدخال بيانات الطلاب. اضغط على تبويب "الطلاب" للمتابعة.',
    spotlightClicks: true,
    styles: { buttonNext: { display: 'none' } },
    // @ts-ignore
    autoNextOnClick: true
  },
  // 3. Students Input
  {
    target: '[data-tour="setup-students"]',
    content: 'هنا يمكنك إضافة أسماء طلابك. اكتب كل اسم في سطر جديد، أو انسخ القائمة والصقها مباشرة.',
  },
  // 3b. Demo Excluded Students (restoration explanation)
  {
    target: '[data-tour="demo-excluded-students"]',
    content: 'عندما تستبعد طالباً أثناء الجولة، سيظهر هنا. يمكنك الضغط عليه لإعادته للقائمة النشطة.',
  },

  // 4. Questions Tab (Force Click)
  {
    target: '[data-tour="tab-questions"]',
    content: 'الآن، لننتقل لإعداد الأسئلة. اضغط على تبويب "الأسئلة".',
    spotlightClicks: true,
    styles: { buttonNext: { display: 'none' } },
    // @ts-ignore
    autoNextOnClick: true
  },
  // 5. Questions Input
  {
    target: '[data-tour="setup-questions"]',
    content: 'أضف أسئلتك هنا، سؤال لكل سطر. سيتم اختيارها عشوائياً لاحقاً.',
  },
  // 5b. Demo Excluded Questions (restoration explanation)
  {
    target: '[data-tour="demo-excluded-questions"]',
    content: 'وكذلك الأسئلة المستبعدة ستظهر هنا. اضغط على أي سؤال لإعادته للقائمة النشطة.',
  },

  // 6. Rewards Tab (Force Click)
  {
    target: '[data-tour="tab-rewards"]',
    content: 'وماذا عن المكافآت؟ اضغط على تبويب "المكافآت" لإعدادها.',
    spotlightClicks: true,
    styles: { buttonNext: { display: 'none' } },
    // @ts-ignore
    autoNextOnClick: true
  },
  // 7. Rewards Input
  {
    target: '[data-tour="setup-rewards"]',
    content: 'حفز طلابك بجوائز أو نقاط! اكتب قائمة المكافآت هنا.',
  },

  // 8. Timer Tab (Force Click)
  {
    target: '[data-tour="tab-timer"]',
    content: 'أخيراً، لنضبط الوقت. اضغط على تبويب "الوقت".',
    spotlightClicks: true,
    styles: { buttonNext: { display: 'none' } },
    // @ts-ignore
    autoNextOnClick: true
  },
  // 9. Timer Input
  {
    target: '[data-tour="setup-timer"]',
    content: 'حدد الدقائق والثواني لكل جولة، ويمكنك أيضاً اختيار أصوات للتنبيه لزيادة الحماس!',
  },

  // 10. Start Tour Button (Force Click)
  {
    target: '[data-tour="setup-start-btn"]',
    content: 'كل شيء جاهز! اضغط على "ابدأ الجولة" للانتقال لشاشة العرض.',
    spotlightClicks: true,
    styles: { buttonNext: { display: 'none' } },
    // @ts-ignore
    autoNextOnClick: true
  },

  // --- Round View Steps ---

  // 11. Explain Cards
  {
    target: '[data-tour="round-student-card"]',
    content: 'هنا سيظهر اسم الطالب المختار عشوائياً.',
  },
  {
    target: '[data-tour="round-question-card"]',
    content: 'وهنا السؤال الموجه له.',
  },
  {
    target: '[data-tour="round-reward-card"]',
    content: 'وهنا الجائزة التي حصل عليها!',
  },

  // 12. Controls
  {
    target: '[data-tour="round-start-selection"]',
    content: 'اضغط هنا لبدء الاختيار العشوائي للطلاب والأسئلة.',
  },
  {
    target: '[data-tour="round-start-timer"]',
    content: 'ومن هنا يمكنك تشغيل المؤقت لبدء العد التنازلي للإجابة.',
  },
  {
    target: '[data-tour="round-back-btn"]',
    content: 'هل تحتاج لتعديل الأسماء أو الأسئلة؟ اضغط هنا للعودة للإعدادات.',
  },
  {
    target: '[data-tour="reset-btn"]',
    content: 'وأخيراً، يمكنك استخدام هذا الزر لحذف جميع البيانات والبدء من جديد.',
  }
]
