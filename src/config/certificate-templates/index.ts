import Template2background from "@/assets/certificates_backgrounds/certificate-background-2.jpeg";

export const Template2 = {
    background: Template2background,
    classNames: {
        title: "absolute font-sharjah text-[134px] text-[#d4b365]",
        subtitle: "absolute font-alhoda text-4xl text-[#d4b365]",
        name: "absolute font-bold text-4xl text-[#d4b365]",
        line2: "absolute text-3xl text-[#d4b365]",
        date: "absolute text-3xl",
        sign: "absolute text-3xl",
    },
    positions: {
        title: { top: "3.5%", left: "50%", transform: "translateX(-50%)" },
        subtitle: { top: "25%", left: "50%", transform: "translateX(-50%)" },
        name: { top: "31%", left: "50%", transform: "translateX(-50%)" },
        line2: { top: "42.5%", left: "50%", transform: "translateX(-50%)" },
        date: { bottom: "16%", left: "66.7%" },
        sign: { bottom: "13%", right: "66.7%" },
    },
};

