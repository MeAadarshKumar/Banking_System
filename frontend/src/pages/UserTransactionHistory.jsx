import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserTransactionHistory = ({ userAccount }) => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/transactions/history/${userAccount}`);
                setTransactions(res.data);
            } catch (err) {
                console.error("Failed to fetch history");
            }
        };
        fetchHistory();
    }, [userAccount]);

    return (
        <div className="form-card-container">
            <div className="form-header">
                <h2>Transaction History</h2>
                <p>Track your transfers and deposits</p>
            </div>
            <div className="table-responsive">
                <table className="professional-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Type</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => {
                            const isSender = tx.senderAccountNumber === userAccount;
                            return (
                                <tr key={tx.id}>
                                    <td>{new Date(tx.timestamp).toLocaleDateString()}</td>
                                    <td>
                                        {tx.type === 'DEPOSIT' ? 'Self Deposit' : 
                                         isSender ? `To: ${tx.receiverAccountNumber}` : `From: ${tx.senderAccountNumber}`}
                                    </td>
                                    <td>
                                        <span className={`badge ${isSender ? 'remove-btn-small' : 'success'}`}>
                                            {isSender ? 'SENT' : 'RECEIVED'}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 'bold', color: isSender ? '#e63946' : '#089156' }}>
                                        {isSender ? '-' : '+'} ₹{tx.amount.toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTransactionHistory;