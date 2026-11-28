import { useState } from 'react';
import { Check, Pencil } from 'lucide-react';
import { formatCurrency, useFinance } from '../context/FinanceContext';
import './Pages.css';

const isCurrentMonth = (date) => {
    const value = new Date(`${date}T00:00:00`);
    const now = new Date();
    return value.getMonth() === now.getMonth() && value.getFullYear() === now.getFullYear();
};

function Budget() {
    const { budgets, transactions, preferences, updateBudget } = useFinance();
    const [editing, setEditing] = useState(false);
    const spentByCategory = transactions
        .filter((item) => item.type === 'expense' && isCurrentMonth(item.date))
        .reduce((total, item) => ({ ...total, [item.category]: (total[item.category] || 0) + item.amount }), {});
    const categories = [...new Set([...Object.keys(budgets), ...Object.keys(spentByCategory)])].sort();
    const currency = preferences.currency;

    const saveBudgets = (event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        categories.forEach((category) => updateBudget(category, Number(values.get(category)) || 0));
        setEditing(false);
    };

    return (
        <div className="page">
            <header className="page-heading">
                <div>
                    <p className="page-eyebrow">PLAN YOUR SPENDING</p>
                    <h1>Budgets</h1>
                    <p>Set a monthly limit and see how much you’ve used.</p>
                </div>
                <button className="secondary-button" onClick={() => setEditing((value) => !value)}>
                    <Pencil size={15} /> {editing ? 'Cancel editing' : 'Edit budgets'}
                </button>
            </header>

            {editing && (
                <form className="form-card" onSubmit={saveBudgets}>
                    <h2>Monthly budget limits</h2>
                    <div className="budget-grid">
                        {categories.map((category) => (
                            <div className="field" key={category}>
                                <label htmlFor={`budget-${category}`}>{category} ({currency})</label>
                                <input id={`budget-${category}`} name={category} type="number" min="0" step="100" defaultValue={budgets[category] || 0} />
                            </div>
                        ))}
                    </div>
                    <div className="form-actions" style={{ marginTop: 16 }}>
                        <button className="primary-button" type="submit"><Check size={16} /> Save budgets</button>
                    </div>
                </form>
            )}

            <div className="budget-grid">
                {categories.map((category) => {
                    const spent = spentByCategory[category] || 0;
                    const limit = Number(budgets[category] || 0);
                    const percent = limit ? (spent / limit) * 100 : spent ? 100 : 0;
                    const remaining = limit - spent;
                    return (
                        <article className="budget-card" key={category}>
                            <div className="budget-header">
                                <h3>{category}</h3>
                                <span>{formatCurrency(spent, currency)} / {formatCurrency(limit, currency)}</span>
                            </div>
                            <div className="budget-progress">
                                <span className={percent > 100 ? 'over-budget' : ''} style={{ width: `${Math.min(percent, 100)}%` }} />
                            </div>
                            <div className="budget-foot">
                                <span>{Math.round(percent)}% used</span>
                                <span>{remaining >= 0 ? `${formatCurrency(remaining, currency)} left` : `${formatCurrency(Math.abs(remaining), currency)} over`}</span>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

export default Budget;
