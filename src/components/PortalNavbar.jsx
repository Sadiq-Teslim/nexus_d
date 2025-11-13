// src/components/PortalNavbar.jsx
import React from 'react';
import { LogOut } from 'lucide-react';
import logo from '../assets/nobglogo.png';

const PortalNavbar = ({ user, onLogout, title }) => {
    return (
        <header className="flex h-20 items-center justify-between border-b border-white/10 px-6 md:px-10 ">
            <div className="flex items-center gap-3">
                <img src={logo} alt="Nexus Disrupt logo" className="h-10 w-10 rounded-full bg-white/90 object-cover shadow" />
                <h1 className="text-xl font-bold text-white">{title}</h1>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-white/70">{user?.email || 'user@email.com'}</span>
                <button 
                    onClick={onLogout} 
                    className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-zenithRed"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default PortalNavbar;