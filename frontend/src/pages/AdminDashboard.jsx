import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserProfileView from './UserProfileView';
import '../styles/Dashboard.css';

// FIX: Added 'user' to destructuring props
const AdminDashboard = ({ onLogout, user }) => { 
    const [users, setUsers] = useState([]);
    const [pendingDeposits, setPendingDeposits] = useState([]);
    const [view, setView] = useState('stats');
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (view === 'userList') fetchUsers();
        if (view === 'stats') fetchPending();
    }, [view]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/admin/users");
            setUsers(res.data);
        } catch (error) { console.error("Error fetching users:", error); }
    };

    const fetchPending = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/admin/pending-deposits");
            setPendingDeposits(res.data);
        } catch (error) { console.error("Error fetching deposits:", error); }
    };

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:8080/api/admin/approve-deposit/${id}`);
            alert("Deposit Approved!");
            fetchPending();
        } catch (error) { alert("Approval failed."); }
    };

    const handleDeleteUser = async (accNo) => {
        if (window.confirm(`Are you sure?`)) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/delete-user/${accNo}`);
                fetchUsers();
            } catch (error) { alert("Delete failed."); }
        }
    };

    const filteredUsers = users.filter(u => 
        (u.firstName + " " + u.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.accountNumber && u.accountNumber.includes(searchTerm))
    );

    return (
        <div className="dashboard-wrapper">
            <nav className="navbar">
                <div className="nav-brand">🏦 ADMIN PANEL</div>
                <ul className="nav-links">
                    <li><button className="nav-link-btn" onClick={() => {setView('stats'); setSelectedEmail(null);}}>Analytics</button></li>
                    <li><button className="nav-link-btn" onClick={() => {setView('loan'); setSelectedEmail(null);}}>Loans</button></li>
                    <li><button className="nav-link-btn" onClick={() => {setView('userList'); setSelectedEmail(null);}}>Users</button></li>
                    <li><button className="logout-btn" onClick={onLogout}>Logout</button></li>
                </ul>
            </nav>

            <main className="dashboard-content">
                {/* FIX: Move Profile Logic inside the content area */}
                {selectedEmail ? (
                    <UserProfileView 
                        userEmail={selectedEmail} 
                        onBack={() => setSelectedEmail(null)} 
                    />
                ) : (
                    <>
                        {view === 'stats' && (
                            <div className="form-card-container">
                                <div className="form-header"><h2>Approval Queue</h2></div>
                                <div className="table-responsive">
                                    <table className="professional-table">
                                        <thead>
                                            <tr><th>Account No</th><th>Amount</th><th>Action</th></tr>
                                        </thead>
                                        <tbody>
                                            {pendingDeposits.map(tx => (
                                                <tr key={tx.id}>
                                                    <td>{tx.receiverAccountNumber}</td>
                                                    <td>₹{tx.amount}</td>
                                                    <td><button className="view-btn-small" onClick={() => handleApprove(tx.id)}>Approve</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {view === 'userList' && (
                            <div className="form-card-container">
                                <div className="form-header">
                                    <h2>User Database</h2>
                                    <input type="text" className="search-input" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                                <div className="table-responsive">
                                    <table className="professional-table">
                                        <thead>
                                            <tr><th>Customer</th><th>Role</th><th>A/C</th><th>Action</th></tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(u => (
                                                <tr key={u.accountNumber}>
                                                    <td>{u.firstName} {u.lastName}</td>
                                                    <td>{u.role}</td>
                                                    <td>{u.accountNumber}</td>
                                                    <td>
                                                        <button className="view-btn-small" onClick={() => setSelectedEmail(u.email)}>Review</button>
                                                        <button className="remove-btn-small" onClick={() => handleDeleteUser(u.accountNumber)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
export default AdminDashboard;