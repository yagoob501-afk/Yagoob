import { HashLink } from 'react-router-hash-link'
import { useTranslation } from "react-i18next";
import Img4 from "@/assets/4.png";

function PrimaryLogo() {
    const { t } = useTranslation();

    return (
        <div className="flex justify-center items-center lg:justify-start w-full">
            <HashLink to="/">
                <img src={Img4} alt="Logo" className="max-w-14 -mb-5" />
            </HashLink>

            <p className="text-lg">{t("logo_text")}</p>
        </div>)
}

export default PrimaryLogo