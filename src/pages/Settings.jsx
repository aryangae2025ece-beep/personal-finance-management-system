import { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import './Pages.css';

function Settings() {
    const { preferences, updatePreferences, resetData } = useFinance();
    const [name, setName] = useState(preferences.name);
    const [currency, setCurrency] = useState(preferences.currency);
    const [saved, setSaved] = useState(false);

    const saveSettings = (event) => {
        event.preventDefault();
        updatePreferences({ name: name.trim(), currency });
        setSaved(true);
    };

    const reset = () => {
        if (window.confirm('Reset your transactions, budgets, and profile to the sample data? This cannot be undone.')) {
            resetData();
            setName('Arya Morgan');
            setCurrency('INR');
            setSaved(false);
        }
    };

    return (
        <div className="page">
            <header className="page-heading">
                <div>
                    <p className="page-eyebrow">MAKE IT YOURS</p>
                    <h1>Settings</h1>
                    <p>Manage your profile and how amounts are displayed.</p>
                </div>
            </header>

            <div className="settings-layout">
                <section className="panel settings-card">
                    <h2>Profile preferences</h2>
                    <p>Your profile and currency are saved on this device.</p>
                    <form className="settings-form" onSubmit={saveSettings}>
                        <div className="field">
                            <label htmlFor="profile-name">Display name</label>
                            <input id="profile-name" value={name} onChange={(event) => { setName(event.target.value); setSaved(false); }} maxLength={50} required />
                        </div>
                        <div className="field">
                            <label htmlFor="currency">Display currency</label>
                            <select id="currency" value={currency} onChange={(event) => { setCurrency(event.target.value); setSaved(false); }}>
                                <option value="INR">Indian Rupee (INR)</option>
                                <option value="USD">US Dollar (USD)</option>
                                <option value="EUR">Euro (EUR)</option>
                                <option value="GBP">British Pound (GBP)</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button className="primary-button" type="submit"><Save size={16} /> Save changes</button>
                        </div>
                    </form>
                    {saved && <p className="settings-saved" role="status">Your preferences have been saved.</p>}
                </section>
                <section className="panel settings-card">
                    <h2>Sample data</h2>
                    <p>Restore the example transactions and budgets. Your current browser data will be replaced.</p>
                    <button className="danger-button" onClick={reset}><RotateCcw size={15} /> Reset sample data</button>
                </section>
            </div>
        </div>
    );
}

export default Settings;
