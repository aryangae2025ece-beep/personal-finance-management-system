import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import './Transaction.css';

function Transaction({ description, name, category, date, amount, type, currency = 'INR' }) {
    const Icon = type === 'income' ? ArrowDownLeft : ArrowUpRight;
    const formattedDate = new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
    }).format(new Date(`${date}T00:00:00`));
    const formattedAmount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(amount || 0);

    return (
        <div className="transaction">
            <span className={`transaction-type-icon ${type}`}><Icon size={16} /></span>
            <div className="transaction-info">
                <h4>{description || name}</h4>
                <p>{category} · {formattedDate}</p>
            </div>
            <div className={`transaction-amount ${type}`}>{type === 'income' ? '+' : '−'}{formattedAmount}</div>
        </div>
    );
}

export default Transaction;