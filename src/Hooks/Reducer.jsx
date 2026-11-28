import React, { useReducer } from 'react';

function reducer(state, action) {

    switch (action.type) {

        case 'ADD':
            return state + action.amount;

        case 'SUBTRACT':
            return state - action.amount;

        default:
            return state;
    }
}

function Reducer() {

    const [balance, dispatch] = useReducer(reducer, 10000);

    return (
        <div>

            <h2>Balance: ₹{balance}</h2>

            <button onClick={() => dispatch({
                type: 'ADD',
                amount: 5000
            })}>
                Add Income
            </button>

            <button onClick={() => dispatch({
                type: 'SUBTRACT',
                amount: 2000
            })}>
                Add Expense
            </button>

        </div>
    );
}

export default Reducer;