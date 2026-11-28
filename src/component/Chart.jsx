import React from 'react';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

import './Chart.css';

function Chart({ transactions = [], currency = 'INR' }) {
    const now = new Date();
    const data = Array.from({ length: 6 }, (_, index) => {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
        const key = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
        const monthTransactions = transactions.filter((item) => item.date.startsWith(key));
        return {
            month: new Intl.DateTimeFormat('en', { month: 'short' }).format(monthDate),
            income: monthTransactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0),
            expenses: monthTransactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0),
        };
    });
    const money = (value) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(value);

    return (
        <div className="chart-container">
            <h3>Cash flow</h3>
            <p className="chart-subtitle">Income and spending over the last six months</p>

            <ResponsiveContainer width="100%" height={300}>

                <BarChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />

                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8a94a4', fontSize: 11 }} />

                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8a94a4', fontSize: 10 }} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />

                    <Tooltip formatter={(value) => money(value)} />

                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />

                    <Bar
                        dataKey="income"
                        fill="#5773e2"
                        name="Income"
                        radius={[4, 4, 0, 0]}
                    />

                    <Bar
                        dataKey="expenses"
                        fill="#f0a36d"
                        name="Expenses"
                        radius={[4, 4, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>
    );
}

export default Chart;