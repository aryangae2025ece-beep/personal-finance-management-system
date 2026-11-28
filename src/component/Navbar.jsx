import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Plus, Search } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import './Navbar.css';

function Navbar({ onMenuClick }) {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { preferences } = useFinance();

    const handleSearch = (event) => {
        event.preventDefault();
        navigate(`/transactions?q=${encodeURIComponent(query.trim())}`);
    };

    return (
        <header className="topbar">
            <button className="mobile-menu-button icon-button" onClick={onMenuClick} aria-label="Toggle navigation">
                <Menu size={20} />
            </button>
            <form className="topbar-search" onSubmit={handleSearch} role="search">
                <Search size={18} aria-hidden="true" />
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search transactions..."
                    aria-label="Search transactions"
                />
                <button type="submit" className="search-submit">Search</button>
            </form>
            <div className="topbar-actions">
                <button className="icon-button notification-button" aria-label="Notifications">
                    <Bell size={19} />
                    <span className="notification-dot" />
                </button>
                <button className="topbar-add" onClick={() => navigate('/transactions?new=1')}>
                    <Plus size={17} /> <span>Add transaction</span>
                </button>
                <div className="user-badge">
                    <span className="avatar">{(preferences.name || 'A').charAt(0).toUpperCase()}</span>
                    <span className="user-name">{preferences.name || 'Your account'}</span>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
