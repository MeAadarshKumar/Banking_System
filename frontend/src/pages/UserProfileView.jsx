import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/Dashboard.css';

const UserProfileView = ({ userEmail, onBack }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!userEmail) return;
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/details/${userEmail}`);
                setUserData(response.data);
            } catch (err) { console.error("Profile Fetch Error"); }
            finally { setLoading(false); }
        };
        fetchDetails();
    }, [userEmail]);

    const generatePDF = () => {
        if (!userData) return;
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Official Customer Profile Report", 14, 20);
        autoTable(doc, {
            startY: 30,
            head: [['Field', 'Information']],
            body: [
                ["Account Number", userData.accountNumber],
                ["Current Balance", `₹${userData.balance?.toLocaleString() || "0.00"}`],
                ["Full Name", `${userData.firstName} ${userData.lastName}`],
                ["Email", userData.email],
                ["Phone", userData.phoneNumber],
                ["PAN Card", userData.panNumber],
                ["Aadhar Number", userData.aadharNumber],
                ["Date of Birth", userData.dob],
                ["Age/Gender", `${userData.age} / ${userData.gender}`],
                ["Father's Name", userData.fatherName],
                ["Mother's Name", userData.motherName],
                ["Address", userData.address]
            ],
            theme: 'striped',
            headStyles: { fillColor: [67, 97, 238] }
        });
        doc.save(`${userData.firstName}_KYC_Report.pdf`);
    };

    if (loading) return <div className="form-card-container"><h2>Loading Secure Records...</h2></div>;

    return (
        <div className="form-card-container">
            <div className="profile-header-layout">
                <div className="header-top-actions">
                    <button className="download-pdf-btn" onClick={generatePDF}>Download PDF</button>
                    <button className="back-btn-top" onClick={onBack}>← Back</button>
                </div>
                <div className="welcome-center-section">
                    <h1>Welcome: {userData?.firstName} {userData?.lastName}</h1>
                    <p className="centered-acc">A/C: {userData?.accountNumber}</p>
                </div>
            </div>

            <div className="view-grid-container" style={{padding: '20px'}}>
                <div className="view-section full-width financial-summary-card">
                    <h3>Financial Summary</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span>Account Status</span>
                            <p className="status-active">ACTIVE</p>
                        </div>
                        <div className="info-item">
                            <span>Available Balance</span>
                            <p className="balance-text">₹{userData?.balance?.toLocaleString() || "0.00"}</p>
                        </div>
                    </div>
                </div>

                <div className="view-section personal-details-card">
                    <h3>Personal Details</h3>
                    <div className="info-grid">
                        <div className="info-item"><span>Full Name</span><p>{userData?.firstName} {userData?.lastName}</p></div>
                        <div className="info-item"><span>Date of Birth</span><p>{userData?.dob}</p></div>
                        <div className="info-item"><span>Age / Gender</span><p>{userData?.age} / {userData?.gender}</p></div>
                    </div>
                </div>

                <div className="view-section identity-kyc-card">
                    <h3>Identity & KYC</h3>
                    <div className="info-grid">
                        <div className="info-item"><span>PAN Number</span><p style={{textTransform: 'uppercase'}}>{userData?.panNumber}</p></div>
                        <div className="info-item"><span>Aadhar Number</span><p>{userData?.aadharNumber}</p></div>
                        <div className="info-item"><span>KYC Status</span><p className="status-active">VERIFIED</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default UserProfileView;