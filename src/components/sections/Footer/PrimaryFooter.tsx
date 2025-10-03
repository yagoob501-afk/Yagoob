import { Link } from "react-router-dom";
import Img4 from "@/assets/4.png";
import { useTranslation } from "react-i18next";
import { Youtube, Send, Instagram } from "lucide-react";
import { HashLink } from "react-router-hash-link";

function PrimaryFooter() {
    const { t } = useTranslation();

    return (
        <footer className="bg-primary text-primary-foreground px-6 pt-10 pb-6 shadow-inner">
            <div className="container mx-auto flex flex-col gap-8 lg:flex-row lg:justify-between lg:items-start">
                {/* Logo + text */}
                <div className="flex flex-col items-center lg:items-start">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={Img4} alt="Logo" className="max-w-14" />
                        <p className="text-lg font-semibold">{t("logo_text")}</p>
                    </Link>
                    <p className="mt-3 text-sm text-center lg:text-start max-w-xs">
                        {t("sections.primary footer.description") || "We provide tools and resources to make your journey easier."}
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col items-center gap-3 lg:items-start">
                    <HashLink
                        to="/"
                        className="hover:underline hover:text-primary-foreground"
                    >
                        {t("home")}
                    </HashLink>
                    <HashLink
                        to="/#about"
                        className="hover:underline hover:text-primary-foreground"
                    >
                        {t("about")}
                    </HashLink>
                    <HashLink
                        to="/#tools"
                        className="hover:underline hover:text-primary-foreground"
                    >
                        {t("tools")}
                    </HashLink>
                    <HashLink
                        to="/#join-us"
                        className="hover:underline hover:text-primary-foreground"
                    >
                        {t("join us")}
                    </HashLink>
                </nav>

                {/* Socials */}
                <div className="flex flex-col items-center lg:items-start">
                    <p className="font-semibold mb-3">{t("follow_us") || "Follow us"}</p>
                    <div className="flex gap-4 text-xl">
                        <a href="https://t.me/Group_teacher_yagoob" target="_blank" className="hover:text-primary-foreground transition-colors">
                            <Send size={20} />
                        </a>

                        <a href="https://www.instagram.com/yagoob_0?igsh=MWVlcGt0aGM3bWo0MA%3D%3D&utm_source=qr" target="_blank" className="hover:text-primary-foreground transition-colors">
                            <Instagram size={20} />
                        </a>

                        <a href="https://youtube.com/@yaqoob_alenezi?si=7eY7zhbArjjAhtEZ" target="_blank" className="hover:text-primary-foreground transition-colors">
                            <Youtube size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Divider + Copyright */}
            <div className="border-t border-[--color-text-light-solid]/30 mt-8 pt-4 text-center text-sm text-[--color-text-light-solid]">
                © 2025 {t("logo_text")} — {t("all_rights_reserved")}
            </div>
        </footer>
    );
}

export default PrimaryFooter;
