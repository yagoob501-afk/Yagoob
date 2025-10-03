import { HashLink } from 'react-router-hash-link'
import { useTranslation } from "react-i18next";
import Logo from "@/assets/logo-main.jpeg";

function PrimaryLogo() {
    const { t } = useTranslation();

    return (
        <div className="flex justify-center items-center lg:justify-start w-full">
            <HashLink to="/" className='flex items-center gap-4'>
                <img src={Logo} alt="Logo" className="max-w-14" />
                <p className="text-lg">{t("logo_text")}</p>
            </HashLink>
        </div>)
}

export default PrimaryLogo