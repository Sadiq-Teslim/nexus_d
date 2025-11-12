// src/components/PortalNavbar.jsx
import React from 'react';
import { LogOut } from 'lucide-react';

const PortalNavbar = ({ user, onLogout, title }) => {
    return (
        <header className="flex h-20 items-center justify-between border-b border-white/10 px-6 md:px-10 ">
            {/* Consistent text size (text-xl) */}
            <h1 className="text-xl font-bold text-white">{title}</h1>
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