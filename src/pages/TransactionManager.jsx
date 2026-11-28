import { useEffect, useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Plus, Search, Trash2, X } from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { formatCurrency, useFinance } from '../context/FinanceContext';
import './Pages.css';

const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
    expense: ['Housing', 'Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Other'],
};

const today = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

function TransactionManager({ mode = 'all' }) {
    const { transactions, preferences, addTransaction, deleteTransaction } = useFinance();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const [filter, setFilter] = useState(mode === 'income' ? 'income' : mode === 'expenses' ? 'expense' : 'all');
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [formOpen, setFormOpen] = useState(searchParams.get('new') === '1');
    const lockedType = mode === 'income' ? 'income' : mode === 'expenses' ? 'expense' : '';
    const [transactionType, setTransactionType] = useState(lockedType || 'expense');
    const pageTitle = mode === 'income' ? 'Income' : mode === 'expenses' ? 'Expenses' : 'Transactions';
    const pageDescription = mode === 'income'
        ? 'Track the money coming into your account.'
        : mode === 'expenses'
            ? 'Keep an eye on where your money is going.'
            : 'A complete record of your income and spending.';
    const currency = preferences.currency;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearch(params.get('q') || '');
        if (params.get('new') === '1') setFormOpen(true);
    }, [location.search]);

    const visibleTransactions = useMemo(() => transactions
        .filter((item) => {
            const type = lockedType || filter;
            const matchesType = type === 'all' || item.type === type;
            const term = search.trim().toLowerCase();
            const matchesSearch = !term || `${item.description} ${item.category} ${item.type}`.toLowerCase().includes(term);
            return matchesType && matchesSearch;
        })
        .sort((a, b) => b.date.localeCompare(a.date)), [transactions, lockedType, filter, search]);

    const total = visibleTransactions.reduce((sum, item) => sum + (item.type === 'income' ? item.amount : -item.amount), 0);

    const showForm = () => {
        setFormOpen(true);
        const params = new URLSearchParams(searchParams);
        params.set('new', '1');
        setSearchParams(params, { replace: true });
    };

    const closeForm = () => {
        setFormOpen(false);
        const params = new URLSearchParams(searchParams);
        params.delete('new');
        setSearchParams(params, { replace: true });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        addTransaction({
            description: values.get('description').toString().trim(),
            category: values.get('category').toString(),
            amount: Number(values.get('amount')),
            type: lockedType || values.get('type').toString(),
            date: values.get('date').toString(),
        });
        event.currentTarget.reset();
        setTransactionType(lockedType || 'expense');
        closeForm();
    };

    return (
        <div className="page">
            <header className="page-heading">
                <div>
                    <p className="page-eyebrow">MONEY ACTIVITY</p>
                    <h1>{pageTitle}</h1>
                    <p>{pageDescription}</p>
                </div>
                <button className="primary-button" onClick={showForm}><Plus size={17} /> Add transaction</button>
            </header>

            {formOpen && (
                <section className="form-card">
                    <div className="panel-heading" style={{ padding: '0 0 15px', minHeight: 'auto', marginBottom: 16 }}>
                        <div><h2>New transaction</h2><p>Enter the details below to update your finances.</p></div>
                        <button className="row-action" aria-label="Close form" onClick={closeForm}><X size={18} /></button>
                    </div>
                    <form className="transaction-form" onSubmit={handleSubmit}>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <input id="description" name="description" placeholder="e.g. Grocery shopping" required maxLength={70} />
                        </div>
                        <div className="field">
                            <label htmlFor="amount">Amount ({currency})</label>
                            <input id="amount" name="amount" type="number" min="1" step="0.01" placeholder="0.00" required />
                        </div>
                        {!lockedType && (
                            <div className="field">
                                <label htmlFor="type">Type</label>
                                <select id="type" name="type" value={transactionType} onChange={(event) => setTransactionType(event.target.value)}>
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>
                        )}
                        <div className="field">
                            <label htmlFor="category">Category</label>
                            <select id="category" name="category" key={transactionType} defaultValue={categories[transactionType][0]}>
                                {categories[transactionType].map((category) => <option key={category}>{category}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="date">Date</label>
                            <input id="date" name="date" type="date" defaultValue={today()} required />
                        </div>
                        <div className="field form-actions field-wide">
                            <button type="button" className="secondary-button" onClick={closeForm}>Cancel</button>
                            <button type="submit" className="primary-button">Save transaction</button>
                        </div>
                    </form>
                </section>
            )}

            <div className="transactions-toolbar">
                {!lockedType && (
                    <div className="filter-group" aria-label="Filter transaction type">
                        {[['all', 'All activity'], ['income', 'Income'], ['expense', 'Expenses']].map(([value, label]) => (
                            <button key={value} className={`filter-button${filter === value ? ' active' : ''}`} onClick={() => setFilter(value)}>{label}</button>
                        ))}
                    </div>
                )}
                <label className="topbar-search inline-search">
                    <Search size={16} aria-hidden="true" />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filter this list..." aria-label="Filter transactions" />
                </label>
            </div>

            <div className="transaction-table">
                <div className="transaction-table-head"><span>Transaction</span><span>Category</span><span>Date</span><span style={{ textAlign: 'right' }}>Amount</span><span /></div>
                {visibleTransactions.length ? visibleTransactions.map((transaction) => (
                    <TransactionRow key={transaction.id} transaction={transaction} currency={currency} onDelete={deleteTransaction} />
                )) : <div className="empty-list">No {search ? 'matching ' : ''}transactions yet.</div>}
            </div>
            <p className="stat-note" style={{ textAlign: 'right', marginTop: 12 }}>
                {visibleTransactions.length} {visibleTransactions.length === 1 ? 'transaction' : 'transactions'} · Net {formatCurrency(total, currency)}
            </p>
        </div>
    );
}

function TransactionRow({ transaction, currency, onDelete }) {
    const { description, category, date, amount, type, id } = transaction;
    const Icon = type === 'income' ? ArrowDownLeft : ArrowUpRight;
    const dateLabel = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`));

    return (
        <div className="transaction-row">
            <div className="row-description">
                <span className="category-icon"><Icon size={16} /></span>
                <div><strong>{description}</strong><span>{type === 'income' ? 'Income' : 'Expense'}</span></div>
            </div>
            <span className="row-meta">{category}</span>
            <span className="row-meta">{dateLabel}</span>
            <span className={`row-amount ${type}`}>{type === 'income' ? '+' : '−'}{formatCurrency(amount, currency)}</span>
            <button className="row-action" aria-label={`Delete ${description}`} title="Delete transaction" onClick={() => onDelete(id)}><Trash2 size={16} /></button>
        </div>
    );
}

export default TransactionManager;
