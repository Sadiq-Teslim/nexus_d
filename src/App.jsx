// src/App.jsx
import React, { useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
// import AdminPortal from './portals/AdminPortal.jsx';
import ManagerPortal from './portals/ManagerPortal.jsx';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    const path = window.location.pathname;

    const handleAuthSuccess = (userData) => {
        if (!userData) {
            return;
        }
        setUserProfile(userData);
        setUserRole(userData.role || null);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserProfile(null);
        if (window.location.pathname !== '/') {
            window.history.replaceState(null, '', '/');
        }
    };

    // --- MAIN RENDER LOGIC ---
    if (isAuthenticated) {
        if (userRole === 'admin') {
            return (
                <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-4">
                    <h1 className="text-3xl font-semibold">Welcome Admin!</h1>
                    <p className="text-slate-300">{userProfile?.institution} is now onboarded. Explore your dashboard.</p>
                </div>
            );
        }
        if (userRole === 'manager') {
            return <ManagerPortal user={userProfile} onLogout={handleLogout} />;
        }
    }
    
    // If not authenticated, show public pages based on URL
    if (path === '/auth') {
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
    }

    // Default to the homepage
    return <HomePage />;
}

export default App;