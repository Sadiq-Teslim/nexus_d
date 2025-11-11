// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';

const AuthPage = () => {
    // 'signup' for Bank Onboarding, 'signin' for Manager Login
    const [view, setView] = useState('signup');

    // This effect allows linking directly to a specific view e.g. /auth?view=signin
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('view') === 'signin') {
            setView('signin');
        }
    }, []);

    const commonInputClasses = "w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-zenithRed focus:outline-none focus:ring-4 focus:ring-zenithRed/10";

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Brand Panel */}
                <div className="relative hidden overflow-hidden lg:block">
                    <div className="absolute inset-0 bg-gradient-to-br from-zenithRed via-[#c31a23] to-[#8f1018]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_55%)]"></div>
                    <div className="relative flex h-full flex-col justify-between p-16 text-white">
                        <div>
                            <span className="inline-flex items-center rounded-full border border-white/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]">Nexus Disrupt</span>
                            <h1 className="mt-8 text-4xl font-bold leading-tight">The Future of Financial Security.</h1>
                            <p className="mt-6 max-w-md text-base text-white/80">
                                Real-time, autonomous fraud disruption for sovereign banks, digital-first institutions, and global treasury desks.
                            </p>
                        </div>
                        <div className="space-y-4 text-sm text-white/80">
                            <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-white"></span>
                                <p>Immutable audit trails meet the expectations of regulators and external auditors.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-white"></span>
                                <p>Cross-institution intelligence feeds pinpoint emerging fraud rings before they mature.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="flex items-center justify-center px-6 py-12 sm:px-12">
                    <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
                        <a href="/" className="block text-center text-2xl font-bold text-zenithRed">Nexus Disrupt</a>

                        {/* View Toggler */}
                        <div className="mt-8 flex rounded-full bg-slate-100 p-1">
                            <button
                                onClick={() => setView('signup')}
                                className={`w-1/2 rounded-full px-4 py-2 text-sm font-semibold transition ${view === 'signup' ? 'bg-zenithRed text-white shadow-lg shadow-zenithRed/30' : 'text-slate-500'}`}
                            >
                                Onboard Institution
                            </button>
                            <button
                                onClick={() => setView('signin')}
                                className={`w-1/2 rounded-full px-4 py-2 text-sm font-semibold transition ${view === 'signin' ? 'bg-zenithRed text-white shadow-lg shadow-zenithRed/30' : 'text-slate-500'}`}
                            >
                                Manager Login
                            </button>
                        </div>

                        {/* Form switches based on view state */}
                        {view === 'signup' ? (
                            // Onboarding Form
                            <div className="mt-10">
                                <h2 className="text-3xl font-bold text-slate-900">Create an Admin Account</h2>
                                <p className="mt-3 text-sm text-slate-500">Begin the process to secure your institution.</p>
                                <form className="mt-8 space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Institution Name</label>
                                        <input type="text" placeholder="Premier Financial Bank" className={commonInputClasses} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Administrator Email</label>
                                        <input type="email" placeholder="j.doe@premierbank.com" className={commonInputClasses} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Password</label>
                                        <input type="password" placeholder="••••••••" className={commonInputClasses} />
                                    </div>
                                    <button type="submit" className="w-full rounded-full bg-zenithRed px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:brightness-110">
                                        Initiate Onboarding
                                    </button>
                                </form>
                            </div>
                        ) : (
                            // Manager Login Form
                            <div className="mt-10">
                                <h2 className="text-3xl font-bold text-slate-900">Manager Portal Access</h2>
                                <p className="mt-3 text-sm text-slate-500">Welcome back. Please enter your credentials.</p>
                                <form className="mt-8 space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Email Address</label>
                                        <input type="email" placeholder="your.email@bank.com" className={commonInputClasses} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Password</label>
                                        <input type="password" placeholder="••••••••" className={commonInputClasses} />
                                    </div>
                                    <button type="submit" className="w-full rounded-full bg-zenithRed px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:brightness-110">
                                        Secure Login
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;