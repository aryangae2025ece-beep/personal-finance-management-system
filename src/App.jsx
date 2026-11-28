import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';

import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import Effect from './Hooks/Effect';
import FetchApi from './Hooks/FetchApi';
import Reducer from './Hooks/Reducer';
import { FinanceProvider, useFinance } from './context/FinanceContext';

import './App.css';

function AppLayout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { storageError } = useFinance();
    return (
        <div className="app-shell">
            <Sidebar isOpen={menuOpen} onNavigate={() => setMenuOpen(false)} />
            {menuOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
            <div className="workspace">
                <Navbar onMenuClick={() => setMenuOpen((open) => !open)} />
                {storageError && <div className="storage-alert" role="alert">{storageError}</div>}
                <main className="content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/income" element={<Income />} />
                        <Route path="/expenses" element={<Expenses />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/budget" element={<Budget />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/effect" element={<Effect />} />
                        <Route path="/fetch-api" element={<FetchApi />} />
                        <Route path="/reducer" element={<Reducer />} />
                        <Route path="*" element={<div className="empty-state"><h2>Page not found</h2><p>Choose a page from the navigation to continue.</p></div>} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <FinanceProvider>
                <AppLayout />
            </FinanceProvider>
        </BrowserRouter>
    );
}

export default App;