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

    const handleStatusUpdate = async (id, status) => {
        // Validation check to prevent 'undefined' calls
        if (!id) {
            alert("Error: Loan ID is missing.");
            return;
        }

        try {
            const formattedStatus = status.toUpperCase(); 
            const url = `${process.env.REACT_APP_API_URL}/api/loans/admin/status/${id}/${formattedStatus}`;
            
            await axios.post(url, {}); 

            alert(`Loan ${formattedStatus} successfully!`);
            setSelectedLoan(null); 
            fetchLoans(); 
        } catch (error) {
            console.error("Status update error:", error);
            // Fix for [object Object] alert
            const errorMsg = error.response?.data?.message || error.response?.data || "Internal Server Error";
            alert("Failed to update loan status: " + errorMsg);
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
                                // Use loanId to match the Java Model
                                <tr key={loan.loanId}>
                                    <td><span className="acc-number">{loan.accountNumber}</span></td>
                                    <td><strong>₹{loan.principal?.toLocaleString()}</strong></td>
                                    <td><span className={`badge ${loan.status?.toLowerCase()}`}>{loan.status}</span></td>
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
                            <p><span>Status</span> <b className={`badge ${selectedLoan.status?.toLowerCase()}`}>{selectedLoan.status}</b></p>
                            <p><span>Total Principal</span> <b>₹{selectedLoan.principal}</b></p>
                            <p><span>Interest Rate</span> <b>{selectedLoan.interestRate}%</b></p>
                            <p><span>EMI Amount</span> <b className="emi-text">₹{selectedLoan.emiAmount?.toFixed(2)}</b></p>
                        </div>

                        {selectedLoan.status === 'PENDING' && (
                            <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                                <button 
                                    className="view-btn-small" 
                                    style={{flex: 1, background: '#2ecc71', color: 'white'}}
                                    // Mapping fixed to selectedLoan.loanId
                                    onClick={() => handleStatusUpdate(selectedLoan.loanId, 'APPROVED')}
                                >
                                    APPROVE
                                </button>
                                <button 
                                    className="remove-btn-small" 
                                    style={{flex: 1}}
                                    // Mapping fixed to selectedLoan.loanId
                                    onClick={() => handleStatusUpdate(selectedLoan.loanId, 'REJECTED')}
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