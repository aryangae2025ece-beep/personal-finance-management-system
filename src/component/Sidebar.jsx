import { NavLink } from 'react-router-dom';
import {
    Activity, BarChart3, BookOpen, BriefcaseBusiness, ChartNoAxesCombined,
    CircleHelp, LayoutDashboard, ReceiptText, Settings, Wallet, X,
} from 'lucide-react';
import './Sidebar.css';

const financeLinks = [
    { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/income', label: 'Income', icon: Wallet },
    { to: '/expenses', label: 'Expenses', icon: BriefcaseBusiness },
    { to: '/transactions', label: 'Transactions', icon: ReceiptText },
    { to: '/budget', label: 'Budgets', icon: ChartNoAxesCombined },
    { to: '/reports', label: 'Reports', icon: BarChart3 },
];

const demoLinks = [
    { to: '/effect', label: 'useEffect', icon: Activity },
    { to: '/fetch-api', label: 'Fetch API', icon: BookOpen },
    { to: '/reducer', label: 'useReducer', icon: CircleHelp },
];

function LinkList({ links, onNavigate }) {
    return (
        <ul className="sidebar-links">
            {links.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                    <NavLink to={to} end={end} onClick={onNavigate}>
                        <Icon size={18} strokeWidth={1.8} />
                        <span>{label}</span>
                    </NavLink>
                </li>
            ))}
        </ul>
    );
}

function Sidebar({ isOpen, onNavigate }) {
    return (
        <aside className={`sidebar${isOpen ? ' sidebar-open' : ''}`}>
            <div className="sidebar-brand">
                <div className="brand-mark"><Wallet size={19} /></div>
                <span>Fin<span className="brand-light">Track</span></span>
                <button className="sidebar-close icon-button" onClick={onNavigate} aria-label="Close navigation">
                    <X size={20} />
                </button>
            </div>
            <div className="sidebar-scroll">
                <p className="sidebar-label">YOUR FINANCES</p>
                <LinkList links={financeLinks} onNavigate={onNavigate} />
                <p className="sidebar-label demo-label">LEARNING</p>
                <LinkList links={demoLinks} onNavigate={onNavigate} />
            </div>
            <div className="sidebar-footer">
                <div className="sidebar-help"><CircleHelp size={17} /><span>Personal finance, simplified.</span></div>
                <NavLink to="/settings" onClick={onNavigate} className={({ isActive }) => `sidebar-settings${isActive ? ' active' : ''}`}>
                    <Settings size={17} /> Settings
                </NavLink>
            </div>
        </aside>
    );
}

export default Sidebar;
