import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserLoanRequest = ({ user }) => {
    const [models, setModels] = useState([]);

    useEffect(() => {
        // Using the specific templates endpoint we created earlier
        axios.get("http://localhost:8080/api/loans/templates")
            .then(res => setModels(res.data))
            .catch(err => console.error("Error fetching loan models:", err));
    }, []);

    const handleApply = async (m) => {
        // FIX: Safety check for user object
        if (!user || !user.accountNumber) {
            alert("User session not found. Please log in again.");
            return;
        }

        const application = { 
            accountNumber: user.accountNumber, 
            principal: m.principal, 
            interestRate: m.interestRate, 
            durationMonths: m.durationMonths,
            status: 'PENDING'
        };
        
        try {
            await axios.post("http://localhost:8080/api/loans/apply", application);
            alert("Loan application submitted successfully!");
        } catch (err) {
            alert("Failed to submit application: " + (err.response?.data || "Server error"));
        }
    };

    // FIX: Render loading state if user is undefined
    if (!user) return <div className="no-loans-msg">Loading user details...</div>;

    return (
        <div className="loan-container">
            {models.length === 0 ? (
                <div className="no-loans-msg">
                    <h3>No Loan models available now !!</h3>
                </div>
            ) : (
                <div className="table-responsive">
                    <div className="form-header"><h3>Available Loan Offers</h3></div>
                    <table className="professional-table">
                        <thead>
                            <tr>
                                <th>Amount</th>
                                <th>Interest</th>
                                <th>Period</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.map(m => (
                                <tr key={m.loanId || m.templateId}>
                                    <td>₹{m.principal.toLocaleString()}</td>
                                    <td>{m.interestRate}%</td>
                                    <td>{m.durationMonths} Mo</td>
                                    <td>
                                        <button onClick={() => handleApply(m)} className="apply-btn">
                                            Apply Now
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserLoanRequest;