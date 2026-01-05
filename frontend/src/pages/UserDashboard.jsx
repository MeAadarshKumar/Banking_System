import React, { useState } from 'react';
import TransferMoney from './TransferMoney';
import UserProfileView from './UserProfileView';
import '../styles/Dashboard.css';

const UserDashboard = ({ onLogout, user }) => {
    const [activeTab, setActiveTab] = useState('home');

    if (!user) return <div className="dashboard-wrapper">Initializing session...</div>;

    return (
        <div className="dashboard-wrapper">
            <nav className="navbar">
                <div className="nav-brand">🏦 USER PORTAL</div>
                <ul className="nav-links">
                    <li><button className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>Home</button></li>
                    <li><button className={`nav-link-btn ${activeTab === 'transfer' ? 'active' : ''}`} onClick={() => setActiveTab('transfer')}>Transfer</button></li>
                    <li><button className={`nav-link-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button></li>
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
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <UserProfileView 
                        userEmail={user.email} 
                        onBack={() => setActiveTab('home')} 
                    />
                )}
                
                {activeTab === 'transfer' && <TransferMoney senderAcc={user.accountNumber} />}
            </main>
        </div>
    );
};

export default UserDashboard;