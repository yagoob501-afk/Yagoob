import Template1background from "@/assets/certificates_backgrounds/شهادة تقدير لبني وأبيض.png";
import Template2background from "@/assets/certificates_backgrounds/certificate-background-2.jpeg";
import Template3background from "@/assets/certificates_backgrounds/certificate-background-3.jpeg";
import Template4background from "@/assets/certificates_backgrounds/certificate-background-4.jpeg";
import Template5background from "@/assets/certificates_backgrounds/certificate-background-5.png";
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
        title: { top: "7.3%", left: "50%", transform: "translateX(-50%)" },
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
        subtitle: "absolute font-alhoda text-4xl text-[#3f588a]",
        name: "absolute font-bold text-9xl text-[#d4b365] whitespace-nowrap",
        line2: "absolute text-5xl text-center text-[#293d5e]",
        date: "absolute text-3xl hidden",
        sign: "absolute text-3xl",

        teacherName: "absolute text-3xl font-bold font-cairo flex flex-col items-center text-[#865e41]",
        managerName: "absolute text-3xl font-bold font-cairo flex flex-col items-center text-[#865e41]",
    },
    positions: {
        title: { top: "3.5%", left: "50%", transform: "translateX(-50%)" },
        subtitle: { top: "25%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "31.6%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "53%", left: "50%", transform: "translateX(-50%)" },
        // date: { bottom: "16%", left: "66.7%" },
        sign: { bottom: "4%", left: "29.2%" },

        teacherName: { bottom: "16%", left: "69.2%", },

        managerName: { bottom: "16%", left: "29.2%", },
    },
};

export const Template3: CertificateTemplate = {
    background: Template3background,
    classNames: {
        title: "absolute font-sharjah text-[134px] text-[#5f7f80]",
        subtitle: "absolute font-alhoda text-4xl text-[#e07a3d]",
        name: "absolute font-bold text-8xl text-[#5f7f80] whitespace-nowrap",
        line2: "absolute text-5xl text-center text-[#4a6a92]",
        date: "absolute text-3xl text-[#333333]",
        sign: "absolute text-3xl text-[#333333]",
    },
    positions: {
        title: { top: "8%", left: "50%", transform: "translateX(-50%)" },
        subtitle: { top: "30%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "37.6%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "53%", left: "50%", transform: "translateX(-50%)" },
        date: { bottom: "16%", left: "66.7%" },
        sign: { bottom: "13%", left: "25%", },
    },
};

export const Template4: CertificateTemplate = {
    background: Template4background,
    classNames: {
        title: "absolute font-sharjah text-[134px] text-[#5f7f80]",
        subtitle: "absolute font-alhoda text-4xl text-[#e07a3d]",
        name: "absolute font-bold text-8xl text-[#5f7f80] whitespace-nowrap",
        line2: "absolute text-5xl text-center text-[#4a6a92]",
        date: "absolute text-3xl text-[#333333]",
        sign: "absolute text-3xl text-[#333333]",
    },
    positions: {
        title: { top: "8%", left: "50%", transform: "translateX(-50%)" },
        subtitle: { top: "30%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "37.6%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "53%", left: "50%", transform: "translateX(-50%)" },
        date: { bottom: "16%", left: "66.7%" },
        sign: { bottom: "13%", left: "25%", },
    },
};



export const Template5: CertificateTemplate = {
    background: Template5background,
    classNames: {
        title: "absolute font-almaria font-bold text-[60px] text-[#61678a]",
        subtitle: "absolute font-almaria text-4xl text-[#61678a]",
        name: "absolute font-amiri text-9xl text-[#825939] whitespace-nowrap",
        line2: "absolute text-5xl text-center font-semibold font-amiri text-[#5f6480]",
        date: "absolute text-3xl hidden",
        sign: "absolute text-3xl",

        teacherName: "absolute text-3xl flex flex-col items-center gap-3",

        managerName: "absolute text-3xl flex flex-col items-center gap-3",
    },
    positions: {
        title: { top: "9.5%", left: "50%", transform: "translateX(-50%)" },
        subtitle: { top: "25%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "31.6%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "49%", left: "50%", transform: "translateX(-50%)" },

        // date: { bottom: "16%", left: "66.7%" },
        sign: { bottom: "4%", left: "29.2%" },

        teacherName: { bottom: "17%", left: "69.2%", },

        managerName: { bottom: "17%", right: "69.2%", },
    },
};