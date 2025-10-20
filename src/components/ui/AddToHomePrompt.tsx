import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AddToHomePrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Listen for the event that indicates install is available
        const handler = (e: any) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setVisible(true)
        }

        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

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
            {/* 🔹 الخلفية الشفافة + الـ blur */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setVisible(false)}
            />

            {/* 🔸 مربع التنبيه */}
            <div className="relative bg-white text-heading shadow-2xl rounded-2xl px-6 py-5 w-[90%] max-w-md flex flex-col items-center gap-4 z-50 animate-in fade-in zoom-in">
                <button
                    className="absolute top-3 right-3 text-muted-foreground hover:text-heading transition cursor-pointer"
                    onClick={() => setVisible(false)}
                >
                    <X />
                </button>

                <img src="/logo-main.png" alt="App logo" className="max-w-32 rounded-md" />

                <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold font-amiri">نماذج جاهزة للطباعة وأدوات مساعدة</h3>
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
            </div>
        </div>
    )
}
