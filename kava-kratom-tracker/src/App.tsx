import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { StatePage } from '@/pages/StatePage'
import { BillPage } from '@/pages/BillPage'
import { ModeratePage } from '@/pages/ModeratePage'
import { Footer } from '@/components/Footer'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/state/:abbr" element={<StatePage />} />
            <Route path="/bill/:id" element={<BillPage />} />
            <Route path="/admin/moderate" element={<ModeratePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
