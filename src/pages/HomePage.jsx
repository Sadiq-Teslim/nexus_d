// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';

const HomePage = () => {
    useEffect(() => {
        const animatedElements = document.querySelectorAll('[data-animate]');
        if (!animatedElements.length) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    } else {
                        entry.target.classList.remove('is-visible');
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
        );

        animatedElements.forEach((element) => observer.observe(element));

        return () => {
            animatedElements.forEach((element) => observer.unobserve(element));
            observer.disconnect();
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0204] via-[#1a060c] to-[#060205] text-white">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-16 top-32 h-72 w-72 rounded-full bg-zenithRed/30 blur-3xl"></div>
                <div className="absolute right-[-10%] top-0 h-96 w-96 rounded-full bg-[#e84750]/25 blur-3xl"></div>
                <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl"></div>
            </div>

            <Navbar />

            <main className="relative z-10 pt-36">
                {/* Hero Section */}
                <section className="relative mx-auto max-w-6xl px-6 pb-24">
                    <div className="absolute inset-x-0 -top-10 flex justify-center" aria-hidden="true">
                        <div className="h-36 w-11/12 max-w-4xl rounded-full bg-gradient-to-r from-[#f1697b]/40 via-[#7c0d24]/60 to-[#4d0615]/70 blur-3xl"></div>
                    </div>

                    <div className="relative z-10 mx-auto max-w-4xl space-y-10 text-center" data-animate="slide-up">
                        <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-white/30 via-white/10 to-transparent px-6 py-2 text-xs font-semibold uppercase tracking-[0.5em] text-white/80 shadow-inner shadow-white/10">
                            Real-time Fraud Disruption
                        </div>
                        <div className="rounded-[32px] border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
                            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                                Stop Financial Crime Before It Starts
                            </h1>
                            <p className="mt-6 text-lg text-white/80 sm:text-xl">
                                Nexus Disrupt™ delivers autonomous monitoring, network analysis, and immediate freeze actions in one trusted platform. Protect customer funds with measurable certainty.
                            </p>
                            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" data-animate="fade">
                                <a
                                    href="/auth?view=signup"
                                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-white to-[#ffd7de] px-10 py-3 text-base font-semibold text-[#5f0b1c] shadow-xl shadow-[#ff7387]/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[#ff4d6a]/40"
                                    aria-label="Onboard your institution"
                                >
                                    Onboard Your Institution
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-10 py-3 text-base font-semibold text-white transition-all duration-500 hover:-translate-y-1 hover:border-white/60 hover:bg-white/15"
                                >
                                    Explore Capabilities
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-16" data-animate="scale-in">
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                                { label: 'Live Transactions', value: '1.2B+' },
                                { label: 'Freeze Execution', value: '< 90 ms' },
                                { label: 'False Positive Rate', value: '0.3%' },
                                { label: 'Audit Confidence', value: '99.97%' },
                            ].map(({ label, value }) => (
                                <div key={label} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/40 via-white/15 to-transparent p-[1px] shadow-lg shadow-black/40">
                                    <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-black/70 px-6 py-7 backdrop-blur-2xl transition-all duration-700 group-hover:-translate-y-1 group-hover:bg-black/50">
                                        <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-gradient-to-br from-[#ff5d7a]/60 to-transparent blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.6em] text-white/50">{label}</p>
                                        <p className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trust Signals */}
                <section className="mx-auto max-w-6xl px-6">
                    <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/10 px-6 py-8 text-center shadow-xl backdrop-blur-xl sm:flex-row" data-animate="fade">
                        <h2 className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">Trusted By Leading Institutions</h2>
                        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-white/80">
                            <span>Continental Alliance Bank</span>
                            <span>Union Equity Group</span>
                            <span>Zenith Trust Holdings</span>
                            <span>NovaCapital Africa</span>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
                    <div className="text-center" data-animate="slide-up">
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-zenithRed/90">Disruption Lifecycle</p>
                        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">A Formal, Controlled Response In Three Motions</h2>
                        <p className="mt-4 text-lg text-white/80 sm:mx-auto sm:max-w-3xl">
                            Anchored in compliance, woven through your operational fabric, and executed with the precision of Agentic AI.
                        </p>
                    </div>
                    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                step: '01',
                                title: 'Monitor & Detect',
                                description: 'Ingest real-time transaction streams, enrich with intelligence, and surface high-risk anomalies with zero operational drag.',
                                gradient: 'from-[#ff6781]/50 via-[#420818]/60 to-[#0f0307]/90',
                            },
                            {
                                step: '02',
                                title: 'Analyze & Predict',
                                description: 'Graph neural networks trace hidden relationships while our predictive scoring forecasts exit points with unparalleled certainty.',
                                gradient: 'from-[#ffd6df]/40 via-[#5f0b1c]/60 to-[#120206]/90',
                            },
                            {
                                step: '03',
                                title: 'Disrupt & Secure',
                                description: 'Automated Micro-Freeze actions lock accounts in milliseconds, preserving capital and documenting every step for regulators.',
                                gradient: 'from-[#ffc1d0]/50 via-[#7a1025]/60 to-[#1a0409]/90',
                            },
                        ].map(({ step, title, description, gradient }) => (
                            <div
                                key={step}
                                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-[1.5px] shadow-[0_30px_70px_-40px_rgba(255,102,128,0.7)]`}
                                data-animate="slide-up"
                            >
                                <div className="relative h-full rounded-[calc(1.5rem-1.5px)] bg-black/80 px-8 py-10 backdrop-blur-2xl transition-all duration-700 group-hover:-translate-y-2 group-hover:bg-black/60">
                                    <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                                        <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
                                        <div className="absolute left-6 bottom-6 h-24 w-24 rounded-full bg-zenithRed/30 blur-3xl" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-xl font-semibold text-white transition duration-500 group-hover:bg-white/30">
                                            {step}
                                        </span>
                                        <h3 className="text-xl font-semibold text-white transition-colors duration-500 group-hover:text-white">
                                            {title}
                                        </h3>
                                    </div>
                                    <p className="mt-6 text-base text-white/75 transition duration-500 group-hover:text-white">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Executive Brief */}
                <section className="mx-auto max-w-6xl px-6 pb-24">
                    <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                        <div className="space-y-6" data-animate="slide-right">
                            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-zenithRed/90">Executive Controls</p>
                            <h2 className="text-3xl font-bold sm:text-4xl">Governance-Led, Regulator Ready</h2>
                            <p className="text-lg text-white/80">
                                Nexus Disrupt™ underpins every intervention with immutable audit trails, board-ready dashboards, and clear escalation paths. Your teams gain surgical clarity, while stakeholders receive concise, defensible reporting.
                            </p>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur-xl transition-transform duration-700 hover:-translate-y-1 hover:border-white/30">
                                    <h3 className="text-base font-semibold text-white">Live Risk Command Center</h3>
                                    <p className="mt-2 text-sm text-white/75">Visualize institution-wide exposure, recent freezes, and pending investigator actions in a single secured view.</p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur-xl transition-transform duration-700 hover:-translate-y-1 hover:border-white/30">
                                    <h3 className="text-base font-semibold text-white">Compliance Confidence Kit</h3>
                                    <p className="mt-2 text-sm text-white/75">Export regulator-ready dossiers capturing evidence, timelines, and decision criteria across every disruption.</p>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/20 via-[#2f0d14]/60 to-[#120206]/80 p-[1.5px] shadow-2xl" data-animate="slide-left">
                            <div className="rounded-[calc(1.5rem-1.5px)] bg-black/75 p-8 backdrop-blur-xl transition-transform duration-700 hover:-translate-y-1">
                                <h3 className="text-lg font-semibold text-white">Executive Snapshot</h3>
                                <ul className="mt-6 space-y-5 text-sm text-white/75">
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-zenithRed"></span>
                                        <span>Autonomous interventions across core banking, cards, and treasury channels.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-zenithRed"></span>
                                        <span>Dynamic risk scoring tuned to your policies and continually refined with reinforcement learning.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-zenithRed"></span>
                                        <span>Continuous compliance alignment with Nigerian, UK, and US regulatory standards.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-zenithRed"></span>
                                        <span>Dedicated incident response specialists monitoring around the clock.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="mx-auto max-w-6xl px-6 pb-24 text-center">
                    <div data-animate="slide-up">
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-zenithRed/90">Partnership Packages</p>
                        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Fair, Transparent Engagements</h2>
                        <p className="mt-4 text-lg text-white/80 sm:mx-auto sm:max-w-3xl">
                            Select a tier that aligns with your transaction volumes and oversight complexity. Every plan includes onboarding support, dedicated success managers, and secure data residency.
                        </p>
                    </div>
                    <div className="mt-16 flex flex-col items-center gap-8 lg:flex-row lg:justify-center">
                        <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/20 via-white/5 to-transparent p-[1.5px] text-left shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:border-white/30" data-animate="scale-in">
                            <div className="h-full rounded-[calc(1.5rem-1.5px)] bg-black/75 p-10 backdrop-blur-xl">
                                <h3 className="text-2xl font-semibold text-white">Standard</h3>
                                <p className="mt-4 text-5xl font-bold text-white">50M<span className="text-lg font-medium text-white/60"> NGN/year</span></p>
                                <ul className="mt-8 space-y-4 text-sm text-white/75">
                                    <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-zenithRed"></span>Up to 10M Transactions Monthly</li>
                                    <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-zenithRed"></span>Core Fraud Network Detection</li>
                                    <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-zenithRed"></span>Standard Reporting Suite</li>
                                    <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-zenithRed"></span>Technical Support During Business Hours</li>
                                </ul>
                                <a href="/auth?view=signup" className="mt-10 block rounded-full border border-white/40 px-6 py-3 text-center font-semibold text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-white/20">
                                    Get Started
                                </a>
                            </div>
                        </div>
                        <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-zenithRed/60 bg-gradient-to-br from-[#ffbac9]/40 via-[#5f0b1c]/50 to-[#120206]/90 p-[1.5px] text-left shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:border-white/50" data-animate="scale-in">
                            <div className="h-full rounded-[calc(1.5rem-1.5px)] bg-black/70 p-10 backdrop-blur-xl">
                                <div className="mb-4 inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white">Most Popular</div>
                                <h3 className="text-2xl font-semibold text-white">Premier</h3>
                                <p className="mt-4 text-5xl font-bold text-white">250M<span className="text-lg font-medium text-white/60"> NGN/year</span></p>
                                <ul className="mt-8 space-y-4 text-sm text-white/75">
                                    <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-zenithRed"></span>50M+ Transactions Monthly</li>
                                    <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-zenithRed"></span>Advanced GNN &amp; Agentic AI Toolset</li>
                                    <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-zenithRed"></span>Immutable Audit Trails &amp; Analytics</li>
                                    <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-zenithRed"></span>Priority Access to Response Specialists</li>
                                </ul>
                                <a href="/auth?view=signup" className="mt-10 block rounded-full bg-white px-6 py-3 text-center font-semibold text-zenithRed transition-all duration-500 hover:scale-[1.05] hover:shadow-zenithRed/30">
                                    Choose Plan
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="px-6 pb-32">
                    <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-zenithRed/70 via-[#c31a23]/70 to-[#9f121a]/70 px-8 py-16 text-center shadow-2xl backdrop-blur-xl sm:flex-row sm:justify-between sm:text-left" data-animate="fade">
                        <div>
                            <h2 className="text-3xl font-bold">Ready to formalise a disruption mandate?</h2>
                            <p className="mt-4 max-w-xl text-white/85">Engage our team for a confidential walk-through tailored to your board, regulators, and senior risk officers.</p>
                        </div>
                        <a href="/auth?view=signup" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-zenithRed shadow-lg shadow-black/20 transition-all duration-500 hover:scale-[1.06] hover:shadow-zenithRed/20">
                            Request a Strategic Session
                        </a>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
                    <span>&copy; {new Date().getFullYear()} Nexus Disrupt™. All rights reserved.</span>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Security</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;