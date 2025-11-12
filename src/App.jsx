// src/App.jsx
import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
// import AdminPortal from './portals/AdminPortal.jsx';
import ManagerPortal from './portals/ManagerPortal.jsx';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        const handlePopState = () => {
            setCurrentPath(window.location.pathname);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        if (!isAuthenticated && currentPath === '/manager') {
            const redirectUrl = '/auth?view=signin';
            if (window.location.pathname !== '/auth') {
                window.history.replaceState(null, '', redirectUrl);
            }
            setCurrentPath('/auth');
        }
    }, [isAuthenticated, currentPath]);

    const handleAuthSuccess = (userData) => {
        if (!userData) {
            return;
        }
        setUserProfile(userData);
        const role = userData.role || null;
        setUserRole(role);
        setIsAuthenticated(true);

        if (role === 'manager') {
            if (window.location.pathname !== '/manager') {
                window.history.replaceState(null, '', '/manager');
            }
            setCurrentPath('/manager');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserProfile(null);
        if (window.location.pathname !== '/') {
            window.history.replaceState(null, '', '/');
        }
        setCurrentPath('/');
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
    if (currentPath === '/auth' || currentPath === '/manager') {
        return <AuthPage key={currentPath} onAuthSuccess={handleAuthSuccess} />;
    }

    // Default to the homepage
    return <HomePage />;
}

export default App;