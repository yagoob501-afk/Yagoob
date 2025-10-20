import { X, Share } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AddToHomePrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
    const [visible, setVisible] = useState(false)
    const [showManualHint, setShowManualHint] = useState(false)

    useEffect(() => {
        let timer: number;

        // ⏳ بعد 10 ثوانٍ من فتح الموقع نظهر التنبيه (سواء وجدنا event أم لا)
        timer = setTimeout(() => {
            setVisible(true)
            // لو لم يصل beforeinstallprompt بعد، نظهر المربع الإرشادي
            if (!deferredPrompt) {
                setShowManualHint(true)
            }
        }, 10000)

        // 🎯 عند حدوث beforeinstallprompt
        const handler = (e: any) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setShowManualHint(false)
            setVisible(true)
        }

        window.addEventListener('beforeinstallprompt', handler)

        return () => {
            clearTimeout(timer)
            window.removeEventListener('beforeinstallprompt', handler)
        }
    }, [deferredPrompt])

    const handleInstall = async () => {
        if (!deferredPrompt) return
        const prompt = deferredPrompt as any
        prompt.prompt()
        const result = await prompt.userChoice

        if (result.outcome === 'accepted') {
            console.log('User accepted the install prompt')
        } else {
            console.log('User dismissed the install prompt')
        }

        setDeferredPrompt(null)
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 🔹 خلفية شفافة */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setVisible(false)}
            />

            {/* 🔸 مربع الإشعار */}
            <div className="relative bg-white text-heading shadow-2xl rounded-2xl px-6 py-5 w-[90%] max-w-md flex flex-col items-center gap-4 z-50 animate-in fade-in zoom-in">
                <button
                    className="absolute top-3 right-3 text-muted-foreground hover:text-heading transition cursor-pointer"
                    onClick={() => setVisible(false)}
                >
                    <X />
                </button>

                <img src="/logo-main.png" alt="App logo" className="max-w-32 rounded-md" />

                {showManualHint ? (
                    // 💡 الحالة عندما لا يوجد beforeinstallprompt
                    <div className="text-center space-y-3">
                        <h3 className="text-lg font-bold font-amiri">
                            أضف التطبيق إلى شاشتك الرئيسية
                        </h3>

                        <p className="font-almaria text-muted-foreground">
                            أضف تطبيق "yaqoubalenezi" إلى شاشتك الرئيسية لسهولة الوصول وتجربة أفضل.
                        </p>
                        <hr />

                        <p className="font-cairo text-muted-foreground flex items-center justify-center gap-1 flex-wrap text-center leading-relaxed">
                            اضغط على الأيقونة
                            <Share size={20} className="inline-block mx-1 text-muted-foreground" />
                            في الأعلى ثم اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong>.
                        </p>
                    </div>
                ) : (
                    // 🚀 الحالة عندما يوجد beforeinstallprompt
                    <>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold font-amiri">
                                نماذج جاهزة للطباعة وأدوات مساعدة
                            </h3>
                            <p className="font-medium font-cairo text-muted-foreground">
                                أضف تطبيق "yaqoubalenezi" إلى شاشتك الرئيسية لسهولة الوصول وتجربة أفضل.
                            </p>
                        </div>

                        <button
                            onClick={handleInstall}
                            className="bg-primary text-white px-4 py-3 w-full rounded-md text-sm hover:bg-primary-hover transition cursor-pointer"
                        >
                            إضافة إلى الشاشة الرئيسية
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
