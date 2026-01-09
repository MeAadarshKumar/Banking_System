import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserLoanHistory = ({ userAccount }) => {
    const [myLoans, setMyLoans] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/loans/admin/all")
            .then(res => {
                // Show only this user's applications, excluding templates
                const filtered = res.data.filter(l => l.accountNumber === userAccount);
                setMyLoans(filtered);
            });
    }, [userAccount]);

    return (
        <div className="table-responsive">
            <div className="form-header"><h3>My Loan History</h3></div>
            <table className="professional-table">
                <thead>
                    <tr>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Total Repayment</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {myLoans.map(l => (
                        <tr key={l.loanId}>
                            <td>₹{l.principal.toLocaleString()}</td>
                            <td>{l.interestRate}%</td>
                            <td>₹{l.totalRepayment.toFixed(2)}</td>
                            <td><span className={`badge ${l.status.toLowerCase()}`}>{l.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserLoanHistory;