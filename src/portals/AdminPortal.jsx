// src/portals/AdminPortal.jsx
import React, { useState } from 'react';
import './Portal.css'; // We'll create a single, shared CSS file for both portals

// --- Sub-components for each page ---
const AdminDashboard = () => (
    <div className="page-content">
        <h2>Admin Dashboard</h2>
        <div className="card">
            <h3>Integration Status</h3>
            <p className="status-pending">Awaiting Activation</p>
            <p>Once your developers integrate our API, this status will update to 'Active'.</p>
        </div>
    </div>
);

const UserManagement = () => (
    <div className="page-content">
        <h2>User Management</h2>
        <div className="card">
            <h3>Provision New User</h3>
            <p>Create an account for a Fraud Manager to grant them access to the operational portal.</p>
            <form className="user-form">
                <input type="email" placeholder="Fraud Manager's Email" required />
                <button type="submit" className="action-btn">Create User & Send Invite</button>
            </form>
        </div>
    </div>
);

const ApiDocs = () => (
    <div className="page-content">
        <h2>API Documentation</h2>
        <div className="card">
            <h3>Integration Endpoints</h3>
            <p>Provide these details to your development team to complete the integration.</p>
            <div className="api-doc-section">
                <h4>1. Real-Time Transaction Stream (Inbound)</h4>
                <p>Secure WebSocket endpoint for pushing transaction data.</p>
                <code className="code-block">wss://api.nexusdisrupt.com/v1/stream</code>
            </div>
            <div className="api-doc-section">
                <h4>2. Micro-Freeze Command (Outbound)</h4>
                <p>Our Agentic AI calls this endpoint to execute a real-time fund freeze.</p>
                <code className="code-block">POST /api/your-bank/v1/freeze</code>
            </div>
            <div className="api-doc-section">
                <h4>3. Audit Log Confirmation (In/Out)</h4>
                <p>Endpoint for logging every action for regulatory compliance.</p>
                <code className="code-block">POST /api/nexusdisrupt.com/v1/audit</code>
            </div>
        </div>
    </div>
);


const AdminPortal = ({ onLogout }) => {
    const [activePage, setActivePage] = useState('dashboard');

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'users':
                return <UserManagement />;
            case 'api':
                return <ApiDocs />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <div className="portal-layout">
            <nav className="sidebar">
                <div className="sidebar-header">
                    <h3>Nexus Disrupt™</h3>
                    <p>Administrator Portal</p>
                </div>
                <ul>
                    <li className={activePage === 'dashboard' ? 'active' : ''} onClick={() => setActivePage('dashboard')}>
                        Dashboard
                    </li>
                    <li className={activePage === 'users' ? 'active' : ''} onClick={() => setActivePage('users')}>
                        User Management
                    </li>
                    <li className={activePage === 'api' ? 'active' : ''} onClick={() => setActivePage('api')}>
                        API Docs
                    </li>
                </ul>
                <button className="logout-btn-sidebar" onClick={onLogout}>Logout</button>
            </nav>
            <main className="main-content">
                {renderPage()}
            </main>
        </div>
    );
};

export default AdminPortal;