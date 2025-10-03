import './i18n';
import { Route, Routes } from 'react-router'
import './App.css'
import ThemeProvider from './providers/ThemeProvider'
import { BrowserRouter } from 'react-router'
import ProjectDocumentation1 from '@/pages/forms/project-documentation/1/page'
import HomePage from '@/pages/page'
import TextToQRcodePage from './pages/additional-tools/TextToQRcode';
import CertificateOfAppreciationTemplate_2_Page from './pages/forms/certificate-of-appreciation/2/page';
import CertificateOfAppreciationTemplate_1_Page from './pages/forms/certificate-of-appreciation/1/page';
import CertificateOfAppreciationTemplate_3_Page from './pages/forms/certificate-of-appreciation/3/page';
import CertificateOfAppreciationTemplate_4_Page from './pages/forms/certificate-of-appreciation/4/page';
import CertificateOfAppreciationTemplate_5_Page from './pages/forms/certificate-of-appreciation/5/page';
import CertificateOfAppreciationTemplate_6_Page from './pages/forms/certificate-of-appreciation/6/page';

function App() {
    return (
        <div className='flex flex-col min-h-screen bg-bg-base text-text-base' dir='rtl'>
            <ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        {/* root paths */}
                        <Route path='/' element={<HomePage />} />

                        {/* forms */}
                        <Route path='/forms/project-documentation/1' element={<ProjectDocumentation1 />} />
                        <Route path='/forms/certificate-of-appreciation/1' element={<CertificateOfAppreciationTemplate_1_Page />} />
                        <Route path='/forms/certificate-of-appreciation/2' element={<CertificateOfAppreciationTemplate_2_Page />} />
                        <Route path='/forms/certificate-of-appreciation/3' element={<CertificateOfAppreciationTemplate_3_Page />} />
                        <Route path='/forms/certificate-of-appreciation/4' element={<CertificateOfAppreciationTemplate_4_Page />} />
                        <Route path='/forms/certificate-of-appreciation/5' element={<CertificateOfAppreciationTemplate_5_Page />} />
                        <Route path='/forms/certificate-of-appreciation/6' element={<CertificateOfAppreciationTemplate_6_Page />} />

                        {/* additional tools */}
                        <Route path='/additional-tools/text-to-qrcode' element={<TextToQRcodePage />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </div>
    )
}

export default App
