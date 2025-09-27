import './i18n';
import { Route, Routes } from 'react-router'
import './App.css'
import ThemeProvider from './providers/ThemeProvider'
import { BrowserRouter } from 'react-router'
import ProjectDocumentation1 from '@/pages/forms/project-documentation/1/page'
import HomePage from '@/pages/page'

function App() {
    return (
        <div className='flex flex-col min-h-screen bg-bg-base text-text-base' dir='rtl'>
            <ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/forms/project-documentation/1' element={<ProjectDocumentation1 />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </div>
    )
}

export default App
