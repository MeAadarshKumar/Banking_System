import React, { useState } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import ProfileForm from './ProfileForm';
import '../styles/AuthPage.css';

const AuthPage = () => {
    const [isActive, setIsActive] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null); 
    const [userData, setUserData] = useState(null); 
    const [isProfileComplete, setIsProfileComplete] = useState(false);

    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                email: formData.email,
                password: formData.password
            });

            // Extract the 'user' object from the nested Map response
            const { role, user, email } = response.data;
            
            if (role === "INCOMPLETE") {
                setUserData({ email: email });
                setUserRole(role);
                setIsLoggedIn(true);
            } else {
                setUserData(user); 
                setUserRole(role);
                setIsLoggedIn(true);
                setIsProfileComplete(true);
            }
        } catch (error) {
            alert(error.response?.data?.error || "Login Failed");
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            alert(response.data.message);
            setIsActive(false); 
        } catch (error) {
            alert(error.response?.data?.message || "Registration Failed");
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserRole(null);
        setUserData(null);
        setIsProfileComplete(false);
        setFormData({ name: '', email: '', password: '' });
    };

    if (isLoggedIn && userData) {
        if (userRole === "INCOMPLETE") {
            return <ProfileForm email={userData.email} onComplete={() => window.location.reload()} />;
        }
        
        return userRole === "ADMIN" ? 
            <AdminDashboard onLogout={handleLogout} user={userData} /> : 
            <UserDashboard onLogout={handleLogout} user={userData} />;
    }

    return (
        <div className="auth-screen-wrapper">
            <div className={`container ${isActive ? "active" : ""}`} id="container">
                <div className="form-container sign-up">
                    <form onSubmit={handleSignUp}>
                        <h1>Create Account</h1>
                        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                        <button type="submit">Sign Up</button>
                    </form>
                </div>
                <div className="form-container sign-in">
                    <form onSubmit={handleSignIn}>
                        <h1>Sign In</h1>
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        <button type="submit">Sign In</button>
                    </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <button className="hidden" onClick={() => setIsActive(false)}>Sign In</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <button className="hidden" onClick={() => setIsActive(true)}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;