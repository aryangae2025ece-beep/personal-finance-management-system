import { useMemo, useState } from 'react';
import Chart from '../component/Chart';
import { formatCurrency, useFinance } from '../context/FinanceContext';
import './Pages.css';

const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

function Reports() {
    const { transactions, preferences } = useFinance();
    const [selectedMonth, setSelectedMonth] = useState(monthKey(new Date()));
    const months = useMemo(() => Array.from({ length: 12 }, (_, index) => {
        const date = new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() - index);
        return { value: monthKey(date), label: new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date) };
    }), []);
    const selectedTransactions = transactions.filter((item) => item.date.startsWith(selectedMonth));
    const income = selectedTransactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const expenses = selectedTransactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const categoryTotals = selectedTransactions
        .filter((item) => item.type === 'expense')
        .reduce((total, item) => ({ ...total, [item.category]: (total[item.category] || 0) + item.amount }), {});
    const categories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const maxCategory = Math.max(...categories.map(([, amount]) => amount), 1);
    const currency = preferences.currency;

    return (
        <div className="page">
            <header className="page-heading">
                <div>
                    <p className="page-eyebrow">YOUR MONEY, AT A GLANCE</p>
                    <h1>Reports</h1>
                    <p>Understand your cash flow and spending patterns.</p>
                </div>
                <select className="month-select" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} aria-label="Select report month">
                    {months.map((month) => <option value={month.value} key={month.value}>{month.label}</option>)}
                </select>
            </header>

            <section className="report-summary">
                <Summary label="Income" value={formatCurrency(income, currency)} />
                <Summary label="Expenses" value={formatCurrency(expenses, currency)} />
                <Summary label="Net cash flow" value={formatCurrency(income - expenses, currency)} />
            </section>

            <section className="report-layout">
                <Chart transactions={transactions} currency={currency} />
                <div className="panel">
                    <div className="panel-heading"><div><h2>Spending by category</h2><p>Selected month</p></div></div>
                    {categories.length ? (
                        <div className="category-list">
                            {categories.map(([category, amount]) => (
                                <div className="category-item" key={category}>
                                    <strong>{category}</strong><span>{formatCurrency(amount, currency)}</span>
                                    <div className="category-track"><i style={{ width: `${(amount / maxCategory) * 100}%` }} /></div>
                                </div>
                            ))}
                        </div>
                    ) : <div className="empty-list">No expenses recorded for this month.</div>}
                </div>
            </section>
        </div>
    );
}

function Summary({ label, value }) {
    return <article className="stat-card"><div className="stat-label">{label}</div><div className="stat-value" style={{ marginTop: 11 }}>{value}</div></article>;
}

export default Reports;
