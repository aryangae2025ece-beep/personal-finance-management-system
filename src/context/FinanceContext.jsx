import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'fintrack-finance-data';
const FinanceContext = createContext(null);

const dateFromToday = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
};

const createInitialData = () => ({
    transactions: [
        { id: 'seed-1', description: 'Monthly salary', category: 'Salary', amount: 72000, type: 'income', date: dateFromToday(-1) },
        { id: 'seed-2', description: 'Apartment rent', category: 'Housing', amount: 18000, type: 'expense', date: dateFromToday(-2) },
        { id: 'seed-3', description: 'Grocery shopping', category: 'Food', amount: 2450, type: 'expense', date: dateFromToday(-3) },
        { id: 'seed-4', description: 'Freelance project', category: 'Freelance', amount: 12500, type: 'income', date: dateFromToday(-5) },
        { id: 'seed-5', description: 'Metro pass', category: 'Transport', amount: 1200, type: 'expense', date: dateFromToday(-7) },
        { id: 'seed-6', description: 'Streaming subscription', category: 'Entertainment', amount: 499, type: 'expense', date: dateFromToday(-9) },
        { id: 'seed-7', description: 'Monthly salary', category: 'Salary', amount: 72000, type: 'income', date: dateFromToday(-34) },
        { id: 'seed-8', description: 'Grocery shopping', category: 'Food', amount: 3200, type: 'expense', date: dateFromToday(-38) },
    ],
    budgets: {
        Housing: 22000,
        Food: 10000,
        Transport: 5000,
        Entertainment: 4000,
        Health: 5000,
        Shopping: 6000,
    },
    preferences: { name: 'Arya Morgan', currency: 'INR' },
});

function readStoredData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return { data: createInitialData(), error: '' };

        const data = JSON.parse(stored);
        if (
            !data ||
            !Array.isArray(data.transactions) ||
            !data.budgets ||
            typeof data.budgets !== 'object' ||
            !data.preferences ||
            typeof data.preferences !== 'object'
        ) {
            throw new Error('Saved finance data has an unexpected format.');
        }

        if (data.preferences.name === 'Alex Morgan') {
            data.preferences.name = 'Arya Morgan';
        }

        return { data, error: '' };
    } catch (error) {
        return {
            data: createInitialData(),
            error: `Saved data could not be loaded: ${error.message}`,
        };
    }
}

export function FinanceProvider({ children }) {
    const [initialState] = useState(readStoredData);
    const [finance, setFinance] = useState(initialState.data);
    const [storageError, setStorageError] = useState(initialState.error);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(finance));
            setStorageError('');
        } catch (error) {
            setStorageError(`Your changes could not be saved in this browser: ${error.message}`);
        }
    }, [finance]);

    const addTransaction = (transaction) => {
        setFinance((current) => ({
            ...current,
            transactions: [
                { ...transaction, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
                ...current.transactions,
            ],
        }));
    };

    const deleteTransaction = (id) => {
        setFinance((current) => ({
            ...current,
            transactions: current.transactions.filter((transaction) => transaction.id !== id),
        }));
    };

    const updateBudget = (category, amount) => {
        setFinance((current) => ({
            ...current,
            budgets: { ...current.budgets, [category]: amount },
        }));
    };

    const updatePreferences = (preferences) => {
        setFinance((current) => ({
            ...current,
            preferences: { ...current.preferences, ...preferences },
        }));
    };

    const resetData = () => setFinance(createInitialData());

    const value = useMemo(() => ({
        ...finance,
        storageError,
        addTransaction,
        deleteTransaction,
        updateBudget,
        updatePreferences,
        resetData,
    }), [finance, storageError]);

    return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
    const context = useContext(FinanceContext);
    if (!context) throw new Error('useFinance must be used within a FinanceProvider.');
    return context;
}

export function formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(amount || 0);
}
