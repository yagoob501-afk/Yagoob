import PrimaryFooter from '@/components/sections/Footer/PrimaryFooter'
import PrimaryHeader from '@/components/sections/Header/PrimaryHeader'
import { type PropsWithChildren } from 'react'

function TemplatesLayout({ children }: PropsWithChildren) {
    return (
        <div className="grow flex flex-col">
            <PrimaryHeader />
            <main className="grow flex flex-col items-center justify-center md:px-4 md:py-8">
                {children}
            </main>

            <PrimaryFooter />
        </div>
    )
}

export default TemplatesLayout