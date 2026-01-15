import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserApplyLoan = ({ user }) => {
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/loans/templates`)
            .then(res => setTemplates(res.data));
    }, []);

    const handleApply = async (template) => {
        const application = {
            accountNumber: user.accountNumber,
            principal: template.principal,
            interestRate: template.interestRate,
            durationMonths: template.durationMonths
        };
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/loans/apply`, application);
            alert("Application Submitted!");
        } catch (err) { alert("Error submitting application"); }
    };

    if (templates.length === 0) return <div className="no-loans-msg"><h3>No Loan models available now !!</h3></div>;

    return (
        <div className="table-responsive">
            <h2>Available Loan Models</h2>
            <table className="professional-table">
                <thead><tr><th>Amount</th><th>Interest</th><th>Duration</th><th>Action</th></tr></thead>
                <tbody>
                    {templates.map(t => (
                        <tr key={t.templateId}>
                            <td>₹{t.principal}</td><td>{t.interestRate}%</td><td>{t.durationMonths} Mo</td>
                            <td><button onClick={() => handleApply(t)} className="view-btn-small" style={{background:'#089156', color:'white'}}>APPLY</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};