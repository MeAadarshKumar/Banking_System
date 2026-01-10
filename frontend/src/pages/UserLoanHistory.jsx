import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const UserLoanHistory = ({ userAccount }) => {
    const [myLoans, setMyLoans] = useState([]);

    const fetchMyLoans = useCallback(async () => {
        if (!userAccount) return;
        try {
            const res = await axios.get("http://localhost:8080/api/loans/admin/all");
            // Filter out templates (items without an accountNumber) AND match the user
            const filtered = res.data.filter(l => l.accountNumber === userAccount);
            setMyLoans(filtered);
        } catch (err) {
            console.error("Error fetching loans", err);
        }
    }, [userAccount]);

    useEffect(() => {
        fetchMyLoans();

        // Fix: Changed fetchLoans to fetchMyLoans
        const handleFocus = () => fetchMyLoans();
        window.addEventListener('focus', handleFocus);
        
        return () => window.removeEventListener('focus', handleFocus);
    }, [fetchMyLoans]); // Added dependency here for best practice

    const handlePayment = async (loanId, amount, isPrincipal) => {
        try {
            await axios.post(`http://localhost:8080/api/loans/pay`, {
                loanId,
                amount,
                isDirectPrincipal: isPrincipal
            });
            alert("Payment Successful!");
            fetchMyLoans(); 
        } catch (err) {
            alert(err.response?.data || "Payment failed");
        }
    };

    return (
        <div className="table-responsive">
            <div className="form-header"><h3>My Loan History</h3></div>
            <table className="professional-table">
                <thead>
                    <tr>
                        <th>Remaining Principal</th>
                        <th>Monthly EMI</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {myLoans.map(l => (
                        <tr key={l.loanId}>
                            <td>₹{l.remainingPrincipal?.toLocaleString() || l.principal.toLocaleString()}</td>
                            <td className="emi-text">₹{l.emiAmount?.toFixed(2) || "0.00"}</td>
                            <td><span className={`badge ${l.status.toLowerCase()}`}>{l.status}</span></td>
                            <td>
                                {l.status === 'APPROVED' && (
                                    <div className="payment-group">
                                        <button className="approve-btn-small" onClick={() => handlePayment(l.loanId, l.emiAmount, false)}>Pay EMI</button>
                                        <button className="view-btn-small" onClick={() => {
                                            const amt = prompt("Enter Principal Amount:");
                                            if(amt) handlePayment(l.loanId, parseFloat(amt), true);
                                        }}>Reduce Principal</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserLoanHistory;