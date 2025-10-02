import Template1background from "@/assets/certificates_backgrounds/شهادة تقدير لبني وأبيض.png";
import Template2background from "@/assets/certificates_backgrounds/certificate-background-2.jpeg";

export const Template1 = {
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


export const Template2 = {
    background: Template2background,
    classNames: {
        title: "absolute font-sharjah text-[134px] text-[#293d5e]",
        subtitle: "absolute font-alhoda text-4xl text-[#3f588a]",
        name: "absolute font-bold text-9xl text-[#d4b365] whitespace-nowrap",
        line2: "absolute text-5xl text-center text-[#293d5e]",
        date: "absolute text-3xl",
        sign: "absolute text-3xl",
    },
    positions: {
        title: { top: "3.5%", left: "50%", transform: "translateX(-50%)" },
        subtitle: { top: "25%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "31.6%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "53%", left: "50%", transform: "translateX(-50%)" },
        date: { bottom: "16%", left: "66.7%" },
        sign: { bottom: "13%", right: "66.7%" },
    },
};

