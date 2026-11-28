import React, { useState, useEffect } from 'react';

function Effect() {

    const [expense, setExpense] = useState(1000);

    useEffect(() => {

        console.log("Expense updated:", expense);

    }, [expense]);

    return (
        <div>
            <h2>Expense: ₹{expense}</h2>

            <button onClick={() => setExpense(expense + 500)}>
                Add Expense
            </button>
        </div>
    );
}

export default Effect;