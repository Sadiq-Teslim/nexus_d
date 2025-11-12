/* eslint-disable no-unused-vars */
// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { signUpInstitution, loginManager } from '../services/mockApiService';

const AuthPage = ({ onAuthSuccess = () => {} }) => {
    const [view, setView] = useState('signup');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('view') === 'signin') {
            setView('signin');
        }
    }, []);

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const formData = new FormData(e.target);
        const signupData = Object.fromEntries(formData.entries());

        try {
            const adminUser = await signUpInstitution(signupData);
            onAuthSuccess(adminUser);
            setIsLoading(false);
        } catch (err) {
            setError('Signup failed. Please try again.');
            setIsLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const formData = new FormData(e.target);
        const loginData = Object.fromEntries(formData.entries());

        try {
            const managerUser = await loginManager(loginData);
            onAuthSuccess(managerUser);
            setIsLoading(false);
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            setIsLoading(false);
        }
    };
    
    const LoadingBackdrop = ({ message }) => (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-lg">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-zenithRed"></div>
            <p className="mt-4 text-center text-white/80 font-semibold">{message}</p>
        </div>
    );

    const commonInputClasses = "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-zenithRed focus:bg-black/40 focus:outline-none focus:ring-4 focus:ring-zenithRed/20 disabled:opacity-50";
    const commonButtonClasses = "w-full rounded-full bg-zenithRed px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0204] via-[#1a060c] to-[#060205] font-sans text-white">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-zenithRed/30 blur-3xl"></div>
                <div className="absolute right-[-10%] top-10 h-96 w-96 rounded-full bg-[#e84750]/25 blur-3xl"></div>
                <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl"></div>
            </div>
            {isLoading && (
                <LoadingBackdrop
                    message={view === 'signup' ? 'Verifying & Provisioning Account...' : 'Authenticating Secure Session...'}
                />
            )}
            <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
                {/* Brand Panel */}
                <div className="relative hidden overflow-hidden rounded-r-[48px] border-r border-white/10 bg-white/5 backdrop-blur-xl lg:flex">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-[#1a060c]/40"></div>
                    <div className="absolute -right-20 top-10 h-56 w-56 rounded-full bg-zenithRed/30 blur-3xl"></div>
                    <div className="absolute left-12 bottom-10 h-72 w-72 rounded-full bg-[#ff8192]/25 blur-3xl"></div>
                    <div className="relative flex w-full flex-col justify-center gap-16 p-16">
                        <div className="space-y-6">
                            <span className="inline-flex items-center rounded-full border border-white/30 px-5 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-white">Nexus Disrupt™</span>
                            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">The Future of Financial Security.</h1>
                            <p className="max-w-md text-base text-white/70">
                                Real-time, autonomous fraud disruption for sovereign banks, digital-first institutions, and global treasury desks.
                            </p>
                        </div>
                        <div className="space-y-4 text-sm text-white/70">
                            <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-white"></span><p>Immutable audit trails meet the expectations of regulators and external auditors.</p></div>
                            <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-white"></span><p>Cross-institution intelligence feeds pinpoint emerging fraud rings before they mature.</p></div>
                        </div>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="flex items-center justify-center px-6 py-12 sm:px-12">
                    <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-black/60 p-10 shadow-[0_40px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                        <a href="/" className="block text-center text-4xl font-bold text-white sm:text-5xl">Nexus Disrupt™</a>

                        <div className="mt-8 flex rounded-full border border-white/10 bg-white/5 p-1">
                            <button onClick={() => setView('signup')} className={`w-1/2 rounded-full px-4 py-2 text-sm font-semibold transition ${view === 'signup' ? 'bg-zenithRed text-white shadow-lg shadow-zenithRed/30' : 'text-white/60'}`}>Onboard Institution</button>
                            <button onClick={() => setView('signin')} className={`w-1/2 rounded-full px-4 py-2 text-sm font-semibold transition ${view === 'signin' ? 'bg-zenithRed text-white shadow-lg shadow-zenithRed/30' : 'text-white/60'}`}>Manager Login</button>
                        </div>

                        {view === 'signup' ? (
                            <div className="mt-10">
                                <h2 className="text-3xl font-bold text-white">Create an Admin Account</h2>
                                <p className="mt-3 text-sm text-white/60">Begin the process to secure your institution.</p>
                                <form onSubmit={handleSignupSubmit} className="mt-8 space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Institution Name</label>
                                        <input name="bankName" type="text" placeholder="Premier Financial Bank" className={commonInputClasses} disabled={isLoading} required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Administrator Email</label>
                                        <input name="adminEmail" type="email" placeholder="j.doe@premierbank.com" className={commonInputClasses} disabled={isLoading} required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Password</label>
                                        <input name="password" type="password" placeholder="••••••••" className={commonInputClasses} disabled={isLoading} required />
                                    </div>
                                    <button type="submit" className={commonButtonClasses} disabled={isLoading}>
                                        {isLoading ? 'Verifying...' : 'Initiate Onboarding'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="mt-10">
                                <h2 className="text-3xl font-bold text-white">Manager Portal Access</h2>
                                <p className="mt-3 text-sm text-white/60">Welcome back. Please enter your credentials.</p>
                                <form onSubmit={handleLoginSubmit} className="mt-8 space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Email Address</label>
                                        <input name="email" type="email" placeholder="your.email@bank.com" className={commonInputClasses} disabled={isLoading} required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Password</label>
                                        <input name="password" type="password" placeholder="••••••••" className={commonInputClasses} disabled={isLoading} required />
                                    </div>
                                    <button type="submit" className={commonButtonClasses} disabled={isLoading}>
                                        {isLoading ? 'Authenticating...' : 'Secure Login'}
                                    </button>
                                </form>
                            </div>
                        )}
                         {error && <p className="mt-4 text-center text-sm text-zenithRed">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;