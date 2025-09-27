import { Link } from "react-router-dom";
// import Img3 from "@/assets/3.png";
import Img4 from "@/assets/4.png";
// import Img5 from "@/assets/5.png";

function PrimaryHeader() {
    return (
        <header className="bg-primary text-primary-foreground shadow-md px-6">
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-0">
                {/* Logo */}
                <div className="flex justify-center md:justify-start">
                    <Link to="/">
                        <img src={Img4} alt="Logo" className="max-w-14" />
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex flex-wrap justify-center gap-6 md:justify-end">
                    <Link
                        to="/"
                        className="text-[--color-text-light-solid] hover:text-[--color-primary-foreground] hover:underline transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        to="/#about"
                        className="text-[--color-text-light-solid] hover:text-[--color-primary-foreground] hover:underline transition-colors"
                    >
                        About
                    </Link>
                    <Link
                        to="/#services"
                        className="text-[--color-text-light-solid] hover:text-[--color-primary-foreground] hover:underline transition-colors"
                    >
                        Services
                    </Link>
                    <Link
                        to="/#contact"
                        className="text-[--color-text-light-solid] hover:text-[--color-primary-foreground] hover:underline transition-colors"
                    >
                        Contact
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default PrimaryHeader;
