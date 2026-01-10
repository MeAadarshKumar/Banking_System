import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserPayEMI = () => {
    const [loans, setLoans] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [isDirectPrincipal, setIsDirectPrincipal] = useState(false);
    const [customAmount, setCustomAmount] = useState("");

    useEffect(() => {
        // Fetch only approved/active loans for this user
        axios.get('/api/loans/my-active-loans').then(res => setLoans(res.data));
    }, []);

    const handlePayment = async () => {
        const amount = isDirectPrincipal ? customAmount : selectedLoan.emiAmount;
        try {
            await axios.post(`/api/loans/pay/${selectedLoan.id}`, null, {
                params: { paymentAmount: amount, isDirectPrincipal }
            });
            alert("Payment Successful!");
            window.location.reload();
        } catch (err) {
            alert(err.response.data.message || "Payment Failed");
        }
    };

    return (
        <div className="payment-container">
            <h2>Loan Repayment</h2>
            <select onChange={(e) => setSelectedLoan(loans.find(l => l.id == e.target.value))}>
                <option>Select a Loan</option>
                {loans.map(loan => (
                    <option key={loan.id} value={loan.id}>Loan #{loan.id} - {loan.type}</option>
                ))}
            </select>

            {selectedLoan && (
                <div className="payment-details">
                    <p>Remaining Principal: ${selectedLoan.remainingPrincipal.toFixed(2)}</p>
                    <p>Monthly EMI: <strong>${selectedLoan.emiAmount.toFixed(2)}</strong></p>
                    
                    <div className="payment-options">
                        <label>
                            <input type="checkbox" onChange={() => setIsDirectPrincipal(!isDirectPrincipal)} />
                            Pay towards Principal directly?
                        </label>
                        
                        {isDirectPrincipal ? (
                            <input 
                                type="number" 
                                placeholder="Enter Amount" 
                                onChange={(e) => setCustomAmount(e.target.value)} 
                            />
                        ) : null}
                    </div>

                    <button onClick={handlePayment} className="btn-pay">
                        Pay ${isDirectPrincipal ? customAmount : selectedLoan.emiAmount.toFixed(2)}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserPayEMI;