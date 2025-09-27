import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { HTMLAttributes } from "react";


interface Props {
    title: string;
    containerProps?: HTMLAttributes<HTMLDivElement>;
    h4Props?: HTMLAttributes<HTMLHeadingElement>;
    arrowProps?: HTMLAttributes<HTMLDivElement>;
}

function PrimarySectionTitle({ title, containerProps, h4Props, arrowProps }: Props) {
    return (
        <div
            {...containerProps}
            className={`flex items-center justify-center gap-3 ${containerProps?.className || ""}`}
        >
            <h4
                {...h4Props}
                className={`text-3xl font-semibold text-center ${h4Props?.className || ""}`}
            >
                {title}
            </h4>

            {/* Animated Arrow */}
            <motion.div
                {...arrowProps as any}
                animate={{ y: [0, 8, 0] }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                }}
                className={`text-primary ${arrowProps?.className || ""}`}
            >
                <ChevronDown className="w-6 h-6" />
            </motion.div>
        </div>
    );
}

export default PrimarySectionTitle;
