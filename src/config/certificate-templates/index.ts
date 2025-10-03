import Template1background from "@/assets/certificates_backgrounds/شهادة تقدير لبني وأبيض.png";
import Template2background from "@/assets/certificates_backgrounds/certificate-background-2.jpeg";
import Template3background from "@/assets/certificates_backgrounds/certificate-background-3.jpeg";
import Template4background from "@/assets/certificates_backgrounds/certificate-background-4.jpeg";
import Template5background from "@/assets/certificates_backgrounds/certificate-background-5.png";
import Template6background from "@/assets/certificates_backgrounds/certificate-background-6.png";
import Template7background from "@/assets/certificates_backgrounds/certificate-background-7.png";
import Template8background from "@/assets/certificates_backgrounds/certificate-background-8.png";
import Template9background from "@/assets/certificates_backgrounds/certificate-background-9.png";
import type { CertificateTemplate } from "@/components/ui/CertificateViewer/PrimaryCertificateViewer";

export const Template1: CertificateTemplate = {
    background: Template1background,
    classNames: {
        title: "absolute font-airstrip text-[90px] text-[#4c5f6e]",
        subtitle: "absolute font-cairo text-4xl text-[#496479]",
        name: "absolute font-bold font-cairo text-7xl text-[#4c5f6e] whitespace-nowrap",
        line2: "absolute text-5xl font-cairo text-center text-[#496479]",
        date: "absolute text-3xl text-[#496479]",
        sign: "absolute text-3xl text-[#496479]",
    },
    positions: {
        title: { top: "10%", left: "50%", transform: "translateX(-50%)" },
        subtitle: { top: "30%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "37%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "49%", left: "50%", transform: "translateX(-50%)" },
        date: { bottom: "20%", left: "65%" },
        sign: { bottom: "16%", right: "65%" },
    },
};


export const Template2: CertificateTemplate = {
    background: Template2background,
    classNames: {
        title: "absolute font-sharjah text-[134px] text-[#293d5e]",
        subtitle: "absolute font-alhoda text-[100px] text-[#3f588a] whitespace-nowrap",
        name: "absolute font-bold text-9xl text-[#d4b365] whitespace-nowrap",
        line2: "absolute text-[60px] text-center text-[#293d5e]",
        date: "absolute text-3xl hidden",
        sign: "absolute text-3xl",

        teacherName: "absolute text-[40px] text-[#8b5e3c] font-bold font-cairo flex flex-col items-center gap-2",
        managerName: "absolute text-[40px] text-[#8b5e3c] font-bold font-cairo flex flex-col items-center gap-2",
    },
    positions: {
        title: { top: "3.5%", left: "50%", transform: "translateX(-50%)" },
        subtitle: { top: "18%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "33.6%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "51%", left: "50%", transform: "translateX(-50%)" },
        // date: { bottom: "16%", left: "66.7%" },
        sign: { bottom: "4%", left: "29.2%" },

        teacherName: { bottom: "16%", left: "64.2%" },
        managerName: { bottom: "16%", right: "64.2%", transform: "" },
    },
    formDisplayedFields: {
        formDate: false,
        formSign: false,
    }
};


export const Template3: CertificateTemplate = {
    background: Template3background,
    classNames: {
        title: "absolute font-sharjah text-[134px] text-[#5f7f80]",
        subtitle: "absolute font-alhoda text-4xl text-[#e07a3d]",
        name: "absolute font-bold text-8xl text-[#5f7f80] whitespace-nowrap",
        line2: "absolute text-5xl text-center text-[#4a6a92]",
        date: "absolute text-3xl text-[#333333] hidden",
        sign: "absolute text-3xl text-[#333333] hidden",
        teacherName: "absolute text-[40px] flex flex-col items-center gap-3",
        managerName: "absolute text-[40px] flex flex-col items-center gap-3",
    },
    positions: {
        title: { top: "8%", left: "50%", transform: "translateX(-50%)" },
        subtitle: { top: "30%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "37.6%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "53%", left: "50%", transform: "translateX(-50%)" },
        date: { bottom: "16%", left: "66.7%" },
        sign: { bottom: "13%", left: "25%", },
        teacherName: { bottom: "19%", left: "70%", },
        managerName: { bottom: "19%", right: "60%", },
    },
    formDisplayedFields: {
        formDate: false,
        formSign: false,
    }
};

export const Template4: CertificateTemplate = {
    background: Template4background,
    classNames: {
        title: "absolute font-sharjah text-[134px] text-[#5f7f80]",
        subtitle: "absolute font-alhoda text-4xl text-[#e07a3d]",
        name: "absolute font-bold text-8xl text-[#5f7f80] whitespace-nowrap",
        line2: "absolute text-5xl text-center text-[#4a6a92]",
        date: "absolute text-3xl text-[#333333] hidden",
        sign: "absolute text-3xl text-[#333333] hidden",
        teacherName: "absolute text-[40px] flex flex-col items-center gap-3",
        managerName: "absolute text-[40px] flex flex-col items-center gap-3",
    },
    positions: {
        title: { top: "8%", left: "50%", transform: "translateX(-50%)" },
        subtitle: { top: "30%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "37.6%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "53%", left: "50%", transform: "translateX(-50%)" },
        date: { bottom: "16%", left: "66.7%" },
        sign: { bottom: "13%", left: "25%", },
        teacherName: { bottom: "19%", left: "70%", },
        managerName: { bottom: "19%", right: "70%", },
    },
    formDisplayedFields: {
        formDate: false,
        formSign: false,
    }
};



export const Template5: CertificateTemplate = {
    background: Template5background,
    classNames: {
        title: "absolute font-almaria font-bold text-[60px] text-[#61678a]",
        subtitle: "absolute font-amiri text-[80px] text-[#61678a] whitespace-nowrap",
        name: "absolute font-amiri text-[90px] text-[#825939] whitespace-nowrap",
        line2: "absolute text-[50px] text-center font-semibold font-amiri text-[#5f6480] space-y-5",
        date: "absolute text-3xl hidden",
        sign: "absolute text-3xl",

        teacherName: "absolute text-[40px] flex flex-col items-center gap-3",

        managerName: "absolute text-[40px] flex flex-col items-center gap-3",
    },
    positions: {
        title: { top: "11.8%", left: "50%", transform: "translateX(-50%)" },
        subtitle: { top: "25%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "35%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "46%", left: "50%", transform: "translateX(-50%)" },

        // date: { bottom: "16%", left: "66.7%" },
        sign: { bottom: "4%", left: "29.2%" },

        teacherName: { bottom: "19%", left: "70%", },

        managerName: { bottom: "19%", right: "70%", },
    },
};


export const Template6: CertificateTemplate = {
    background: Template6background,
    classNames: {
        title: "absolute font-cairo font-bold text-[85px] text-[#61678a]",
        subtitle: "absolute font-amiri text-[90px] text-[#61678a] max-w-4xl text-center",
        name: "absolute font-amiri text-[90px] text-[#8b5e3c] whitespace-nowrap",
        line2: "absolute text-[60px] text-center font-semibold font-amiri text-[#5f6480] leading-20",
        date: "absolute text-3xl hidden",
        sign: "absolute text-3xl",

        teacherName: "absolute text-[40px] text-[#8b5e3c] font-bold font-cairo flex flex-col items-center gap-2",

        managerName: "absolute text-[40px] text-[#8b5e3c] font-bold font-cairo flex flex-col items-center gap-2",
    },
    positions: {
        title: { top: "9.8%", left: "50%", transform: "translateX(-50%)" },
        subtitle: { top: "19%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "40%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "52%", left: "50%", transform: "translateX(-50%)" },

        // date: { bottom: "16%", left: "66.7%" },
        sign: { bottom: "4%", left: "29.2%" },

        teacherName: { bottom: "17%", left: "76%", },

        managerName: { bottom: "17%", left: "24%", transform: "translateX(-100%)" },
    },
};

export const Template7: CertificateTemplate = {
    background: Template7background,
    classNames: {
        title: "absolute font-cairo font-bold text-[85px] text-[#61678a]",
        subtitle: "absolute font-amiri text-[90px] text-[#61678a] max-w-4xl text-center",
        name: "absolute font-amiri text-[90px] text-[#8b5e3c] whitespace-nowrap",
        line2: "absolute text-[60px] text-center font-semibold font-amiri text-[#5f6480] leading-20",
        date: "absolute text-3xl hidden",
        sign: "absolute text-3xl",

        teacherName: "absolute text-[40px] text-[#8b5e3c] font-bold font-cairo flex flex-col items-center gap-2",

        managerName: "absolute text-[40px] text-[#8b5e3c] font-bold font-cairo flex flex-col items-center gap-2",
    },
    positions: {
        title: { top: "9.8%", left: "50%", transform: "translateX(-50%)" },
        subtitle: { top: "19%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "40%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "52%", left: "50%", transform: "translateX(-50%)" },

        // date: { bottom: "16%", left: "66.7%" },
        sign: { bottom: "4%", left: "29.2%" },

        teacherName: { bottom: "17%", left: "76%", },

        managerName: { bottom: "17%", left: "24%", transform: "translateX(-100%)" },
    },
};

export const Template8: CertificateTemplate = {
    background: Template8background,
    classNames: {
        title: "absolute font-cairo font-bold text-[85px] text-black",
        subtitle: "absolute font-amiri text-[90px] text-center text-black whitespace-nowrap",
        name: "absolute font-amiri text-[90px] text-[#8b5e3c] whitespace-nowrap",
        line2: "absolute text-[65px] text-center font-semibold text-black font-cairo leading-20",
        date: "absolute text-3xl hidden",
        sign: "absolute text-3xl",

        teacherName: "absolute text-[40px] text-[#8b5e3c] font-bold font-cairo flex flex-col items-center gap-2",

        managerName: "absolute text-[40px] text-[#8b5e3c] font-bold font-cairo flex flex-col items-center gap-2",
    },
    positions: {
        title: { top: "9.8%", left: "50%", transform: "translateX(-50%)" },
        subtitle: { top: "19%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "30%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "45%", left: "50%", transform: "translateX(-50%)" },

        // date: { bottom: "16%", left: "66.7%" },
        sign: { bottom: "4%", left: "29.2%" },

        teacherName: { bottom: "17%", left: "76%", },

        managerName: { bottom: "17%", left: "24%", transform: "translateX(-100%)" },
    },
};

export const Template9: CertificateTemplate = {
    background: Template9background,
    classNames: {
        title: "absolute font-tajawal text-[70px] text-center text-black whitespace-nowrap",
        name: "absolute font-tajawal text-[90px] text-[#de7284] whitespace-nowrap",
        line2: "absolute text-[65px] text-center font-semibold text-black font-tajawal leading-20",
        date: "absolute text-3xl hidden",
        sign: "absolute text-3xl",

        teacherName: "absolute text-[40px] text-[#de7284] font-bold font-tajawal flex flex-col items-center gap-2",
        managerName: "absolute text-[40px] text-[#de7284] font-bold font-tajawal flex flex-col items-center gap-2",
    },
    positions: {
        title: { top: "32%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "40%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "50%", left: "50%", transform: "translateX(-50%)" },

        // date: { bottom: "16%", left: "66.7%" },
        sign: { bottom: "4%", left: "29.2%" },

        teacherName: { bottom: "14%", left: "76%", },

        managerName: { bottom: "14%", left: "50%", transform: "translateX(-100%)" },
    },
    formDisplayedFields: {
        formSubtitle: false,
    }
};