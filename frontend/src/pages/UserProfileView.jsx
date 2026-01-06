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
                const response = await axios.get(`http://localhost:8080/api/user/details/${userEmail}`);
                setUserData(response.data);
            } catch (err) {
                console.error("Profile Fetch Error");
            } finally {
                setLoading(false);
            }
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
            <div className="form-header">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                    <div>
                        <button className="view-btn-small" onClick={onBack} style={{marginBottom: '10px'}}>← Back</button>
                        <h2>{userData?.firstName} {userData?.lastName}</h2>
                        <p className="acc-number">A/C: {userData?.accountNumber}</p>
                    </div>
                    <button className="nav-link-btn" onClick={generatePDF} style={{backgroundColor: '#4361ee', color: 'white'}}>Download PDF</button>
                </div>
            </div>

            <div className="view-grid-container" style={{padding: '20px'}}>
                
                {/* --- SEPARATE FINANCIAL SUMMARY SECTION --- */}
                <div className="view-section full-width" style={{borderTop: '4px solid #089156', background: '#f0fff4'}}>
                    <h3>Financial Summary</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span>Account Status</span>
                            <p style={{color: '#089156'}}>ACTIVE</p>
                        </div>
                        <div className="info-item">
                            <span>Available Balance</span>
                            <p style={{fontSize: '24px', color: '#1a1a2e', fontWeight: '700'}}>
                                ₹{userData?.balance?.toLocaleString() || "0.00"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 1: Personal */}
                <div className="view-section">
                    <h3>Personal Details</h3>
                    <div className="info-grid">
                        <div className="info-item"><span>Full Name</span><p>{userData?.firstName} {userData?.lastName}</p></div>
                        <div className="info-item"><span>Date of Birth</span><p>{userData?.dob}</p></div>
                        <div className="info-item"><span>Age / Gender</span><p>{userData?.age} / {userData?.gender}</p></div>
                    </div>
                </div>

                {/* Section 2: Identity */}
                <div className="view-section">
                    <h3>Identity & KYC</h3>
                    <div className="info-grid">
                        <div className="info-item"><span>PAN Number</span><p style={{textTransform: 'uppercase'}}>{userData?.panNumber}</p></div>
                        <div className="info-item"><span>Aadhar Number</span><p>{userData?.aadharNumber}</p></div>
                        <div className="info-item"><span>KYC Status</span><p style={{color: 'green', fontWeight: 'bold'}}>VERIFIED</p></div>
                    </div>
                </div>

                {/* Section 3: Family */}
                <div className="view-section">
                    <h3>Family Information</h3>
                    <div className="info-grid">
                        <div className="info-item"><span>Father's Name</span><p>{userData?.fatherName}</p></div>
                        <div className="info-item"><span>Mother's Name</span><p>{userData?.motherName}</p></div>
                    </div>
                </div>

                {/* Section 4: Contact */}
                <div className="view-section">
                    <h3>Contact Details</h3>
                    <div className="info-grid">
                        <div className="info-item"><span>Phone Number</span><p>{userData?.phoneNumber}</p></div>
                        <div className="info-item"><span>Email ID</span><p>{userData?.email}</p></div>
                    </div>
                </div>

                {/* Address Section */}
                <div className="view-section full-width">
                    <h3>Residential Address</h3>
                    <div className="info-item">
                        <p>{userData?.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileView;