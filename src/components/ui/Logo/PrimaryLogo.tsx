"use client";

import { useState } from "react";
import { HashLink } from "react-router-hash-link";
import { useTranslation } from "react-i18next";
import Logo from "@/assets/logo-main.png";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

function PrimaryLogo({ imgOnly }: { imgOnly?: boolean }) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex justify-center items-center lg:justify-start w-full">
            <HashLink to="/" className="flex items-center gap-4">
                <img
                    src={Logo}
                    alt="Logo"
                    className="max-w-14 cursor-pointer bg-[#f5f3da]"
                    onClick={() => setIsOpen(true)}
                />
                {
                    imgOnly !== true && (
                        <p className="text-lg cursor-pointer">
                            {t("logo_text")}
                        </p>
                    )
                }
            </HashLink>

            {/* Lightbox */}
            {isOpen && (
                <Lightbox
                    open={isOpen}
                    close={() => setIsOpen(false)}
                    slides={[{ src: Logo }]}
                />
            )}
        </div>
    );
}

export default PrimaryLogo;
