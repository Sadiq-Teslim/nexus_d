// src/components/Navbar.jsx
import React from 'react';
import logo from '../assets/nobglogo.png';

const Navbar = () => {
    return (
        <header className="fixed top-0 left-0 z-50 w-full">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mt-4 flex items-center justify-between rounded-full border border-white/20 bg-white/10 px-4 py-3 text-white shadow-lg shadow-black/20 backdrop-blur-xl transition duration-500 hover:border-white/40">
                    <a href="/" className="flex items-center gap-3">
                        <img src={logo} alt="Nexus Disrupt logo" className="h-9 w-9 rounded-full bg-white/90 object-cover shadow" />
                        <span className="text-lg font-semibold tracking-wide text-white drop-shadow sm:text-xl">Nexus Disrupt™</span>
                    </a>
                    <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
                        <a href="#how-it-works" className="transition duration-300 hover:text-white">How It Works</a>
                        <a href="#pricing" className="transition duration-300 hover:text-white">Pricing</a>
                        <a href="#" className="transition duration-300 hover:text-white">About Us</a>
                    </nav>
                    <div className="hidden items-center md:flex">
                        <a href="/auth" className="rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/20">
                            Bank Login
                        </a>
                    </div>
                    <div className="md:hidden">
                        <a href="/auth" className="rounded-full border border-white/40 px-4 py-2 text-xs font-semibold text-white transition duration-300 hover:bg-white/20">
                            Login
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;