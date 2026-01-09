import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCreateLoanModel = () => {
    const [templates, setTemplates] = useState([]);
    const [formData, setFormData] = useState({ principal: '', interestRate: '', durationMonths: '' });

    useEffect(() => { fetchTemplates(); }, []);

    const fetchTemplates = async () => {
        const res = await axios.get("http://localhost:8080/api/loans/templates");
        setTemplates(res.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:8080/api/loans/templates/create", formData);
        alert("Model Created!");
        setFormData({ principal: '', interestRate: '', durationMonths: '' });
        fetchTemplates();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8080/api/loans/templates/${id}`);
        fetchTemplates();
    };

    return (
        <div className="form-card-container">
            <div className="form-header"><h2>Create Loan Model</h2></div>
            <form onSubmit={handleCreate} className="admin-form-inline" style={{padding:'20px', display:'flex', gap:'10px'}}>
                <input type="number" placeholder="Principal" value={formData.principal} onChange={e => setFormData({...formData, principal: e.target.value})} required className="search-input"/>
                <input type="number" placeholder="Interest %" value={formData.interestRate} onChange={e => setFormData({...formData, interestRate: e.target.value})} required className="search-input"/>
                <input type="number" placeholder="Months" value={formData.durationMonths} onChange={e => setFormData({...formData, durationMonths: e.target.value})} required className="search-input"/>
                <button type="submit" className="logout-btn" style={{background:'#4361ee'}}>SAVE MODEL</button>
            </form>
            <div className="table-responsive">
                <table className="professional-table">
                    <thead><tr><th>Principal</th><th>Interest</th><th>Duration</th><th>Action</th></tr></thead>
                    <tbody>
                        {templates.map(t => (
                            <tr key={t.templateId}>
                                <td>₹{t.principal}</td><td>{t.interestRate}%</td><td>{t.durationMonths} Mo</td>
                                <td><button onClick={() => handleDelete(t.templateId)} className="remove-btn-small">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminCreateLoanModel;