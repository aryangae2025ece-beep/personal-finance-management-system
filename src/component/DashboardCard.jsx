import React from 'react';
import './DashboardCard.css';

function DashboardCard({ title, amount, icon, color }) {
    return (
        <div className="dashboard-card">

            <div className="card-info">
                <p>{title}</p>
                <h2>{amount}</h2>
            </div>

            <div
                className="card-icon"
                style={{ backgroundColor: color }}
            >
                {icon}
            </div>

        </div>
    );
}

export default DashboardCard;