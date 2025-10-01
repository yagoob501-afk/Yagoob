import PrimaryFooter from '@/components/sections/Footer/PrimaryFooter'
import PrimaryHeader from '@/components/sections/Header/PrimaryHeader'
import { type PropsWithChildren } from 'react'

function TemplatesLayout({ children }: PropsWithChildren) {
    return (
        <div className="grow flex flex-col">
            <PrimaryHeader />
            <main className="grow flex flex-col items-center justify-center px-4 py-8">
                {children}
            </main>

            <PrimaryFooter />
        </div>
    )
}

export default TemplatesLayout