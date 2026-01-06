import React from 'react';

const AdminTransaction = ({ transactions }) => {
    return (
        <div className="form-card-container">
            <div className="form-header">
                <h2>Global Transaction Log</h2>
                <p>Monitoring all transfers and approved deposits</p>
            </div>
            <div className="table-responsive">
                <table className="professional-table">
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Type</th>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? transactions.map((tx) => (
                            <tr key={tx.id}>
                                <td style={{fontSize: '12px'}}>{new Date(tx.timestamp).toLocaleString()}</td>
                                <td><span className={`badge ${tx.type === 'DEPOSIT' ? 'success' : ''}`}>{tx.type}</span></td>
                                <td>{tx.senderAccountNumber || 'BANK'}</td>
                                <td>{tx.receiverAccountNumber}</td>
                                <td style={{fontWeight: 'bold', color: tx.type === 'DEPOSIT' ? '#089156' : '#e63946'}}>
                                    ₹{tx.amount.toLocaleString()}
                                </td>
                                <td>
                                    <span className={`badge ${tx.status === 'APPROVED' ? 'success' : ''}`}>
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: '30px'}}>No transactions recorded.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTransaction;