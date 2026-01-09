import React, { useState } from 'react';
import TransferMoney from './TransferMoney';
import UserProfileView from './UserProfileView';
import DepositForm from './DepositForm';
import UserTransactionHistory from './UserTransactionHistory'; 
import UserLoanRequest from './UserLoanRequest'; // Import the new component
import '../styles/Dashboard.css';
import UserLoanHistory from './UserLoanHistory'; // Ensure this import exists


const UserDashboard = ({ onLogout, user }) => {
    const [activeTab, setActiveTab] = useState('home');

    if (!user) return <div className="dashboard-wrapper">Initializing session...</div>;

    return (
        <div className="dashboard-wrapper">
            <nav className="navbar">
                <div className="nav-brand">🏦 USER PORTAL</div>
                <ul className="nav-links">
                    <li>
                        <button 
                            className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('home')}
                        >Home</button>
                    </li>
                    <li>
                        <button 
                            className={`nav-link-btn ${activeTab === 'deposit' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('deposit')}
                        >Deposit</button>
                    </li>

                    <li className="dropdown">
                        <button className={`nav-link-btn ${activeTab === 'transfer' || activeTab === 'history' ? 'active' : ''}`}>
                            Transfer ▾
                        </button>
                        <div className="dropdown-content">
                            <button className="dropdown-item" onClick={() => setActiveTab('transfer')}>Send Money</button>
                            <button className="dropdown-item" onClick={() => setActiveTab('history')}>Transaction History</button>
                        </div>
                    </li>

                   <li className="dropdown">
                        <button className={`nav-link-btn ${activeTab === 'applyLoan' || activeTab === 'loanHistory' ? 'active' : ''}`}>
                            Loan ▾
                        </button>
                        <div className="dropdown-content">
                            <button className="dropdown-item" onClick={() => setActiveTab('applyLoan')}>Apply Loan</button>
                            <button className="dropdown-item" onClick={() => setActiveTab('loanHistory')}>Loan History</button>
                        </div>
                    </li>

                    <li>
                        <button 
                            className={`nav-link-btn ${activeTab === 'profile' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('profile')}
                        >Profile</button>
                    </li>
                    <li><button className="logout-btn" onClick={onLogout}>Logout</button></li>
                </ul>
            </nav>

            <main className="dashboard-content">
                {activeTab === 'home' && (
                    <div className="form-card-container">
                        <div className="form-header">
                            <h2>Welcome back, {user.firstName}!</h2>
                            <p>Account Number: <code className="acc-number">{user.accountNumber}</code></p>
                        </div>
                        <div className="stats-grid">
                            <div className="stat-card primary">
                                <span className="stat-label">Available Balance</span>
                                <h3 className="stat-value">₹{user.balance?.toLocaleString() || "0.00"}</h3>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Account Status</span>
                                <h3 className="stat-value" style={{color: '#089156', fontSize: '18px'}}>ACTIVE</h3>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'deposit' && <DepositForm user={user} onBack={() => setActiveTab('home')} />}
                {activeTab === 'transfer' && <TransferMoney senderAcc={user.accountNumber} />}
                {activeTab === 'history' && <UserTransactionHistory userAccount={user.accountNumber} />}
                
            {/* FIXED: Changed 'loan' to 'applyLoan' to match the nav button */}
                {activeTab === 'applyLoan' && (
                    <div className="form-card-container">
                        {/* Pass the full user object to satisfy the child component's needs */}
                        <UserLoanRequest user={user} /> 
                    </div>
                )}

                {/* ADDED: Logic for loanHistory if you have a component for it */}
                {activeTab === 'loanHistory' && (
                    <div className="form-card-container">
                        <UserLoanHistory userAccount={user.accountNumber} />
                    </div>
                )}

                {activeTab === 'profile' && (
                    <UserProfileView userEmail={user.email} onBack={() => setActiveTab('home')} />
                )}
            </main>
        </div>
    );
};

export default UserDashboard;