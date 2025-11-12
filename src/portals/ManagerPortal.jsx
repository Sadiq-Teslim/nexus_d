// src/portals/ManagerPortal.jsx
import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, ShieldAlert, GitBranch, FileText, Settings } from 'lucide-react';
import { fetchTransactions } from '../services/mockApiService';
// import './ManagerPortal.css'; // For custom scrollbar styles

// --- The Main Operational Dashboard Component ---
const OperationalDashboard = ({ user }) => {
    const [transactions, setTransactions] = useState([]);
    const [streamedTransactions, setStreamedTransactions] = useState([]);
    const [kpiStats, setKpiStats] = useState({
        secured: 0,
        disruptions: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

    // Initial data fetch
    useEffect(() => {
        fetchTransactions().then(data => {
            setTransactions(data);
        });
    }, []);

    // The Real-Time Data Stream Simulation
    useEffect(() => {
        if (transactions.length > 0) {
            const interval = setInterval(() => {
                setStreamedTransactions(prevStream => {
                    const nextIndex = prevStream.length;
                    if (nextIndex < transactions.length) {
                        const nextTxn = transactions[nextIndex];
                        // If this transaction is part of the fraud network, update KPIs
                        if (nextTxn.is_fraud_network && nextTxn.status === "HIGH RISK") {
                           // In a real scenario, a "freeze" action would trigger this
                           // For now, we'll simulate it based on detection
                           setKpiStats(prevStats => ({
                               secured: prevStats.secured + nextTxn.amount,
                               disruptions: prevStats.disruptions + 1
                           }));
                        }
                        setCurrentPage(1);
                        return [nextTxn, ...prevStream]; // Add to the top
                    }
                    clearInterval(interval);
                    return prevStream;
                });
            }, 1500); // Stream a new transaction every 1.5 seconds

            return () => clearInterval(interval);
        }
    }, [transactions]);

    const totalPages = Math.max(1, Math.ceil(streamedTransactions.length / PAGE_SIZE));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedTransactions = streamedTransactions.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'HIGH RISK': return 'bg-yellow-500/10 text-yellow-400';
            case 'FROZEN': return 'bg-zenithRed/20 text-zenithRed';
            case 'AUTHORIZED HOLD': return 'bg-blue-500/20 text-blue-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="p-8 md:p-12">
            {/* Header */}
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-white">Operational Dashboard</h1>
                <p className="text-gray-400">Live monitoring for {user?.institution || "your institution"}. Welcome back, {user?.email || 'Manager'}.</p>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <KpiCard title="Total Funds Secured" value={`NGN ${kpiStats.secured.toLocaleString()}`} />
                <KpiCard title="Active Disruptions" value={kpiStats.disruptions} />
                <KpiCard title="AI False Positive Rate" value="0.12%" />
                <KpiCard title="Avg. Disruption Time" value="280ms" />
            </div>

            {/* Transaction Feed */}
            <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Real-Time Transaction Feed</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-white/10">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-400">Timestamp</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Source</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Destination</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Amount</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">GNN Score</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-sm text-gray-500">
                                        No transactions available yet. Streaming data will appear here.
                                    </td>
                                </tr>
                            ) : (
                                paginatedTransactions.map((txn) => (
                                    <tr key={txn.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-sm text-gray-300">{new Date(txn.timestamp).toLocaleTimeString()}</td>
                                        <td className="p-4 text-sm text-gray-300 font-mono">{txn.source}</td>
                                        <td className="p-4 text-sm text-gray-300 font-mono">{txn.destination}</td>
                                        <td className="p-4 text-sm text-gray-300 font-semibold">NGN {txn.amount.toLocaleString()}</td>
                                        <td className={`p-4 text-sm font-mono font-semibold ${txn.gnnScore > 0.9 ? 'text-zenithRed' : 'text-green-400'}`}>{txn.gnnScore.toFixed(2)}</td>
                                        <td className="p-4 text-xs font-semibold">
                                            <span className={`px-2 py-1 rounded-full ${getStatusClasses(txn.status)}`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs text-gray-500">
                        {streamedTransactions.length === 0
                            ? 'Awaiting live transaction data.'
                            : `Showing ${startIndex + 1}-${Math.min(endIndex, streamedTransactions.length)} of ${streamedTransactions.length} transactions`}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1 || streamedTransactions.length === 0}
                            className={`h-9 rounded-lg px-3 text-sm font-medium transition-colors ${
                                currentPage === 1 || streamedTransactions.length === 0
                                    ? 'cursor-not-allowed bg-white/5 text-gray-500'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                        >
                            Previous
                        </button>
                        <span className="text-xs text-gray-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || streamedTransactions.length === 0}
                            className={`h-9 rounded-lg px-3 text-sm font-medium transition-colors ${
                                currentPage === totalPages || streamedTransactions.length === 0
                                    ? 'cursor-not-allowed bg-white/5 text-gray-500'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable KPI Card Component
const KpiCard = ({ title, value }) => (
    <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-6 backdrop-blur-xl">
        <p className="text-sm text-gray-400 mb-2">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
    </div>
);


// --- The Main Portal Shell ---
const ManagerPortal = ({ user, onLogout }) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [activePage, setActivePage] = useState('dashboard'); // To manage which page is shown

    const renderPage = () => {
        switch(activePage) {
            case 'dashboard':
                return <OperationalDashboard user={user} />;
            // Add other cases here for 'disruptions', 'map', etc. later
            default:
                return <OperationalDashboard user={user} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200 font-sans overflow-hidden">
            {/* Sidebar */}
            <nav
                className={`flex flex-col bg-gray-900/80 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ease-in-out z-20 ${
                    isSidebarExpanded ? 'w-64' : 'w-20'
                }`}
                onMouseEnter={() => setIsSidebarExpanded(true)}
                onMouseLeave={() => setIsSidebarExpanded(false)}
            >
                <div className="flex items-center justify-center h-20 border-b border-white/10 shrink-0">
                     <span className={`text-2xl font-bold text-zenithRed transition-opacity duration-200 ${!isSidebarExpanded && 'scale-110'}`}>
                        ND
                    </span>
                            <span className={`text-xl font-bold text-white transition-all duration-200 whitespace-nowrap ml-2 ${isSidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                                Nexus Disrupt™
                    </span>
                </div>
                <ul className="flex-grow py-6 space-y-2">
                    <NavItem icon={<LayoutDashboard size={20} />} text="Dashboard" isExpanded={isSidebarExpanded} active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
                    <NavItem icon={<ShieldAlert size={20} />} text="Active Disruptions" isExpanded={isSidebarExpanded} active={activePage === 'disruptions'} onClick={() => setActivePage('disruptions')} />
                    <NavItem icon={<GitBranch size={20} />} text="Nexus Map" isExpanded={isSidebarExpanded} active={activePage === 'map'} onClick={() => setActivePage('map')} />
                    <NavItem icon={<FileText size={20} />} text="Audit Logs" isExpanded={isSidebarExpanded} active={activePage === 'logs'} onClick={() => setActivePage('logs')} />
                </ul>
                <div className="p-6 border-t border-white/10">
                    <NavItem icon={<Settings size={20} />} text="Settings" isExpanded={isSidebarExpanded} active={activePage === 'settings'} onClick={() => setActivePage('settings')} />
                    <button onClick={onLogout} className="w-full flex items-center h-12 px-4 mt-2 rounded-lg text-gray-400 hover:bg-zenithRed/20 hover:text-zenithRed transition-colors">
                        <LogOut size={20} />
                        <span className={`ml-4 text-sm font-medium transition-opacity whitespace-nowrap ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {renderPage()}
            </main>
        </div>
    );
};

// Reusable NavItem component with onClick handler
const NavItem = ({ icon, text, isExpanded, active = false, onClick }) => (
    <li>
        <button
            onClick={onClick}
            className={`w-full flex items-center h-12 mx-auto rounded-lg transition-colors duration-200 ${
                isExpanded ? 'px-4' : 'px-0 justify-center'
            } ${
                active 
                ? 'bg-zenithRed text-white shadow-lg shadow-zenithRed/30' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
        >
            <span className="shrink-0">{icon}</span>
            <span className={`text-sm font-medium transition-all whitespace-nowrap ml-4 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                {text}
            </span>
        </button>
    </li>
);

export default ManagerPortal;