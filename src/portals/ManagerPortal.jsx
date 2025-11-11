// src/portals/ManagerPortal.jsx
import React, { useState, useEffect } from 'react';
import './Portal.css'; // Re-using our shared portal styles
import { fetchTransactions } from '../services/mockApiService';

// --- Dashboard Component (The main view for today) ---
const OperationalDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [stream, setStream] = useState([]);

    useEffect(() => {
        // Fetch the initial batch of all 200 transactions
        fetchTransactions().then(data => {
            setTransactions(data);
        });
    }, []);

    useEffect(() => {
        // --- This is the MOCK Real-Time Data Stream ---
        if (transactions.length > 0) {
            const interval = setInterval(() => {
                // Add the next transaction from the full list to the live stream
                setStream(prevStream => {
                    const nextIndex = prevStream.length;
                    if (nextIndex < transactions.length) {
                        return [...prevStream, transactions[nextIndex]];
                    } else {
                        clearInterval(interval); // Stop when all transactions are streamed
                        return prevStream;
                    }
                });
            }, 2000); // New transaction every 2 seconds as per spec

            return () => clearInterval(interval); // Cleanup on component unmount
        }
    }, [transactions]);
    
    // Function to determine the row's highlight color
    const getRowClass = (txn) => {
        if (txn.status === 'FROZEN') return 'status-frozen';
        if (txn.gnnScore > 0.90) return 'status-high-risk';
        return '';
    };

    return (
        <div className="page-content">
            <h2>Operational Dashboard</h2>
            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="card kpi-card">
                    <h4>Total Funds Secured</h4>
                    <p className="kpi-value">N 0.00</p> 
                </div>
                <div className="card kpi-card">
                    <h4>Active Disruptions</h4>
                    <p className="kpi-value">0</p>
                </div>
                 <div className="card kpi-card">
                    <h4>AI False Positive Rate</h4>
                    <p className="kpi-value">0.12%</p>
                </div>
                <div className="card kpi-card">
                    <h4>Avg. Disruption Time</h4>
                    <p className="kpi-value">280ms</p>
                </div>
            </div>

            {/* Transaction Feed */}
            <div className="card data-table-card">
                <h3>Real-Time Transaction Feed</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Transaction ID</th>
                                <th>Source Account</th>
                                <th>Destination Account</th>
                                <th>Amount (NGN)</th>
                                <th>GNN Score</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stream.slice().reverse().map(txn => ( // Show newest first
                                <tr key={txn.id} className={getRowClass(txn)}>
                                    <td>{new Date(txn.timestamp).toLocaleTimeString()}</td>
                                    <td>{txn.id}</td>
                                    <td>{txn.source}</td>
                                    <td>{txn.destination}</td>
                                    <td>{txn.amount.toLocaleString()}</td>
                                    <td>{txn.gnnScore.toFixed(2)}</td>
                                    <td>{txn.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


const ManagerPortal = ({ onLogout }) => {
    const [activePage, setActivePage] = useState('dashboard');

    return (
        <div className="portal-layout">
            <nav className="sidebar">
                <div className="sidebar-header">
                    <h3>Nexus Disrupt</h3>
                    <p>Fraud Manager Portal</p>
                </div>
                <ul>
                    <li className={activePage === 'dashboard' ? 'active' : ''} onClick={() => setActivePage('dashboard')}>
                        Dashboard
                    </li>
                    {/* These will be enabled in the next steps */}
                    <li className="disabled">Active Disruptions</li>
                    <li className="disabled">Nexus Map Visualizer</li>
                    <li className="disabled">Audit & Compliance</li>
                </ul>
                <button className="logout-btn-sidebar" onClick={onLogout}>Logout</button>
            </nav>
            <main className="main-content">
                {/* For today, we only render the dashboard */}
                <OperationalDashboard />
            </main>
        </div>
    );
};

export default ManagerPortal;