import React, { useState } from 'react';
import axios from 'axios';

const DepositForm = ({ user, onBack }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDeposit = async (e) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);

    if (isNaN(depositAmount) || depositAmount <= 0) {
        return alert("Please enter a valid amount");
    }
    
    setLoading(true);
    try {
        // Use standard params object for @RequestParam compatibility
        await axios.post(`http://localhost:8080/api/transactions/deposit-request`, null, {
            params: {
                accNo: user.accountNumber,
                amount: depositAmount,
                email: user.email // Added missing email parameter required by UserController
            }
        });
        
        alert("Success! Your deposit request for ₹" + depositAmount + " has been sent to Admin.");
        onBack();
    } catch (err) {
        // Extract the actual error message instead of [object Object]
        const errorMsg = err.response?.data?.message || err.response?.data || "Server connection error";
        alert("Request failed: " + errorMsg);
        console.error("Deposit Error:", err);
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="form-card-container">
            <div className="form-header">
                <h2>Add Funds to Account</h2>
                <p>Submit a request to credit Account: <code className="acc-number" style={{background: '#e0e0e0'}}>{user.accountNumber}</code></p>
            </div>
            
            <form onSubmit={handleDeposit} className="professional-form" style={{padding: '20px'}}>
                <div className="input-group">
                    <label>Amount (INR)</label>
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        placeholder="e.g. 5000"
                        required 
                    />
                </div>
                
                <div style={{display: 'flex', gap: '15px', marginTop: '20px'}}>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Sending..." : "Request Deposit"}
                    </button>
                    <button type="button" className="logout-btn" onClick={onBack} style={{background: '#666'}}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DepositForm;