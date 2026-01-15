import React, { useState } from 'react';
import axios from 'axios';

const TransferMoney = ({ senderAcc }) => {
    const [transferData, setTransferData] = useState({
        to: "",
        amount: ""
    });
    const [loading, setLoading] = useState(false);

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (transferData.to === senderAcc) {
            return alert("You cannot transfer money to your own account.");
        }

        setLoading(true);
        try {
            // Using the @RequestParam mapping we defined in the Backend Step 4
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/transactions/transfer?from=${senderAcc}&to=${transferData.to}&amount=${transferData.amount}`
            );
            alert("Transfer Successful: " + response.data);
            setTransferData({ to: "", amount: "" });
        } catch (err) {
            alert(err.response?.data || "Transfer failed. Please check the account number and balance.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-card-container">
            <div className="form-header">
                <h2>Transfer Funds</h2>
                <p>Move money securely to any 10-digit bank account number</p>
            </div>
            
            <form onSubmit={handleTransfer} className="professional-form" style={{padding: '30px'}}>
                <div className="view-section">
                    <h3>Recipient Details</h3>
                    <div className="info-grid">
                        <div className="input-group full-width">
                            <label>Beneficiary Account Number</label>
                            <input 
                                type="text" 
                                placeholder="Enter 10-digit Account Number" 
                                value={transferData.to}
                                required
                                onChange={(e) => setTransferData({...transferData, to: e.target.value})}
                            />
                        </div>
                        <div className="input-group full-width">
                            <label>Amount (₹)</label>
                            <input 
                                type="number" 
                                placeholder="0.00" 
                                value={transferData.amount}
                                required
                                onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="form-actions" style={{marginTop: '20px'}}>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Processing..." : "Confirm & Transfer"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TransferMoney;