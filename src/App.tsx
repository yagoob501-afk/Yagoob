import './i18n';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css'
import ThemeProvider from './providers/ThemeProvider'
import ProjectDocumentation1 from './pages/forms/project-documentation/1/page';
import ProjectDocumentation2 from '@/pages/forms/project-documentation/2/page'
// import HomePage from '@/pages/page'
import TextToQRcodePage from './pages/additional-tools/TextToQRcode';
import CertificateOfAppreciationTemplate_2_Page from './pages/forms/certificate-of-appreciation/2/page';
import CertificateOfAppreciationTemplate_1_Page from './pages/forms/certificate-of-appreciation/1/page';
// import CertificateOfAppreciationTemplate_3_Page from './pages/forms/certificate-of-appreciation/3/page';
// import CertificateOfAppreciationTemplate_4_Page from './pages/forms/certificate-of-appreciation/4/page';
import CertificateOfAppreciationTemplate_5_Page from './pages/forms/certificate-of-appreciation/5/page';
import CertificateOfAppreciationTemplate_6_Page from './pages/forms/certificate-of-appreciation/6/page';
import CertificateOfAppreciationTemplate_7_Page from './pages/forms/certificate-of-appreciation/7/page';
import CertificateOfAppreciationTemplate_8_Page from './pages/forms/certificate-of-appreciation/8/page';
import CertificateOfAppreciationTemplate_9_Page from './pages/forms/certificate-of-appreciation/9/page';
import AboutPage from './pages/about/page';
import DocumentationFormsPage from './pages/forms/project-documentation/page';
import CertificatesFormsPage from './pages/forms/certificate-of-appreciation/page';
import ToolsPage from './pages/tools/page';
import AddToHomePrompt from './components/ui/AddToHomePrompt';

function App() {
    return (
        <div className='flex flex-col min-h-screen bg-bg-base text-text-base' dir='rtl'>
            <AddToHomePrompt />
            <ThemeProvider>
                <BrowserRouter basename={import.meta.env.VITE_PUBLIC_APP_BASE}>
                    <Routes>
                        {/* root paths */}
                        {/* <Route path='/' element={<HomePage />} /> */}
                        <Route path='/' element={<ToolsPage />} />
                        <Route path='/tools' element={<ToolsPage />} />
                        <Route path='/about' element={<AboutPage />} />


                        {/* forms roots */}
                        <Route path='/forms/project-documentation' element={<DocumentationFormsPage />} />
                        <Route path='/forms/certificate-of-appreciation' element={<CertificatesFormsPage />} />

                        {/* forms */}
                        <Route path='/forms/project-documentation/1' element={<ProjectDocumentation1 />} />
                        <Route path='/forms/project-documentation/2' element={<ProjectDocumentation2 />} />
                        <Route path='/forms/certificate-of-appreciation/1' element={<CertificateOfAppreciationTemplate_1_Page />} />
                        <Route path='/forms/certificate-of-appreciation/2' element={<CertificateOfAppreciationTemplate_2_Page />} />
                        {/* <Route path='/forms/certificate-of-appreciation/3' element={<CertificateOfAppreciationTemplate_3_Page />} /> */}
                        {/* <Route path='/forms/certificate-of-appreciation/4' element={<CertificateOfAppreciationTemplate_4_Page />} /> */}
                        <Route path='/forms/certificate-of-appreciation/5' element={<CertificateOfAppreciationTemplate_5_Page />} />
                        <Route path='/forms/certificate-of-appreciation/6' element={<CertificateOfAppreciationTemplate_6_Page />} />
                        <Route path='/forms/certificate-of-appreciation/7' element={<CertificateOfAppreciationTemplate_7_Page />} />
                        <Route path='/forms/certificate-of-appreciation/8' element={<CertificateOfAppreciationTemplate_8_Page />} />
                        <Route path='/forms/certificate-of-appreciation/9' element={<CertificateOfAppreciationTemplate_9_Page />} />

                        {/* additional tools */}
                        <Route path='/additional-tools/text-to-qrcode' element={<TextToQRcodePage />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </div>
    )
}


export default App
