import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LangProvider } from './i18n/LangContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import GlobalMap from './pages/GlobalMap';
import Maintenance from './pages/Maintenance';
import Analytics from './pages/Analytics';
import CountryWeapons from './pages/CountryWeapons';
import Community from './pages/Community';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <div className="scanline" />
      <div className="grid-line hidden xl:block" style={{ left: '25%' }} />
      <div className="grid-line hidden xl:block" style={{ left: '75%' }} />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-base)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/inventory" element={<AppLayout><Inventory /></AppLayout>} />
        <Route path="/map" element={<AppLayout><GlobalMap /></AppLayout>} />
        <Route path="/maintenance" element={<AppLayout><Maintenance /></AppLayout>} />
        <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
        <Route path="/countries" element={<AppLayout><CountryWeapons /></AppLayout>} />
        <Route path="/community" element={<AppLayout><Community /></AppLayout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    </LangProvider>
  );
}
