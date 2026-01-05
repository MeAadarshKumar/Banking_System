import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const ProfileForm = ({ email, onComplete }) => {
    const [profileData, setProfileData] = useState({
        email: email, firstName: '', lastName: '', phoneNumber: '', address: '',
        panNumber: '', aadharNumber: '', age: '', gender: '', dob: '', fatherName: '', motherName: ''
    });

    const handleChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/auth/complete-profile", profileData);
            onComplete();
        } catch (err) {
            alert("Error saving profile. Please check your details.");
        }
    };

    return (
        <div className="dashboard-wrapper">
            <nav className="navbar">
                <div className="nav-brand">🏦 KYC COMPLIANCE PORTAL</div>
            </nav>
            <main className="dashboard-content">
                <div className="form-card-container">
                    <div className="form-header">
                        <h2>Account Activation</h2>
                        <p>Complete your KYC profile to enable banking services for <strong>{email}</strong></p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="professional-form">
                        <div className="form-section">
                            <h3>Personal Information</h3>
                            <div className="profile-grid">
                                <div className="input-group">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" placeholder="e.g. John" required onChange={handleChange} />
                                </div>
                                <div className="input-group">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" placeholder="e.g. Doe" required onChange={handleChange} />
                                </div>
                                <div className="input-group">
                                    <label>Phone Number</label>
                                    <input type="tel" name="phoneNumber" placeholder="+91 00000 00000" required onChange={handleChange} />
                                </div>
                                <div className="input-group">
                                    <label>Date of Birth</label>
                                    <input type="date" name="dob" required onChange={handleChange} />
                                </div>
                                <div className="input-group">
                                    <label>Age</label>
                                    <input type="number" name="age" placeholder="25" required onChange={handleChange} />
                                </div>
                                <div className="input-group">
                                    <label>Gender</label>
                                    <select name="gender" required onChange={handleChange}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="input-group full-width">
                                    <label>Residential Address</label>
                                    <input type="text" name="address" placeholder="Flat, Street, Landmark, City" required onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Identity & Family</h3>
                            <div className="profile-grid">
                                <div className="input-group">
                                    <label>PAN Card Number</label>
                                    <input type="text" name="panNumber" placeholder="ABCDE1234F" required onChange={handleChange} />
                                </div>
                                <div className="input-group">
                                    <label>Aadhar Card Number</label>
                                    <input type="text" name="aadharNumber" placeholder="0000 0000 0000" required onChange={handleChange} />
                                </div>
                                <div className="input-group">
                                    <label>Father's Name</label>
                                    <input type="text" name="fatherName" placeholder="Full Name" required onChange={handleChange} />
                                </div>
                                <div className="input-group">
                                    <label>Mother's Name</label>
                                    <input type="text" name="motherName" placeholder="Full Name" required onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">Activate My Account</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ProfileForm;