import React from 'react';

const DepositApproval = ({ requests, onAction }) => {
    return (
        <div className="form-card-container">
            <div className="form-header">
                <h2>Deposit Approval Management</h2>
                <p>Review incoming fund requests</p>
            </div>
            
            <div className="table-responsive">
                <table className="professional-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Account Number</th>
                            <th>Amount</th>
                            <th className="text-right">Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length > 0 ? requests.map((req) => (
                            <tr key={req.id}>
                                <td><span className="badge">#{req.id}</span></td>
                                {/* FIX: Ensure req.accountNumber is what the backend saved */}
                                <td><code className="acc-number">{req.accountNumber}</code></td>
                                <td className="stat-value" style={{color: '#2ecc71', fontWeight: 'bold'}}>
                                    ₹{req.amount?.toLocaleString()}
                                </td>
                                <td className="text-right">
                                    <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                                        <button 
                                            className="view-btn-small" 
                                            style={{backgroundColor: '#2ecc71', color: 'white'}}
                                            onClick={() => onAction(req.id, 'approve')}
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            className="remove-btn-small" 
                                            onClick={() => onAction(req.id, 'reject')}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" style={{textAlign: 'center', padding: '30px'}}>No pending requests.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DepositApproval;