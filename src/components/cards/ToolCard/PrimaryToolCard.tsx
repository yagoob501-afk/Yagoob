import { Link } from "react-router-dom";

interface Props {
    title: string;
    description: string;
    link: string | null;
    img: any;
}

function PrimaryToolCard({ title, description, link, img }: Props) {
    return (
        <Link
            to={link || "#"}
            className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl p-6 flex flex-col gap-4 aspect-square shadow-md hover:shadow-lg transition-all w-full"
        >
            {/* Title */}
            <h5 className="text-2xl font-semibold leading-snug text-center font-cairo">
                {title}
            </h5>

            {/* Image (takes full width, fixed height) */}
            {img && (
                <div className="flex-1 flex items-center justify-center">
                    <img
                        src={img}
                        alt=""
                        className="w-full max-h-40"
                    />
                </div>
            )}

            {/* Description */}
            <p className="opacity-90 line-clamp-3 text-center text-xl font-almaria font-bold">
                {description}
            </p>
        </Link>
    );
}

export default PrimaryToolCard;
