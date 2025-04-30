import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [filter, setFilter] = useState('All');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('DateDesc');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const userId = localStorage.getItem('userId');


    const handleEditTransaction = (transactionData) => {
        navigate('/', { state: { transaction: transactionData } });
    };
    const handleDeleteTransaction = async (transactionId) => {
        try {
            console.log(transactionId);
            const response = await fetch('https://money-flow-web-app-1.onrender.com/api/transaction/delete', {
                // const response = await fetch('https://localhost:5000/api/transaction/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transactionId }),
            });

            const result = await response.json();
            if (response.ok) {
                window.location.reload();
            } else {
                console.log("Response not OK:", result.error);
            }
        } catch (error) {
            console.log('An error occurred:', error.message);
        }
    };


    const fetchTransactions = useCallback(async () => {
        if (!userId) return;

        try {
            const response = await fetch(`https://money-flow-web-app-1.onrender.com/api/transaction/${userId}`);
            // const response = await fetch(`http://localhost:5000/api/transaction/${userId}`);
            const data = await response.json();
            console.log('Fetched transactions:', data);

            let filteredData = data;

            if (filter !== 'All') {
                filteredData = filteredData.filter(transaction => transaction.transactionType === filter);
            }

            if (paymentMethodFilter !== 'All') {
                filteredData = filteredData.filter(transaction => transaction.paymentMethod === paymentMethodFilter);
            }

            if (startDate && endDate) {
                filteredData = filteredData.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
                });
            }

            if (sortOrder === 'DateAsc') {
                filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
            } else if (sortOrder === 'DateDesc') {
                filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
            }

            setTransactions(filteredData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    }, [userId, filter, paymentMethodFilter, sortOrder, startDate, endDate]);

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        } else {
            fetchTransactions();
        }
    }, [userId, navigate, fetchTransactions]);

    const handleTransactionClick = (transaction) => {
        setSelectedTransaction(transaction);
    };

    const closePopup = () => {
        setSelectedTransaction(null);
    };

    return (
        <div className={styles['dashboard-container']}>
            <h3>{transactions.length} Transactions</h3>

            <div className={styles['controls']}>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={styles['filter-select']}
                >
                    <option value="All">All</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                </select>

                <select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    className={styles['filter-select']}
                >
                    <option value="All">All Payment Methods</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Net Banking">Net Banking</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={styles['sort-select']}
                >
                    <option value="DateAsc">Date Ascending</option>
                    <option value="DateDesc">Date Descending</option>
                </select>

                <div className={styles['date-filters']}>
                    <label htmlFor="startDate">From:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={styles['date-input']}
                    />
                </div>
                <div className={styles['date-filters']}>
                    <label htmlForid="endDate">Till:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={styles['date-input']}
                    />
                </div>
            </div>

            <div className={styles['transaction-list']}>
                {transactions.map((transaction) => (
                    <div className={styles['transaction-item-main']} key={transaction.id}>
                        <div
                            className={styles['transaction-item']}
                            onClick={() => handleTransactionClick(transaction)}
                        >
                            <div style={{ width: '25%' }}><strong>{transaction.name}</strong></div>

                            <div style={{ width: '25%' }}>
                                <span
                                    className={
                                        transaction.transactionType === 'Income'
                                            ? styles['income-amount']
                                            : styles['expense-amount']
                                    }
                                >
                                    {transaction.transactionType === 'Income' ? '↑' : '↓'} ₹{transaction.amount}
                                </span>
                            </div>
                            <div style={{ width: '25%' }}><span>{transaction.date}</span></div>
                            <div style={{ width: '25%' }}><span>{transaction.paymentMethod}</span></div>
                        </div>
                        <div className={styles['control-options']}>
                            <span onClick={(e) => handleEditTransaction(transaction)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="17px"
                                    className={styles['edit-icon']}
                                >
                                    <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                                </svg>
                            </span>
                            <span onClick={() => handleDeleteTransaction(transaction.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15px"
                                    className={styles['delete-icon']}
                                >
                                    <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {selectedTransaction && (
                <div className={styles['transaction-popup']}>
                    <div className={styles['popupContent']}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                            width="24px"
                            onClick={closePopup}
                            className={styles['closeButton']}
                        >
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                        </svg>
                        <h4>{selectedTransaction.name}</h4>
                        <p>
                            <strong>Amount: </strong>
                            <span
                                className={
                                    selectedTransaction.transactionType === 'Income'
                                        ? styles['income-amount']
                                        : styles['expense-amount']
                                }
                            >
                                ₹{selectedTransaction.amount}
                            </span>
                        </p>
                        <p><strong>Type:</strong> {selectedTransaction.transactionType}</p>
                        <p><strong>Category:</strong> {selectedTransaction.category || 'N/A'}</p>
                        <p><strong>Date:</strong> {selectedTransaction.date ? new Date(selectedTransaction.date).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Description:</strong> {selectedTransaction.description || 'N/A'}</p>
                        <p><strong>Method:</strong> {selectedTransaction.paymentMethod || 'N/A'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
