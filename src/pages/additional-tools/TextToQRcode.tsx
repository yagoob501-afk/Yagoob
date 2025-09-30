"use client"

import { useState, useRef, useCallback } from "react"
import { QRCodeCanvas } from "qrcode.react"
import PrimaryFooter from "@/components/sections/Footer/PrimaryFooter"
import PrimaryHeader from "@/components/sections/Header/PrimaryHeader"
import { ArrowLeft, Image } from "lucide-react"
import { BounceLoading } from "respinner"

function TextToQRcodePage() {
    const [isDownloading, setIsDownloading] = useState(false);
    const [text, setText] = useState("")
    const [qrValue, setQrValue] = useState("")
    const qrRef = useRef(null)

    const handleGenerate = useCallback(() => {
        setQrValue(text.trim())
    }, [text])

    const handleDownload = useCallback(() => {
        if (!qrRef.current) return
        setIsDownloading(true);
        const canvas = (qrRef.current as any).querySelector("canvas")
        if (canvas) {
            const url = canvas.toDataURL("image/png")
            const link = document.createElement("a")
            link.href = url
            link.download = "qrcode.png"
            link.click()
        }

        setTimeout(() => {
            setIsDownloading(false);
        }, 400);

    }, [qrRef]);

    return (
        <div className="grow flex flex-col justify-between gap-7 min-h-screen bg-surface text-foreground">
            <PrimaryHeader />

            <main className="flex justify-center items-center flex-1 px-4">
                <div className="bg-border-secondary container mx-auto max-w-2xl p-8 rounded-2xl shadow-lg transition-shadow relative">

                    {isDownloading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center 
                  bg-black/40 backdrop-blur-sm rounded-2xl z-20">
                            <BounceLoading stroke="#3b82f6" className="" />
                            <p className="mt-3 text-sm font-medium text-white/90 animate-pulse">
                                جاري التحميل...
                            </p>
                        </div>
                    )}


                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-heading mb-2">
                            تحويل النص إلى رمز الاستجابة السريعة
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            يمكنك إضافة نص عادي أو رابط أو عدة روابط، فقط قم بكتابة ما تريد
                            تحويله وسنقوم بتحويله من أجلك.
                        </p>
                    </div>

                    <textarea
                        className="w-full h-32 p-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary mb-4 resize-none"
                        placeholder="أدخل النص أو الرابط هنا..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <button
                        onClick={handleGenerate}
                        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-md hover:scale-[1.02] transition-all"
                    >
                        توليد QR Code
                    </button>

                    {qrValue && (
                        <div className="flex flex-col items-center mt-6">
                            <div
                                ref={qrRef}
                                className="bg-white p-4 rounded-xl shadow-lg"
                            >
                                <QRCodeCanvas value={qrValue} size={200} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                                امسح الكود باستخدام كاميرا الهاتف لفتح النص أو الرابط
                            </p>
                        </div>
                    )}

                    {qrValue && (
                        <div className="flex justify-around mt-10 gap-4">
                            <button
                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors duration-300"
                            >
                                العودة للرئيسية <ArrowLeft size={18} />
                            </button>

                            <button
                                onClick={handleDownload}
                                className="cursor-pointer flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-md hover:scale-[1.03] transition-all"
                            >
                                تحميل <Image size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <PrimaryFooter />
        </div>
    )
}

export default TextToQRcodePage
