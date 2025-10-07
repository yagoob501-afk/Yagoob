"use client"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import Video from "@/assets/home-hero-video.mp4"

function PrimaryHeroSection() {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(true)
    const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 })

    const handleLoadedMetadata = (e: any) => {
        const video = e.target
        setVideoDimensions({
            width: video.videoWidth,
            height: video.videoHeight
        })
        setIsLoading(false)
    }

    return (
        <motion.section
            className="flex flex-col text-center py-7 xl:text-start relative gap-14 xl:flex-row justify-between mx-auto min-h-[70vh] px-14"
        >
            {/* background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-bg-base via-text-muted/20 to-primary/10"></div>
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            {/* text content */}
            <div className="grow w-full space-y-8 flex flex-col justify-center">
                <motion.h1 className="text-4xl">
                    {t("sections.primary hero.title")}
                </motion.h1>

                <motion.h2 className="text-lg leading-relaxed text-text-muted">
                    {t("sections.primary hero.subtitle")}
                </motion.h2>
            </div>

            {/* video container */}
            <div className="grow w-full self-center z-100">
                <motion.div
                    className="relative rounded-xl overflow-hidden border-2 border-primary"
                    style={{
                        aspectRatio: videoDimensions.width && videoDimensions.height
                            ? `${videoDimensions.width} / ${videoDimensions.height}`
                            : '16 / 9'
                    }}
                >
                    {/* Loading Overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-gradient-to-br from-bg-base to-primary/10 flex items-center justify-center z-10">
                            <div className="flex flex-col items-center gap-4">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Loader2 className="w-12 h-12 text-primary" />
                                </motion.div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-text-muted text-sm"
                                >
                                    جارٍ تحميل الفيديو...
                                </motion.p>
                            </div>
                        </div>
                    )}

                    {/* Video Element */}
                    <video
                        autoPlay={false}
                        controls={true}
                        className="w-full h-full object-cover"
                        onLoadedMetadata={handleLoadedMetadata}
                        preload="metadata"
                    >
                        <source src={Video} type="video/mp4" />
                    </video>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default PrimaryHeroSection