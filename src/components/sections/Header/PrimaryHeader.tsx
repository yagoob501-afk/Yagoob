import PrimaryLogo from "@/components/ui/Logo/PrimaryLogo";
// import { useTranslation } from "react-i18next";
// import { HashLink } from "react-router-hash-link";
import { Youtube, Send, Instagram } from "lucide-react";

function PrimaryHeader() {
  // const { t } = useTranslation();

  return (
    <header className="bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground shadow-lg">
      {/* Mobile Header */}
      <div className="lg:hidden">
        {/* Top Section - Logo and Title */}
        <div className="flex items-center justify-center px-4 py-4 border-b border-primary-foreground/10 bg-accent-foreground">
          {/* Logo */}
          <div className="shrink-0 ml-4">
            <PrimaryLogo imgOnly />
          </div>

          {/* Title Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-bold leading-tight text-primary-foreground">
              منصة أدوات تعليمية
            </h2>
            <p className="text-xs text-[--color-text-light-solid]">
              إعداد أ. يعقوب يوسف العنزي
            </p>
            <p className="text-xs text-[--color-text-light-solid]">
              للتواصل و الإستفسار
            </p>

            {/* Social Icons Section */}
            <div className="flex items-center gap-4 mt-1">
              <a
                href="https://t.me/Group_teacher_yagoob"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-200"
              >
                <Send size={20} className="text-primary-foreground drop-shadow-md" />
              </a>

              <a
                href="https://www.instagram.com/yaqoub.alanazi/?igsh=MWVlcGt0aGM3bWo0MA%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-200"
              >
                <Instagram size={20} className="text-primary-foreground drop-shadow-md" />
              </a>

              <a
                href="https://youtube.com/@yaqoob_alenezi?si=7eY7zhbArjjAhtEZ"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-200"
              >
                <Youtube size={20} className="text-primary-foreground drop-shadow-md" />
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        {/* <nav className="flex items-center justify-center gap-6 px-4 py-3 border-t border-primary-foreground/10">
          <HashLink
            to="/"
            className="text-sm font-medium text-[--color-text-light-solid] hover:text-primary-foreground hover:scale-105 transition-all duration-200"
          >
            {t("home")}
          </HashLink>
          <HashLink
            to="/about"
            className="text-sm font-medium text-[--color-text-light-solid] hover:text-primary-foreground hover:scale-105 transition-all duration-200"
          >
            {t("about")}
          </HashLink>
          <HashLink
            to="/about#join-us"
            className="text-sm font-medium text-[--color-text-light-solid] hover:text-primary-foreground hover:scale-105 transition-all duration-200"
          >
            {t("join us")}
          </HashLink>
        </nav> */}
      </div>

      {/* Desktop/Tablet Header */}
      <div className="hidden lg:block">
        {/* Top Section - Logo and Title */}
        <div className="border-b border-primary-foreground/10 bg-accent-foreground">
          <div className="container mx-auto px-6 py-5">
            <div className="flex items-center justify-center gap-6">
              {/* Logo */}
              <div className="shrink-0">
                <PrimaryLogo imgOnly />
              </div>

              {/* Title Section */}
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold text-primary-foreground leading-tight">
                  منصة أدوات تعليمية
                </h2>
                <p className="text-sm text-[--color-text-light-solid]">
                  إعداد أ. يعقوب يوسف العنزي
                </p>
                <p className="text-sm text-[--color-text-light-solid]">
                  للتواصل و الإستفسار
                </p>

                {/* Social Icons Section */}
                <div className="flex items-center justify-center gap-4 mt-1">
                  <a
                    href="https://t.me/Group_teacher_yagoob"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                  >
                    <Send size={20} className="text-primary-foreground drop-shadow-md" />
                  </a>

                  <a
                    href="https://www.instagram.com/yaqoub.alanazi/?igsh=MWVlcGt0aGM3bWo0MA%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                  >
                    <Instagram size={20} className="text-primary-foreground drop-shadow-md" />
                  </a>

                  <a
                    href="https://youtube.com/@yaqoob_alenezi?si=7eY7zhbArjjAhtEZ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                  >
                    <Youtube size={20} className="text-primary-foreground drop-shadow-md" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        {/* <nav className="flex items-center justify-center gap-8 px-6 py-3 border-t border-primary-foreground/10">
          <HashLink
            to="/"
            className="text-base font-medium text-[--color-text-light-solid] hover:text-primary-foreground hover:scale-105 transition-all duration-200"
          >
            {t("home")}
          </HashLink>
          <HashLink
            to="/about"
            className="text-base font-medium text-[--color-text-light-solid] hover:text-primary-foreground hover:scale-105 transition-all duration-200"
          >
            {t("about")}
          </HashLink>
          <HashLink
            to="/about#join-us"
            className="text-base font-medium text-[--color-text-light-solid] hover:text-primary-foreground hover:scale-105 transition-all duration-200"
          >
            {t("join us")}
          </HashLink>
        </nav> */}
      </div>
    </header>
  );
}

export default PrimaryHeader;