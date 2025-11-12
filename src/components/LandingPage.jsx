// src/components/LandingPage.jsx
import React, { useState } from 'react';
import './LandingPage.css';

const VettingSpinner = () => (
    <div className="vetting-overlay">
        <div className="spinner"></div>
        <p>Verifying institution credentials and policy templates...</p>
        <span className="spinner-sub">This secure scan typically takes 3-5 seconds.</span>
    </div>
    );

const stats = [
    { value: '72%', label: 'faster mule interdiction versus legacy rules' },
    { value: '45M+', label: 'payments observed daily across channels' },
    { value: '50ms', label: 'average decision latency per event' }
];

const featureHighlights = [
    {
        title: 'Graph Neural Intelligence',
        copy: 'Map, score, and prioritize mule pipelines using pre-trained network signals and device fingerprints.'
    },
    {
        title: 'Regulation-First Compliance',
        copy: 'Codifies CBN, NDIC, and NFIU directives so every decision ships with regulator-ready evidence.'
    },
    {
        title: 'Real-time Orchestration',
        copy: 'Trigger branch, digital, and contact centre workflows simultaneously before value leaves the institution.'
    },
    {
        title: 'Explainable Decisions',
        copy: 'Equip investigators with human-readable rationales and interactive graph trails for every blocked event.'
    }
];

const journeySteps = [
    {
        title: 'Discovery & blueprint',
        copy: 'Submit credentials, align objectives, and receive a tailored disruption roadmap for your channels.'
    },
    {
        title: 'Policy mirroring & tuning',
        copy: 'Mirror existing card, e-channel, and trade controls, then layer graph intelligence tuned to your risk appetite.'
    },
    {
        title: 'Hybrid go-live',
        copy: 'Launch alongside current FRA tools and graduate to autonomous mode once teams sign off on results.'
    }
];

const missionTiles = [
    {
        title: 'Humans stay in command',
        copy: 'Investigators review every flagged network with explainable evidence before authorizing holds or releases.'
    },
    {
        title: 'Pan-African coverage',
        copy: 'Extend protection to diaspora corridors with continuous intelligence feeds across twelve geographies.'
    },
    {
        title: 'Operational resilience',
        copy: 'Automate escalations, sign-offs, and playbook execution so teams respond decisively in every corridor.'
    }
];

const assuranceBadges = ['CBN Sandbox Ready', 'SOC 2 Type II', 'ISO 27001', 'Immutable Audit Trails'];

const LandingPage = ({ onSignupSuccess }) => {
    const [isVetting, setIsVetting] = useState(false);

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        setIsVetting(true);
        setTimeout(() => {
            setIsVetting(false);
            onSignupSuccess('admin');
        }, 5000);
    };

    return (
        <div className="landing-page" id="top">
            {isVetting && <VettingSpinner />}

            <header className="hero">
                <div className="hero-inner">
                    <div className="hero-copy">
                        <span className="hero-badge">Enterprise SaaS · Nexus Disrupt™</span>
                        <h1>
                            Disrupt <span>money-mule fraud</span> before it settles
                        </h1>
                        <p className="hero-subtitle">
                            Launch a SaaS disruption fabric that intercepts organized mule rings the moment they mobilize. Graph
                            intelligence, agentic micro-freezes, and human control combine to protect customer confidence.
                        </p>
                        <ul className="hero-stats">
                            {stats.map((stat) => (
                                <li key={stat.label}>
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="hero-trust">
                            <span className="trust-label">Battle-tested with African risk, compliance, and fraud command teams</span>
                            <div className="trust-pills">
                                <span>Tier-1 Banks</span>
                                <span>EMI Providers</span>
                                <span>Digital Lenders</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-form">
                        <div className="form-card">
                            <div className="form-header">
                                <span className="form-eyebrow">Enterprise access request</span>
                                <h2>Request your protected pilot workspace</h2>
                                <p className="form-subcopy">
                                    Share compliance-ready details to spin up the sandbox, sync controls, and rehearse the
                                    disruption loop with your internal stakeholders.
                                </p>
                            </div>
                            <form onSubmit={handleSignupSubmit}>
                                <label htmlFor="bankName">Institution or business unit</label>
                                <input id="bankName" type="text" placeholder="e.g. Retail Payments Command" required />

                                <label htmlFor="adminEmail">Official work email</label>
                                <input id="adminEmail" type="email" placeholder="firstname.lastname@yourbank.com" required />

                                <label htmlFor="regulatorId">Compliance reference code</label>
                                <input id="regulatorId" type="text" placeholder="Enter internal case or ticket ID" required />

                                <button type="submit" className="submit-button">Activate pilot environment</button>
                            </form>
                            <div className="form-assurance">
                                {assuranceBadges.map((badge) => (
                                    <span key={badge}>{badge}</span>
                                ))}
                            </div>
                            <p className="form-footnote">
                                Already onboarded? <a href="/login">Launch the fraud control center</a>
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <section className="feature-section">
                <div className="section-inner">
                    <div className="section-heading">
                        <span className="section-eyebrow">Platform strengths</span>
                        <h2>Purpose-built for enterprise fraud command centers</h2>
                        <p>
                            From POS to mobile to trade finance, Nexus Disrupt™ aligns with governance, incident playbooks,
                            and cross-channel visibility so every team works off the same truth.
                        </p>
                    </div>
                    <div className="feature-grid">
                        {featureHighlights.map((feature) => (
                            <article key={feature.title} className="feature-card">
                                <span className="feature-icon" aria-hidden="true"></span>
                                <h3>{feature.title}</h3>
                                <p>{feature.copy}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="journey-section">
                <div className="journey-inner">
                    <div className="journey-card">
                        <span className="section-eyebrow">Go-live journey</span>
                        <h2>From discovery workshop to nationwide deployment</h2>
                        <ol className="journey-list">
                            {journeySteps.map((step) => (
                                <li key={step.title}>
                                    <h4>{step.title}</h4>
                                    <p>{step.copy}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <aside className="journey-aside">
                        <div className="journey-highlight">360° disruption loop</div>
                        <p>
                            Unite fraud operations, IT integration, and compliance review in one command fabric with
                            adaptive policies and regulator-grade reporting.
                        </p>
                        <ul className="journey-points">
                            <li>Admin workflow provisions access, documentation, and API credentials on day one.</li>
                            <li>Fraud managers monitor live streams, review GNN visual evidence, and approve holds.</li>
                            <li>Compliance teams export audit trails to satisfy regional supervisory requirements.</li>
                        </ul>
                    </aside>
                </div>
            </section>

            <section className="mission-section">
                <div className="mission-inner">
                    <div className="mission-copy">
                        <span className="section-eyebrow">Impact</span>
                        <h2>Safeguard customer trust across every payment corridor</h2>
                        <p>
                            The Nexus Disrupt™ agentic loop counters organized mule rings by combining autonomous action
                            with human oversight. Every corridor, from retail transfers to corporate deals, benefits from
                            faster detection and decisive response.
                        </p>
                        <div className="mission-grid">
                            {missionTiles.map((tile) => (
                                <article key={tile.title}>
                                    <h3>{tile.title}</h3>
                                    <p>{tile.copy}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                    <div className="mission-panel">
                        <div className="mission-badge">Operational readiness kit</div>
                        <h3>Daily fraud intelligence drops</h3>
                        <p>
                            Receive compressed updates, synthetic attack drills, and readiness scores delivered straight
                            to stakeholders so everyone stays ahead of evolving threats.
                        </p>
                        <ul>
                            <li>Executive-ready dashboards tailored to enterprise fraud KPIs.</li>
                            <li>Secure Slack &amp; Teams channels with Nexus risk engineers.</li>
                            <li>24/7 command support to sustain operational continuity.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-inner">
                    <div className="cta-copy">
                        <span className="cta-eyebrow">Next step</span>
                        <h2>Champion a fraud-free future today</h2>
                        <p>
                            Submit your pilot request, align stakeholders, and deploy the agentic SaaS built to neutralise
                            mule networks at scale.
                        </p>
                    </div>
                    <a className="cta-button" href="#top" onClick={(e) => e.preventDefault()}>
                        Begin pilot request
                    </a>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;