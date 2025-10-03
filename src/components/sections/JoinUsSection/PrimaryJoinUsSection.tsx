import { Youtube, Send, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";

function PrimaryJoinUsSection() {
    const { t } = useTranslation();

    return (
        <section
            className="bg-cta-bg text-cta-foreground py-16 px-6 rounded-2xl shadow-lg container mx-auto text-center"
            id="join-us"
        >
            {/* Title & Message */}
            <h2 className="text-3xl font-bold mb-4">
                {t("sections.primary join.title")}
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
                {t("sections.primary join.subtitle")}
            </p>

            {/* CTA Button */}
            <a
                href="https://paypal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary-hover active:bg-primary-active transition-colors mb-8"
            >
                {t("sections.primary join.cta")}
            </a>

            {/* Social Links */}
            <div className="flex justify-center gap-6 text-xl">
                <a
                    href="https://youtube.com/@yaqoob_alenezi?si=7eY7zhbArjjAhtEZ"
                    className="hover:text-primary transition-transform transform hover:scale-110"
                    aria-label="YouTube"
                    target="_blank"
                >
                    <Youtube size={28} />
                </a>
                <a
                    href="https://t.me/Group_teacher_yagoob"
                    className="hover:text-primary transition-transform transform hover:scale-110"
                    aria-label="Telegram"
                    target="_blank"
                >
                    <Send size={28} />
                </a>
                <a
                    href="https://www.instagram.com/yagoob_0?igsh=MWVlcGt0aGM3bWo0MA%3D%3D&utm_source=qr"
                    className="hover:text-primary transition-transform transform hover:scale-110"
                    aria-label="Instagram"
                    target="_blank"
                >
                    <Instagram size={28} />
                </a>
            </div>
        </section>
    );
}

export default PrimaryJoinUsSection;
