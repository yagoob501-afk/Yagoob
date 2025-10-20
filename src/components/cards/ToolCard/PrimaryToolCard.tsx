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
            className="h-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl p-6 flex flex-col gap-4  shadow-md hover:shadow-lg transition-all w-full overflow-hidden"
        >
            {/* Title */}
            <h5 className="text-2xl font-semibold leading-snug text-center font-cairo">
                {title}
            </h5>

            {/* Image (contained properly) */}
            {img && (
                <div className="flex-1 flex items-center justify-center">
                    <img
                        src={img}
                        alt=""
                        className="max-h-[90%] max-w-full object-contain rounded-lg"
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
