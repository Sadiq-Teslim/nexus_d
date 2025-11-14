// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { X, Phone, Mail, MessageCircle } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const whatsappNumber = "2348028948372";
    const whatsappMessage = "Hello, I'd like to schedule a call to discuss Nexus Disrupt™ for my institution.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={onClose}>
            <div className="relative w-full max-w-4xl rounded-3xl border-2 border-zenithRed/60 bg-gradient-to-br from-[#ffbac9]/20 via-[#5f0b1c]/50 to-[#120206]/90 p-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="rounded-[calc(1.5rem-2px)] bg-black/90 p-8 lg:p-12 backdrop-blur-xl">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-white mb-4">Get In Touch With Us</h2>
                        <p className="text-lg text-white/70">Schedule a call to discuss enterprise licensing or onboarding your institution</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-zenithRed/20 p-3">
                                    <Phone className="text-zenithRed" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
                                    <a href="tel:08028948372" className="text-2xl font-bold text-zenithRed hover:text-white transition-colors">
                                        08028948372
                                    </a>
                                    <p className="text-sm text-white/60 mt-1">Mon - Fri, 9AM - 6PM WAT</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-zenithRed/20 p-3">
                                    <Mail className="text-zenithRed" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                                    <a href="mailto:support@nexusdisrupt.com" className="text-lg text-white/85 hover:text-zenithRed transition-colors">
                                        support@nexusdisrupt.com
                                    </a>
                                    <p className="text-sm text-white/60 mt-1">Average response: 2 hours</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center">
                            <div className="rounded-2xl border-2 border-zenithRed/40 bg-gradient-to-br from-zenithRed/10 to-transparent p-6">
                                <MessageCircle className="text-zenithRed mx-auto mb-4" size={48} />
                                <h3 className="text-xl font-semibold text-white text-center mb-4">Quick Response</h3>
                                <p className="text-sm text-white/70 text-center mb-6">
                                    Chat with us on WhatsApp for immediate assistance
                                </p>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-green-500/50"
                                >
                                    SCHEDULE A CALL WITH US
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8">
                        <p className="text-center text-white/60 text-sm">
                            Our team is ready to help you secure your institution with Nexus Disrupt™
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HomePage = () => {
    const [showContactModal, setShowContactModal] = useState(false);
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
                                <button
                                    onClick={() => setShowContactModal(true)}
                                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-white to-[#ffd7de] px-10 py-3 text-base font-semibold text-[#5f0b1c] shadow-xl shadow-[#ff7387]/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[#ff4d6a]/40"
                                    aria-label="Onboard your institution"
                                >
                                    Onboard Your Institution
                                </button>
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

                {/* Pricing Section (Updated: Replaced <b> with font-bold class) */}
                <section id="pricing" className="mx-auto max-w-6xl px-6 pb-24 text-center">
                    <div data-animate="slide-up">
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-zenithRed/90">Enterprise Licensing</p>
                        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Predictable Cost, Unlimited Oversight</h2>
                        <p className="mt-4 text-lg text-white/80 sm:mx-auto sm:max-w-3xl">
                            Secure an annual license for <span className="font-bold">unlimited access</span> to our entire fraud detection platform, regardless of your transaction volume. Focus on growth, not capacity constraints.
                        </p>
                    </div>

                    {/* Single, Larger License Block */}
                    <div className="mt-16 flex justify-center">
                        <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-zenithRed/60 bg-gradient-to-br from-[#ffbac9]/40 via-[#5f0b1c]/50 to-[#120206]/90 p-2 text-left shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:border-white/50" data-animate="scale-in">
                            <div className="h-full rounded-[calc(1.5rem-1px)] bg-black/70 p-12 lg:p-16 backdrop-blur-xl relative z-10">

                                {/* Subtle background glow/overlay for aesthetic */}
                                {/* <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,186,201,0.2) 0%, transparent 70%)' }}></div> */}

                                <div className="relative z-10">
                                    <h3 className="text-3xl font-bold text-white mb-2">Annual Enterprise License</h3>
                                    <p className="text-lg text-white/70">The ultimate solution for comprehensive fraud protection.</p>

                                    {/* Price Update */}
                                    <p className="mt-8 text-6xl font-bold text-white">10M<span className="text-xl font-medium text-white/60"> NGN/year</span></p>

                                    {/* Feature Update: Using <span className="font-bold"> now */}
                                    <ul className="mt-10 space-y-5 text-base text-white/85">
                                        <li className="flex items-center gap-4"><span className="h-3 w-3 rounded-full bg-zenithRed flex-shrink-0"></span><span className="font-bold">Unlimited</span>Transaction Volume & Scalability</li>
                                        <li className="flex items-center gap-4"><span className="h-3 w-3 rounded-full bg-zenithRed flex-shrink-0"></span>Comprehensive Access to<span className="font-bold">All</span>GNN & Agentic AI Tools</li>
                                        <li className="flex items-center gap-4"><span className="h-3 w-3 rounded-full bg-zenithRed flex-shrink-0"></span>Robust Immutable Audit Trails & Advanced Analytics</li>
                                        <li className="flex items-center gap-4"><span className="h-3 w-3 rounded-full bg-zenithRed flex-shrink-0"></span>Dedicated 24/7 Priority Technical Support</li>
                                        <li className="flex items-center gap-4"><span className="h-3 w-3 rounded-full bg-zenithRed flex-shrink-0"></span>Personalized Onboarding & Strategic Success Manager</li>
                                    </ul>

                                    <button
                                        onClick={() => setShowContactModal(true)}
                                        className="mt-12 block w-full rounded-full bg-gradient-to-r from-zenithRed to-red-600 px-8 py-4 text-center text-lg font-semibold text-white shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-zenithRed/50 focus:outline-none focus:ring-2 focus:ring-zenithRed focus:ring-opacity-75"
                                    >
                                        Secure Your Enterprise License
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                {/* <section className="px-6 pb-32">
                    <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-zenithRed/70 via-[#c31a23]/70 to-[#9f121a]/70 px-8 py-16 text-center shadow-2xl backdrop-blur-xl sm:flex-row sm:justify-between sm:text-left" data-animate="fade">
                        <div>
                            <h2 className="text-3xl font-bold">Ready to formalise a disruption mandate?</h2>
                            <p className="mt-4 max-w-xl text-white/85">Engage our team for a confidential walk-through tailored to your board, regulators, and senior risk officers.</p>
                        </div>
                        <a href="/auth?view=signup" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-zenithRed shadow-lg shadow-black/20 transition-all duration-500 hover:scale-[1.06] hover:shadow-zenithRed/20">
                            Request a Strategic Session
                        </a>
                    </div>
                </section> */}

                {/* Contact Us Section */}
{/* Contact Us Section - Full Page Viewport */}
<section id="contact" className="w-full min-h-screen flex flex-col justify-center items-center px-6 py-24 bg-black"> {/* Added w-full, min-h-screen, flex centering, and background */}
    
    {/* Header */}
    <div data-animate="slide-up" className="text-center mb-12 max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-zenithRed/90">Get In Touch</p>
        <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">We're Ready to Help Your Institution</h2>
        <p className="mt-4 text-xl text-white/80">
            Have questions about enterprise licensing or technical integration? Contact our dedicated support team.
        </p>
    </div>
    
    {/* Contact Card Container - Increased size for full-page presence */}
    <div className="flex justify-center w-full max-w-6xl"> {/* Increased max-w for a very wide card */}
        <div className="w-full overflow-hidden rounded-3xl border border-zenithRed/60 bg-gradient-to-br from-[#ffbac9]/40 via-[#5f0b1c]/50 to-[#120206]/90 p-3 text-left shadow-2xl" data-animate="slide-up"> {/* Increased outer padding p-3 */}
            <div className="h-full rounded-[calc(1.5rem-2px)] bg-black/70 p-16 lg:p-20 backdrop-blur-xl relative z-10"> {/* Increased inner padding */}
                
                {/* Subtle background glow/overlay for aesthetic */}
                {/* <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,186,201,0.2) 0%, transparent 70%)' }}></div> */}

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16"> {/* Increased gap */}
                    
                    {/* Left Column: Contact Info */}
                    <div>
                        <h3 className="text-4xl font-bold text-white mb-8">Contact Details</h3> {/* Larger header */}
                        
                        <div className="space-y-10 text-white/85"> {/* Increased space-y */}
                            {/* Phone Number */}
                            <div className="flex items-start">
                                <svg className="w-8 h-8 text-zenithRed mr-5 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                <div>
                                    <p className="text-xl font-bold text-white">Direct Line</p>
                                    <p className="text-3xl tracking-wider text-zenithRed font-semibold mt-2"> {/* Largest text for phone number */}
                                        <a href="tel:08028948372" className="hover:text-white transition-colors duration-300">08028948372</a>
                                    </p>
                                    <p className="text-base text-white/60 mt-2">Available during business hours (Mon - Fri)</p>
                                </div>
                            </div>

                            {/* Email Placeholder */}
                            <div className="flex items-start">
                                <svg className="w-8 h-8 text-zenithRed mr-5 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2-3a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V5z"></path></svg>
                                <div>
                                    <p className="text-xl font-bold text-white">Email Support</p>
                                    <p className="text-xl mt-2"><a href="mailto:support@nexusdisrupt.com" className="text-white/85 hover:text-zenithRed transition-colors duration-300">support@nexusdisrupt.com</a></p>
                                    <p className="text-base text-white/60 mt-2">Average response time: 2 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:border-l lg:border-white/10 lg:pl-16"> {/* Increased pl-16 */}
                        <h3 className="text-4xl font-bold text-white mb-8">Send Us a Message</h3> {/* Larger header */}

                        <form className="space-y-6"> {/* Increased space-y */}
                            {/* Input: Name */}
                            <input 
                                type="text" 
                                placeholder="Your Full Name / Institution" 
                                className="w-full p-4 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-zenithRed transition-colors" 
                            />
                            
                            {/* Input: Email */}
                            <input 
                                type="email" 
                                placeholder="Work Email" 
                                className="w-full p-4 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-zenithRed transition-colors" 
                            />

                            {/* Textarea: Message */}
                            <textarea 
                                placeholder="How can we assist you?" 
                                rows="5" 
                                className="w-full p-4 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-zenithRed transition-colors" 
                            ></textarea>

                            {/* Submit Button */}
                            <button 
                                type="submit"
                                className="mt-6 block w-full rounded-full bg-gradient-to-r from-zenithRed to-red-600 px-8 py-4 text-center text-xl font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-zenithRed/50 focus:outline-none focus:ring-2 focus:ring-zenithRed focus:ring-opacity-75"
                            >
                                Submit Inquiry
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
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

            <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
        </div>
    );
};

export default HomePage;