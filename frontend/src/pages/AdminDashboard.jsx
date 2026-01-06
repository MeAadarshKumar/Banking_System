import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserProfileView from './UserProfileView';
import DepositApprovalView from './DepositApproval';
import '../styles/Dashboard.css';
import AdminTransaction  from './AdminTransaction';
const AdminDashboard = ({ onLogout, user }) => { 
    const [users, setUsers] = useState([]);
    const [pendingDeposits, setPendingDeposits] = useState([]);
    const [view, setView] = useState('stats');
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [allTransactions, setAllTransactions] = React.useState([]);


    useEffect(() => {
        if (view === 'userList') fetchUsers();
        if (view === 'deposits' || view === 'stats') fetchPending();
        if (view === 'transfers') fetchAllTransactions();
    }, [view]);


    const fetchAllTransactions = async () => {
    try {
        const res = await axios.get("http://localhost:8080/api/admin/all-transactions");
        setAllTransactions(res.data);
    } catch (error) { console.error("Error fetching transactions", error); }
    };



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

    const handleAction = async (id, action) => {
        try {
            const url = action === 'approve' 
                ? `http://localhost:8080/api/admin/approve-deposit/${id}`
                : `http://localhost:8080/api/admin/reject-deposit/${id}`;
            
            await axios.post(url);
            alert(`Deposit ${action === 'approve' ? 'Approved' : 'Rejected'}!`);
            fetchPending();
        } catch (error) { 
            // Better error logging to identify 500 errors
            console.error("Action Error:", error.response?.data);
            alert(`${action} failed: Internal Server Error (Check Backend Logs)`); 
        }
    };

    const handleDeleteUser = async (accNo) => {
        if (window.confirm(`Are you sure you want to remove account ${accNo}?`)) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/delete-user/${accNo}`);
                alert("User removed successfully.");
                fetchUsers();
            } catch (error) { alert("Delete failed."); }
        }
    };

    return (
        <div className="dashboard-wrapper">
            <nav className="navbar">
                <div className="nav-brand">🏦 ADMIN PANEL</div>
                <ul className="nav-links">
                    {/* Each button now resets selectedEmail to null so the view can change */}
                    <li>
                        <button 
                            className={`nav-link-btn ${view === 'stats' ? 'active' : ''}`} 
                            onClick={() => { setView('stats'); setSelectedEmail(null); }}
                        >
                            Analytics
                        </button>
                    </li>
                    <li>
                        <button 
                            className={`nav-link-btn ${view === 'deposits' ? 'active' : ''}`} 
                            onClick={() => { setView('deposits'); setSelectedEmail(null); }}
                        >
                            Deposits
                        </button>
                    </li>
                    <li>
                        <button 
                            className={`nav-link-btn ${view === 'transfers' ? 'active' : ''}`} 
                            onClick={() => { setView('transfers'); setSelectedEmail(null); }}
                        >
                            Transfers
                        </button>
                    </li>
                    <li>
                        <button 
                            className={`nav-link-btn ${view === 'userList' ? 'active' : ''}`} 
                            onClick={() => { setView('userList'); setSelectedEmail(null); }}
                        >
                            Users
                        </button>
                    </li>
                    <li><button className="logout-btn" onClick={onLogout}>Logout</button></li>
                </ul>
            </nav>

            <main className="dashboard-content">
                {selectedEmail ? (
                    <UserProfileView userEmail={selectedEmail} onBack={() => setSelectedEmail(null)} />
                ) : (
                    <>
                        {view === 'deposits' && (
                            <DepositApprovalView requests={pendingDeposits} onAction={handleAction} />
                        )}

                        {view === 'transfers' && (
                            <AdminTransaction transactions={allTransactions} />
                        )}

                        {view === 'userList' && (
                            <div className="form-card-container">
                                <div className="form-header">
                                    <h2>User Database</h2>
                                    <input 
                                        type="text" 
                                        className="search-input" 
                                        placeholder="Search by name..." 
                                        onChange={(e) => setSearchTerm(e.target.value)} 
                                    />
                                </div>
                                <div className="table-responsive">
                                    <table className="professional-table">
                                        <thead>
                                            <tr>
                                                <th>Cust Name</th>
                                                <th>Account No</th>
                                                <th className="text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.filter(u => (u.firstName + " " + u.lastName).toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                                                <tr key={u.accountNumber}>
                                                    <td className="user-name">{u.firstName} {u.lastName}</td>
                                                    <td><code className="acc-number">{u.accountNumber}</code></td>
                                                    <td className="text-right">
                                                        <div className="admin-actions">
                                                            <button className="view-btn-small" onClick={() => setSelectedEmail(u.email)}>Review</button>
                                                            <button className="remove-btn-small" onClick={() => handleDeleteUser(u.accountNumber)}>Remove</button>
                                                        </div>
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