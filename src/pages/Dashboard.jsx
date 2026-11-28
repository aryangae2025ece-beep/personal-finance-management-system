import { ArrowDownLeft, ArrowUpRight, PiggyBank, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import Chart from '../component/Chart';
import Transaction from '../component/Transaction';
import { formatCurrency, useFinance } from '../context/FinanceContext';
import './Pages.css';

const isCurrentMonth = (date) => {
    const value = new Date(`${date}T00:00:00`);
    const now = new Date();
    return value.getMonth() === now.getMonth() && value.getFullYear() === now.getFullYear();
};

function Dashboard() {
    const { transactions, budgets, preferences } = useFinance();
    const monthTransactions = transactions.filter((item) => isCurrentMonth(item.date));
    const income = monthTransactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const expenses = monthTransactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const balance = income - expenses;
    const savings = income ? Math.max(0, Math.round((balance / income) * 100)) : 0;
    const currency = preferences.currency;
    const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    const budgetTotal = Object.values(budgets).reduce((sum, amount) => sum + Number(amount || 0), 0);
    const monthName = new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date());

    return (
        <div className="page">
            <header className="page-heading">
                <div>
                    <p className="page-eyebrow">PERSONAL FINANCE</p>
                    <h1>Good to see you, {preferences.name.split(' ')[0]} 👋</h1>
                    <p>Here’s how your money is looking this month.</p>
                </div>
                <Link className="primary-button" to="/transactions?new=1">+ Add transaction</Link>
            </header>

            <section className="stats-grid" aria-label="Monthly summary">
                <StatCard label="Total income" value={formatCurrency(income, currency)} note={`Income in ${monthName}`} icon={ArrowDownLeft} tone="green" />
                <StatCard label="Total expenses" value={formatCurrency(expenses, currency)} note={`Spending in ${monthName}`} icon={ArrowUpRight} tone="orange" />
                <StatCard label="Available balance" value={formatCurrency(balance, currency)} note="Income minus expenses" icon={Wallet} tone="blue" />
                <StatCard label="Savings rate" value={`${savings}%`} note={`Budget plan: ${formatCurrency(budgetTotal, currency)}`} icon={PiggyBank} tone="purple" />
            </section>

            <section className="dashboard-grid">
                <Chart transactions={transactions} currency={currency} />
                <div className="panel">
                    <div className="panel-heading">
                        <div><h2>Recent activity</h2><p>Your latest money movements</p></div>
                        <Link className="text-link" to="/transactions">View all</Link>
                    </div>
                    <div className="activity-list">
                        {recent.length ? recent.map((item) => <Transaction key={item.id} {...item} currency={currency} />) : <div className="empty-list">No transactions yet. Add one to get started.</div>}
                    </div>
                </div>
            </section>
        </div>
    );
}

function StatCard({ label, value, note, icon: Icon, tone }) {
    return (
        <article className="stat-card">
            <div className="stat-topline"><span className="stat-label">{label}</span><span className={`stat-icon ${tone}`}><Icon size={17} /></span></div>
            <div className="stat-value">{value}</div>
            <p className="stat-note">{note}</p>
        </article>
    );
}

export default Dashboard;
