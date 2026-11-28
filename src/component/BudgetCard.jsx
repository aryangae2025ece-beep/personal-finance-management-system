import React from 'react';
import './BudgetCard.css';

function BudgetCard({ category, spent, budget }) {

    const percentage = Math.min((spent / budget) * 100, 100);

    return (
        <div className="budget-card">

            <div className="budget-header">
                <h3>{category}</h3>
                <span>₹{spent} / ₹{budget}</span>
            </div>

            <div className="progress-bar">
                <div
                    className="progress"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <p>{percentage.toFixed(0)}% Used</p>

        </div>
    );
}

export default BudgetCard;