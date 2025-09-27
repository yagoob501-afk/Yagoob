import { Link } from "react-router-dom";
// import Img3 from "@/assets/3.png";
import Img4 from "@/assets/4.png";
import { useTranslation } from "react-i18next";
// import Img5 from "@/assets/5.png";

function PrimaryHeader() {
    const { t } = useTranslation();

    return (
        <header className="bg-primary text-primary-foreground shadow-md px-6 py-4">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between lg:gap-0">
                {/* Logo */}
                <div className="flex justify-center items-center lg:justify-start w-full">
                    <Link to="/">
                        <img src={Img4} alt="Logo" className="max-w-14 -mb-5" />
                    </Link>

                    <p className="text-lg">{t("logo_text")}</p>
                </div>

                {/* Navigation */}
                <nav className="flex flex-wrap justify-center gap-6 lg:justify-end w-full">
                    <Link
                        to="/"
                        className="text-[--color-text-light-solid] hover:text-[--color-primary-foreground] hover:underline transition-colors"
                    >
                        {t("home")}
                    </Link>
                    <Link
                        to="/#about"
                        className="text-[--color-text-light-solid] hover:text-[--color-primary-foreground] hover:underline transition-colors"
                    >
                        {t("about")}
                    </Link>
                    <Link
                        to="/#services"
                        className="text-[--color-text-light-solid] hover:text-[--color-primary-foreground] hover:underline transition-colors"
                    >
                        {t("services")}
                    </Link>
                    <Link
                        to="/#contact"
                        className="text-[--color-text-light-solid] hover:text-[--color-primary-foreground] hover:underline transition-colors"
                    >
                        {t("contact")}
                    </Link>
                </nav>

                <div className="w-full"></div>
            </div>
        </header>
    );
}

export default PrimaryHeader;
