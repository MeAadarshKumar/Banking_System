import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AdminLoanView = () => {
    const [loans, setLoans] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState(null);

    const fetchLoans = useCallback(async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/loans/admin/all`);
            const filtered = res.data.filter(loan => 
                loan.accountNumber && loan.accountNumber !== "TEMPLATE"
            );
            setLoans(filtered);
        } catch (error) {
            console.error("Error fetching loans:", error);
        }
    }, []);

    useEffect(() => {
        fetchLoans();
        window.addEventListener('focus', fetchLoans);
        return () => window.removeEventListener('focus', fetchLoans);
    }, [fetchLoans]);

    // --- NEW FUNCTION TO HANDLE APPROVE/REJECT ---
    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/loans/admin/status/${id}/${status}`);
            alert(`Loan ${status} successfully!`);
            setSelectedLoan(null); // Close modal
            fetchLoans(); // Refresh table
        } catch (error) {
            console.error("Status update error:", error);
            alert("Failed to update loan status.");
        }
    };

    return (
        <div className="dashboard-content">
            <div className="form-card-container">
                <div className="form-header">
                    <h2>Manage Loan Requests</h2>
                    <p>Review and process incoming customer loan applications</p>
                </div>
                
                <div className="table-responsive">
                    <table className="professional-table">
                        <thead>
                            <tr>
                                <th>Acc No</th>
                                <th>Principal</th>
                                <th>Status</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map(loan => (
                                <tr key={loan.id}>
                                    <td><span className="acc-number">{loan.accountNumber}</span></td>
                                    <td><strong>₹{loan.principal.toLocaleString()}</strong></td>
                                    <td><span className={`badge ${loan.status.toLowerCase()}`}>{loan.status}</span></td>
                                    <td className="text-right">
                                        <button className="view-btn-small" onClick={() => setSelectedLoan(loan)}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedLoan && (
                <div className="loan-detail-overlay" onClick={() => setSelectedLoan(null)}>
                    <div className="loan-detail-card" onClick={e => e.stopPropagation()}>
                        <h3>Loan Profile: {selectedLoan.accountNumber}</h3>
                        <div className="detail-grid">
                            <p><span>Status</span> <b className={`badge ${selectedLoan.status.toLowerCase()}`}>{selectedLoan.status}</b></p>
                            <p><span>Total Principal</span> <b>₹{selectedLoan.principal}</b></p>
                            <p><span>Interest Rate</span> <b>{selectedLoan.interestRate}%</b></p>
                            <p><span>EMI Amount</span> <b className="emi-text">₹{selectedLoan.emiAmount?.toFixed(2)}</b></p>
                        </div>

                        {/* --- NEW ACTION BUTTONS --- */}
                        {selectedLoan.status === 'PENDING' && (
                            <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                                <button 
                                    className="view-btn-small" 
                                    style={{flex: 1, background: '#2ecc71', color: 'white'}}
                                    onClick={() => handleStatusUpdate(selectedLoan.id, 'APPROVED')}
                                >
                                    APPROVE
                                </button>
                                <button 
                                    className="remove-btn-small" 
                                    style={{flex: 1}}
                                    onClick={() => handleStatusUpdate(selectedLoan.id, 'REJECTED')}
                                >
                                    REJECT
                                </button>
                            </div>
                        )}

                        <button 
                            className="logout-btn" 
                            style={{width: '100%', marginTop: '10px', background: '#666'}} 
                            onClick={() => setSelectedLoan(null)}
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLoanView;