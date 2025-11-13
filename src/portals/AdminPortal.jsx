// src/portals/AdminPortal.jsx
import React, { useState, useMemo } from "react";
import { Plus, Trash2, Key, Cpu, LayoutDashboard, Users, FileText, Settings, LogOut, Wallet, TrendingUp, Zap, X, ShieldCheck, Copy, Eye, EyeOff } from "lucide-react";

// --- MOCK HOOKS & CONSTANTS ---
const useAuth = () => ({ user: { email: 'admin@premierbank.com' } }); // Mock user hook
const NGN_FORMAT = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 });

// --- REUSABLE UI COMPONENTS ---

const PortalNavbar = ({ title, user, onLogout }) => (
    <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md md:px-10">
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">{user}</span>
            <button onClick={onLogout} className="rounded-full p-2 text-slate-500 transition-colors hover:bg-red-100 hover:text-red-600">
                <LogOut size={20} />
            </button>
        </div>
    </header>
);

const KpiCard = ({ title, value, subtitle, icon: Icon, colorClass = "text-slate-900" }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
        <div className="flex items-start justify-between">
            <p className="mb-2 text-sm font-medium text-slate-500">{title}</p>
            {Icon && <Icon size={20} className={colorClass} />}
        </div>
        <div className="flex items-baseline gap-3">
            <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
    </div>
);

const NavItem = ({ icon, text, isExpanded, active, onClick }) => (
    <li>
        <button onClick={onClick} className={`mx-auto flex h-12 w-full items-center rounded-lg transition-colors duration-200 ${isExpanded ? "px-4" : "justify-center px-0"} ${active ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`}>
            <span className="shrink-0">{icon}</span>
            <span className={`ml-4 text-sm font-medium transition-all duration-200 ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}>{text}</span>
        </button>
    </li>
);

// --- MODAL COMPONENTS ---

const AddUserModal = ({ onAddUser, onClose }) => {
    const [form, setForm] = useState({ name: "", email: "", role: "Fraud Manager" });
    const handleSubmit = (e) => { e.preventDefault(); onAddUser({ id: `mgr-${Date.now()}`, ...form }); onClose(); };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-slate-200 pb-4"><h3 className="text-2xl font-bold text-slate-900">Provision New Manager</h3><button onClick={onClose} className="text-slate-400 hover:text-red-600"><X size={24} /></button></div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div><label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label><input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Adebayo Tunde" className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20" required /></div>
                    <div><label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label><input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} placeholder="name@bank.com" type="email" className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20" required /></div>
                    <div><label className="mb-1 block text-sm font-medium text-slate-700">Role</label><select value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"><option>Fraud Manager</option><option>Lead Analyst</option><option>Compliance Officer</option></select></div>
                    <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="rounded-full px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"><Plus size={16} />Grant Access</button></div>
                </form>
            </div>
        </div>
    );
};

// --- PAGES ---

const AdminDashboard = () => {
    const currentCredits = 28500;
    const dailyConsumption = 1800;
    const estimatedDays = Math.floor(currentCredits / dailyConsumption);
    const kpis = [ { title: "Current Credit Balance", value: `${currentCredits.toLocaleString()}`, subtitle: "Credits", icon: Wallet, colorClass: "text-red-600" }, { title: "Est. Days Remaining", value: `${estimatedDays}`, subtitle: "Before Refill", icon: TrendingUp }, { title: "GNN Usage (24h)", value: `${dailyConsumption.toLocaleString()}`, subtitle: "Credits", icon: Zap }, { title: "Integration Status", value: "LIVE", subtitle: "Stream Active", icon: Cpu, colorClass: "text-green-600" }];
    const consumptionData = [{ day: 'Mon', consumed: 500, secured: 20000000 }, { day: 'Tue', consumed: 1200, secured: 45000000 }, { day: 'Wed', consumed: 1800, secured: 60000000 }, { day: 'Thu', consumed: 900, secured: 30000000 }, { day: 'Fri', consumed: 2500, secured: 85000000 }];
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">Administrator Dashboard</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{kpis.map((k, index) => <KpiCard key={index} {...k} />)}</div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800">GNN Consumption vs. Value Secured (Last 5 Days)</h3>
                <p className="text-sm text-slate-500 mb-6">Visual proof of ROI: High credit consumption correlates directly with high NGN value secured from fraud.</p>
                <div className="h-64 flex justify-around items-end p-2 bg-slate-50 rounded-lg border border-slate-200">
                    {consumptionData.map((data, index) => (
                        <div key={index} className="flex items-end h-full w-1/5 justify-center gap-2 group">
                            <div className="flex flex-col items-center">
                                <div className="w-6 bg-red-200 rounded-t-lg transition-all duration-300 group-hover:bg-red-400" style={{ height: `${(data.consumed / 3000) * 100}%` }} title={`Consumed: ${data.consumed} Credits`}></div>
                                <span className="text-xs text-slate-500 mt-2">{data.day}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-6 bg-blue-200 rounded-t-lg transition-all duration-300 group-hover:bg-blue-400" style={{ height: `${(data.secured / 100000000) * 100}%` }} title={`Secured: ${NGN_FORMAT.format(data.secured)}`}></div>
                                <span className="text-xs text-slate-500 mt-2">{data.day}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-6 mt-4 text-xs font-medium"><span className="flex items-center text-red-600"><div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>Credits Consumed</span><span className="flex items-center text-blue-500"><div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>Value Secured (NGN)</span></div>
            </div>
        </div>
    );
};

const BillingPage = () => {
    const plans = [{ name: "Standard", price: 5000000, credits: 15000, roi: "4X ROI", color: "border-slate-400" }, { name: "Premier", price: 10000000, credits: 35000, roi: "6X ROI", color: "border-blue-500" }, { name: "Enterprise", price: 25000000, credits: 100000, roi: "11X ROI", color: "border-red-600" }];
    const currentCredits = 28500;
    const creditHistory = [{ date: "2025-10-01", transaction: "Premier Plan Purchase", amount: NGN_FORMAT.format(10000000), credits: "+35,000" }, { date: "2025-11-01", transaction: "GNN Usage - Auto Debit", amount: "N/A", credits: "-1,500" }, { date: "2025-11-02", transaction: "GNN Usage - Auto Debit", amount: "N/A", credits: "-820" }, { date: "2025-11-03", transaction: "GNN Usage - Auto Debit", amount: "N/A", credits: "-940" }];
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">Billing & API Credit Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Current Credit Balance" value={`${currentCredits.toLocaleString()}`} subtitle={`Value: ${NGN_FORMAT.format(28500 * (25000000/100000))}`} icon={Wallet} colorClass="text-red-600" />
                <KpiCard title="Credits Consumed MTD" value="12,500" subtitle="Transactions Analyzed" icon={Zap} />
                <KpiCard title="Billing Cycle Status" value="28 Days Left" subtitle="Premier Plan" icon={TrendingUp} colorClass="text-blue-600" />
            </div>
            <div>
                <h3 className="text-2xl font-bold pt-4 text-slate-800">API Credit Purchase Plans</h3>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                    {plans.map(plan => (<div key={plan.name} className={`rounded-2xl border-4 ${plan.color} bg-slate-50 p-8 shadow-xl text-center flex flex-col`}><h4 className="text-3xl font-extrabold mb-2 text-slate-800">{plan.name}</h4><p className="text-lg font-semibold text-red-600 mb-4">{NGN_FORMAT.format(plan.price)} / Year</p><p className="text-5xl font-extrabold text-slate-900">{plan.credits.toLocaleString()}</p><p className="text-lg font-medium text-slate-500 mb-6">GNN Analysis Credits</p><div className="bg-red-100 text-red-700 py-1 rounded-full mb-6 text-xs font-semibold">{plan.roi} Guaranteed</div><button className="w-full mt-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors">Purchase Now</button></div>))}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold pt-4 text-slate-800">Recent Billing & Usage History</h3>
                <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden mt-6">
                    <table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Description</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Financial Impact</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Credit Change</th></tr></thead>
                    <tbody className="bg-white divide-y divide-slate-200">{creditHistory.map((item, index) => (<tr key={index}><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.date}</td><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.transaction}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.amount}</td><td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${item.credits.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{item.credits}</td></tr>))}</tbody></table>
                </div>
            </div>
        </div>
    );
};

const UserManagement = () => {
    const [managers, setManagers] = useState([{ id: "mgr-1", name: "Aisha Bello", email: "aisha.bello@examplebank.com", role: "Fraud Manager" }, { id: "mgr-2", name: "Chike Obi", email: "chike.obi@examplebank.com", role: "Lead Analyst" }, { id: "mgr-3", name: "Kemi Adebayo", email: "kemi.adebayo@examplebank.com", role: "Compliance Officer" }]);
    const [showAddModal, setShowAddModal] = useState(false);
    const handleAddUser = (newUser) => { setManagers((m) => [newUser, ...m]); };
    const removeManager = (id) => { setManagers((m) => m.filter((x) => x.id !== id)); };
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-semibold text-slate-900">User Management</h2><p className="text-sm text-slate-600 mt-1">Provision and manage operational access for your team.</p></div>
                <button onClick={() => setShowAddModal(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 shadow-md hover:shadow-lg"><Plus size={16} />Provision New User</button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-200"><tr className="text-xs text-slate-500 uppercase"><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4 text-right">Actions</th></tr></thead>
                    <tbody>{managers.map((u) => (<tr key={u.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors"><td className="p-4 font-medium text-slate-900">{u.name}</td><td className="p-4 text-slate-600">{u.email}</td><td className="p-4 text-sm text-slate-600">{u.role}</td><td className="p-4 text-right"><button onClick={() => removeManager(u.id)} className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs text-red-700 transition-colors hover:bg-red-600 hover:text-white"><Trash2 size={14} />Remove Access</button></td></tr>))}</tbody>
                </table>
            </div>
            {showAddModal && <AddUserModal onAddUser={handleAddUser} onClose={() => setShowAddModal(false)} />}
        </div>
    );
};

const ApiDocs = () => {
    const CodeSnippet = ({ children, lang }) => <pre className={`language-${lang} mt-2 rounded-xl bg-slate-900 p-4 text-xs text-white/80 overflow-auto font-mono`}>{children}</pre>;
    const CodeBlock = ({ title, method, endpoint, description, children, requiredResponse, securityNote }) => (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 space-y-4 shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-widest text-red-600">{title}</span>
            <h3 className="mt-1 text-xl font-semibold text-slate-800">{description}</h3>
            <div className="bg-slate-800 p-4 rounded-lg"><code className={`text-sm font-mono ${method === 'POST' ? 'text-green-400' : 'text-blue-400'}`}>{method} {endpoint}</code></div>
            {securityNote && <p className="text-sm italic text-slate-500">{securityNote}</p>}
            <p className="text-sm font-medium text-slate-700 mt-4">Request Body Payload (JSON)</p>
            <CodeSnippet lang="json">{children}</CodeSnippet>
            {requiredResponse && (<><p className="text-sm font-medium text-slate-700 pt-3">Expected Successful Response (200 OK)</p><CodeSnippet lang="json">{requiredResponse}</CodeSnippet></>)}
        </div>
    );

    return (
        <div className="space-y-8">
            <div><h2 className="text-3xl font-semibold text-slate-900">API Integration Documentation</h2><p className="text-sm text-slate-600">Technical blueprint for securely integrating your core systems with Nexus Disrupt™. All communications must use **Mutual TLS (mTLS)**.</p></div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-8">
                <div className="lg:sticky top-24 self-start">
                    <h3 className="font-semibold text-slate-800 mb-4">Integration Steps</h3>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li><a href="#security" className="hover:text-red-600">1. Authentication</a></li>
                        <li><a href="#inbound" className="hover:text-red-600">2. Inbound Data Stream</a></li>
                        <li><a href="#outbound" className="hover:text-red-600">3. Outbound Webhook</a></li>
                        <li><a href="#examples" className="hover:text-red-600">4. Code Examples</a></li>
                    </ul>
                </div>
                <div className="space-y-12">
                    <section id="security"><h3 className="text-xl font-semibold text-slate-800 border-b border-slate-300 pb-2 mb-4">Security Protocol & Authentication</h3><p className="text-sm text-slate-600">You must send your API Key as a Bearer Token in the `Authorization` header for every request.</p><CodeSnippet lang="http">{`Authorization: Bearer <YOUR_API_KEY>\nContent-Type: application/json`}</CodeSnippet></section>
                    <section id="inbound"><CodeBlock title="DATA INGESTION (INBOUND)" method="POST" endpoint="/v1/transactions/stream" description="Push high-risk transactions for GNN analysis." securityNote="Credit Consumption: 1 Credit is consumed per transaction processed by the GNN." requiredResponse={`{\n  "status": "ACCEPTED",\n  "credit_balance_remaining": 28500\n}`}>{`{\n  "transaction_id": "TXN_987654321",\n  "timestamp": "2025-11-10T14:30:00Z",\n  "source_account": "ACC_STOLEN_001",\n  "destination_account": "ACC_MULE_22A",\n  "amount": 4500000.00\n}`}</CodeBlock></section>
                    <section id="outbound"><CodeBlock title="AI DISRUPTION (OUTBOUND HOOK)" method="POST" endpoint="/hooks/nexus-disrupt/freeze" description="Expose this endpoint for our Agentic AI to trigger the Micro-Freeze." securityNote="This endpoint must respond within 500ms." requiredResponse={`{\n  "status": "SUCCESS",\n  "freeze_status": "PENDING_FORMAL_HOLD"\n}`}>{`{\n  "transaction_id": "TXN_987654321",\n  "account_id": "ACC_MULE_22A",\n  "incident_id": "CASE_ND_2025_001",\n  "ccnm_summary": "Network structure violation..."\n}`}</CodeBlock></section>
                    <section id="examples">
                        <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-300 pb-2 mb-4">Implementation Examples</h3>
                        <p className="text-sm text-slate-600 mb-4">Quick start examples for integrating the inbound transaction stream.</p>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-lg">
                            <h4 className="font-semibold text-slate-700">Node.js Example (using Axios)</h4>
                            <CodeSnippet lang="javascript">{`const axios = require('axios');

async function streamTransaction(transactionData) {
  try {
    const response = await axios.post(
      'https://api.nexusdisrupt.com/v1/transactions/stream',
      transactionData,
      {
        headers: {
          'Authorization': \`Bearer \${process.env.NEXUS_API_KEY}\`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('Error streaming transaction:', error.response.data);
  }
}`}</CodeSnippet>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

const SettingsPanel = () => {
  const [isGenerating, setIsGenerating] = useState(false); const [apiKey, setApiKey] = useState("nd_prod_******************xyz"); const [showKey, setShowKey] = useState(false); const [copied, setCopied] = useState(false); const [gnnThreshold, setGnnThreshold] = useState(0.92);
  const generateKey = () => { setIsGenerating(true); setTimeout(() => { setApiKey(`nd_prod_${[...Array(22)].map(() => Math.random().toString(36)[2]).join("")}`); setIsGenerating(false); setShowKey(true); }, 2000); };
  const copyKey = () => { const temp = document.createElement('textarea'); temp.value = apiKey; document.body.appendChild(temp); temp.select(); document.execCommand('copy'); document.body.removeChild(temp); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="space-y-8">
        <div><h2 className="text-3xl font-semibold text-slate-900">Settings & AI Controls</h2><p className="text-sm text-slate-600">Manage your integration credentials and AI sensitivity.</p></div>
        <div className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 space-y-8 shadow-lg">
            <div>
                <h3 className="font-semibold text-slate-900 text-xl mb-1">API Key Management</h3><p className="text-sm text-slate-500 mb-4">Use this key to authenticate your Transaction Stream. Ensure it is secured via mTLS.</p>
                <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 p-3"><Key size={16} className="text-red-600" /><input readOnly value={showKey ? apiKey : "•".repeat(30)} className="flex-1 bg-transparent font-mono text-sm text-slate-600 focus:outline-none" /><button onClick={() => setShowKey(!showKey)} className="text-slate-500 hover:text-red-600"><span className="sr-only">Toggle visibility</span>{showKey ? <EyeOff size={16} /> : <Eye size={16} />}</button><button onClick={copyKey} className="text-slate-500 hover:text-red-600"><span className="sr-only">Copy key</span>{copied ? <ShieldCheck size={16} className="text-green-600" /> : <Copy size={16} />}</button></div>
                <div className="mt-4"><button onClick={generateKey} disabled={isGenerating} className="flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">{isGenerating ? (<><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white"></div><span>Generating...</span></>) : "Generate New Key"}</button><p className="text-xs text-slate-500 mt-2">Generating a new key will invalidate the old one immediately.</p></div>
            </div>
            <div className="border-t border-slate-200 pt-8">
                <h3 className="font-semibold text-slate-900 text-xl mb-1">AI Sensitivity Controls (GNN Threshold)</h3><p className="text-sm text-slate-500 mb-4">Adjust the GNN's confidence level required to trigger the Agentic Micro-Freeze command.</p>
                <div className="flex items-center gap-4"><input type="range" min="0.80" max="0.99" step="0.01" value={gnnThreshold} onChange={(e) => setGnnThreshold(parseFloat(e.target.value))} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-red-600 accent-red-600" /><span className="font-bold text-red-600 w-16">{`${(gnnThreshold * 100).toFixed(0)}%`}</span></div>
                <p className="text-xs text-slate-500 mt-2">Current Threshold: A GNN Score of {gnnThreshold} or higher triggers autonomous disruption.</p>
            </div>
        </div>
    </div>
  );
};

// --- MAIN PORTAL SHELL ---

const AdminPortal = ({ onLogout }) => {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const pageTitles = { dashboard: "Administrator Dashboard", users: "User Management", billing: "Billing & API Credits", api: "API Integration", settings: "Settings & AI Controls" };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <AdminDashboard />;
      case "users": return <UserManagement />;
      case "billing": return <BillingPage />;
      case "api": return <ApiDocs />;
      case "settings": return <SettingsPanel />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      <nav className={`z-20 flex flex-col border-r border-black/10 bg-slate-900 transition-all duration-300 ease-in-out ${isSidebarExpanded ? "w-64" : "w-20"}`} onMouseEnter={() => setIsSidebarExpanded(true)} onMouseLeave={() => setIsSidebarExpanded(false)}>
        <div className="flex h-20 shrink-0 items-center justify-center border-b border-white/10">
            <span className={`text-xl font-bold text-red-600 transition-transform duration-200 ${!isSidebarExpanded && "scale-110"}`}>ND</span>
            <span className={`ml-2 whitespace-nowrap text-xl font-bold text-white transition-all duration-200 ${isSidebarExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}>Nexus Disrupt™</span>
        </div>
        <ul className="flex-grow space-y-2 py-6">
          <NavItem icon={<LayoutDashboard size={20} />} text="Dashboard" isExpanded={isSidebarExpanded} active={activePage === "dashboard"} onClick={() => setActivePage("dashboard")} />
          <NavItem icon={<Wallet size={20} />} text="Billing & Credits" isExpanded={isSidebarExpanded} active={activePage === "billing"} onClick={() => setActivePage("billing")} />
          <NavItem icon={<Users size={20} />} text="User Management" isExpanded={isSidebarExpanded} active={activePage === "users"} onClick={() => setActivePage("users")} />
          <NavItem icon={<FileText size={20} />} text="API Integration" isExpanded={isSidebarExpanded} active={activePage === "api"} onClick={() => setActivePage("api")} />
          <NavItem icon={<Settings size={20} />} text="Settings" isExpanded={isSidebarExpanded} active={activePage === "settings"} onClick={() => setActivePage("settings")} />
        </ul>
        <div className="border-t border-white/10 p-4"><button onClick={onLogout} className="mt-2 flex h-12 w-full items-center rounded-lg px-4 text-slate-300 transition-colors hover:bg-red-600/20 hover:text-red-600"><LogOut size={20} /><span className={`ml-4 text-sm font-medium transition-opacity ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>Logout</span></button></div>
      </nav>
      <main className="dashboard-scroll flex-1 overflow-y-auto">
        <div className="relative min-h-full">
            <PortalNavbar user={user.email} onLogout={onLogout} title={pageTitles[activePage] || 'Admin Dashboard'} />
            <div className="p-8">{renderPage()}</div>
        </div>
      </main>
    </div>
  );
};

export default AdminPortal;