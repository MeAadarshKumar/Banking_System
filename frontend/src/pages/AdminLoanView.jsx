import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminLoanView = () => {
    const [loans, setLoans] = useState([]);

    useEffect(() => { fetchLoans(); }, []);

    const fetchLoans = async () => {
        try {
            // Fetch all loans and filter out the "TEMPLATE" records on the frontend
            const res = await axios.get("http://localhost:8080/api/loans/admin/all");
            const userRequests = res.data.filter(l => l.accountNumber !== "TEMPLATE");
            setLoans(userRequests);
        } catch (err) { 
            console.error("Error fetching loans", err); 
        }
    };

    const handleAction = async (id, status) => {
        try {
            await axios.post(`http://localhost:8080/api/loans/admin/status/${id}/${status}`);
            alert(`Loan application ${status.toLowerCase()} successfully!`);
            fetchLoans(); // Refresh the table
        } catch (err) { 
            alert(err.response?.data || "Operation failed"); 
        }
    };

    return (
        <div className="form-card-container">
            <div className="form-header">
                <h2>Loan Request Management</h2>
                <p>Review and process pending customer loan applications</p>
            </div>
            
            <div className="table-responsive">
                <table className="professional-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Account Number</th>
                            <th>Principal</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.length > 0 ? loans.map(l => (
                            <tr key={l.loanId}>
                                <td>#LN-{l.loanId}</td>
                                <td><code className="acc-number">{l.accountNumber}</code></td>
                                <td>₹{l.principal.toLocaleString()}</td>
                                <td>{l.durationMonths} Months</td>
                                <td>
                                    <span className={`status-badge ${l.status.toLowerCase()}`}>
                                        {l.status}
                                    </span>
                                </td>
                                <td className="text-right">
                                    {l.status === 'PENDING' ? (
                                        <div className="admin-actions">
                                            <button className="approve-btn-small" onClick={() => handleAction(l.loanId, 'APPROVED')}>Approve</button>
                                            <button className="reject-btn-small" onClick={() => handleAction(l.loanId, 'REJECTED')}>Decline</button>
                                        </div>
                                    ) : (
                                        <span className="processed-label">Processed</span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No user loan applications found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLoanView;