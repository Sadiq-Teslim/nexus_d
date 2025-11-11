// src/components/ManagerLoginPage.jsx
import React from 'react';
import './ManagerLoginPage.css'; // We'll create a dedicated CSS file

const ManagerLoginPage = ({ onLoginSuccess }) => {
    
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // Here we log in the user with the 'manager' role
        onLoginSuccess('manager');
    };

    return (
        <div className="manager-login-container">
            <div className="login-card">
                <h2>Nexus Disrupt</h2>
                <p className="login-subtitle">Fraud Manager Portal</p>
                <form onSubmit={handleLoginSubmit}>
                    <div className="input-group">
                        <label htmlFor="managerEmail">Email</label>
                        <input id="managerEmail" type="email" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="managerPassword">Password</label>
                        <input id="managerPassword" type="password" required />
                    </div>
                    <button type="submit" className="login-btn">Secure Login</button>
                </form>
                 <div className="onboarding-redirect">
                    <p>Is your institution not signed up? <a href="/">Onboard Here</a></p>
                </div>
            </div>
        </div>
    );
};

export default ManagerLoginPage;