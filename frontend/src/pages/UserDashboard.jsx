import React, { useState } from 'react';
import TransferMoney from './TransferMoney';
import UserProfileView from './UserProfileView';
import DepositForm from './DepositForm';
// IMPORT the new history component
import UserTransactionHistory from './UserTransactionHistory'; 
import '../styles/Dashboard.css';

const UserDashboard = ({ onLogout, user }) => {
    // Consolidated state to manage all views
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
                        >
                            Home
                        </button>
                    </li>
                    <li>
                        <button 
                            className={`nav-link-btn ${activeTab === 'deposit' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('deposit')}
                        >
                            Deposit
                        </button>
                    </li>

                    {/* UPDATED DROPDOWN: Uses activeTab instead of undefined view/setView */}
                    <li className="dropdown">
                        <button className={`nav-link-btn ${activeTab === 'transfer' || activeTab === 'history' ? 'active' : ''}`}>
                            Transfer ▾
                        </button>
                        <div className="dropdown-content">
                            <button className="dropdown-item" onClick={() => setActiveTab('transfer')}>
                                Send Money
                            </button>
                            <button className="dropdown-item" onClick={() => setActiveTab('history')}>
                                Transaction History
                            </button>
                        </div>
                    </li>

                    <li>
                        <button 
                            className={`nav-link-btn ${activeTab === 'profile' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                        </button>
                    </li>
                    <li><button className="logout-btn" onClick={onLogout}>Logout</button></li>
                </ul>
            </nav>

            <main className="dashboard-content">
                {/* --- HOME VIEW --- */}
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

                {/* --- DEPOSIT VIEW --- */}
                {activeTab === 'deposit' && (
                    <DepositForm user={user} onBack={() => setActiveTab('home')} />
                )}

                {/* --- TRANSFER VIEW (Send Money) --- */}
                {activeTab === 'transfer' && (
                    <TransferMoney senderAcc={user.accountNumber} />
                )}

                {/* --- TRANSACTION HISTORY VIEW --- */}
                {activeTab === 'history' && (
                    <UserTransactionHistory userAccount={user.accountNumber} />
                )}

                {/* --- PROFILE VIEW --- */}
                {activeTab === 'profile' && (
                    <UserProfileView 
                        userEmail={user.email} 
                        onBack={() => setActiveTab('home')} 
                    />
                )}
            </main>
        </div>
    );
};

export default UserDashboard;