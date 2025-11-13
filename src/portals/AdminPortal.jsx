// src/portals/AdminPortal.jsx
import React, { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Key,
  Cpu,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import PortalNavbar from "../components/PortalNavbar.jsx";

// --- REUSABLE UI COMPONENTS ---

const KpiCard = ({ title, value, subtitle }) => (
  <div className="rounded-2xl border border-white/15 bg-black/60 p-6 backdrop-blur-xl">
    <p className="mb-2 text-sm text-white/60">{title}</p>
    <div className="flex items-baseline gap-3">
      <p className="text-3xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-white/50">{subtitle}</p>}
    </div>
  </div>
);

const NavItem = ({ icon, text, isExpanded, active, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`mx-auto flex h-12 w-full items-center rounded-lg transition-colors duration-200 ${
        isExpanded ? "px-4" : "justify-center px-0"
      } ${
        active
          ? "bg-zenithRed text-white shadow-lg shadow-zenithRed/30"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span
        className={`ml-4 text-sm font-medium transition-all ${
          isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
        }`}
      >
        {text}
      </span>
    </button>
  </li>
);

// --- PAGE COMPONENTS ---

const AdminDashboard = ({ onNavigate }) => {
  const [isIntegrated, setIsIntegrated] = useState(false); // Simulate integration status
  const kpis = [
    {
      title: "Pilot Fee Status",
      value: "25% RECEIVED",
      subtitle: "NGN 12.5M of 50M",
    },
    { title: "Provisioned Managers", value: "3" },
    { title: "API Throughput (1h)", value: "42,109 tx" },
    { title: "Avg. API Latency", value: "89ms" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Administrator Dashboard
        </h2>
        <p className="text-sm text-white/60">
          Executive summary of system health and account status.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard key={k.title} {...k} />
        ))}
      </div>

      {/* Actionable Prompt */}
      {!isIntegrated && (
        <div className="group rounded-3xl border border-zenithRed/50 bg-zenithRed/10 p-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 hover:border-zenithRed/80 hover:bg-zenithRed/20">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Complete Your Integration
            </h3>
            <p className="text-sm text-white/70 mt-1">
              Your system is not yet streaming live data. Follow our API
              documentation to get started.
            </p>
          </div>
          <button
            onClick={() => onNavigate("api")}
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-zenithRed px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 group-hover:scale-105"
          >
            View API Docs <ArrowRight size={16} />
          </button>
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">System Status</h3>
            <p className="text-sm text-white/60">
              Overview of core services and availability.
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-medium ${
              isIntegrated
                ? "bg-green-500/10 text-green-400"
                : "bg-yellow-500/10 text-yellow-400"
            }`}
          >
            <Cpu size={16} />{" "}
            <span>
              {isIntegrated
                ? "All Systems Operational"
                : "Awaiting Integration"}
            </span>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-white/5 p-4">
            <div className="text-xs text-white/50">Transaction Stream</div>
            <div className="mt-1 text-sm text-white">
              {isIntegrated ? "Streaming • 99.98% uptime" : "Pending"}
            </div>
          </div>
          <div className="rounded-xl bg-white/5 p-4">
            <div className="text-xs text-white/50">Micro-Freeze Service</div>
            <div className="mt-1 text-sm text-white">
              Operational • 112ms median
            </div>
          </div>
          <div className="rounded-xl bg-white/5 p-4">
            <div className="text-xs text-white/50">Audit Log Writer</div>
            <div className="mt-1 text-sm text-white">
              Available • Replication: OK
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [managers, setManagers] = useState([
    { id: "mgr-1", name: "Aisha Bello", email: "aisha.bello@examplebank.com" },
    { id: "mgr-2", name: "Chike Obi", email: "chike.obi@examplebank.com" },
    {
      id: "mgr-3",
      name: "Kemi Adebayo",
      email: "kemi.adebayo@examplebank.com",
    },
  ]);
  const [form, setForm] = useState({ name: "", email: "" });
  const addManager = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setManagers((m) => [{ id: `mgr-${Date.now()}`, ...form }, ...m]);
    setForm({ name: "", email: "" });
  };
  const removeManager = (id) =>
    setManagers((m) => m.filter((x) => x.id !== id));
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">User Management</h2>
        <p className="text-sm text-white/60">
          Manage Fraud Manager accounts and access for your team.
        </p>
      </div>
      <form
        onSubmit={addManager}
        className="rounded-3xl border border-white/10 bg-black/40 p-6 flex flex-col md:flex-row items-center gap-4"
      >
        <input
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          placeholder="Full Name"
          className="flex-1 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-zenithRed focus:outline-none"
          required
        />
        <input
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          placeholder="Email Address"
          type="email"
          className="flex-1 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-zenithRed focus:outline-none"
          required
        />
        <button
          className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-full bg-zenithRed px-6 py-2 text-sm font-semibold text-white transition-colors hover:brightness-110"
          type="submit"
        >
          <Plus size={16} />
          Add Manager
        </button>
      </form>
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
        <table className="w-full text-left">
          <thead className="border-b border-white/10">
            <tr className="text-xs text-white/60">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((u) => (
              <tr
                key={u.id}
                className="border-b border-white/5 last:border-none"
              >
                <td className="p-4 font-medium text-white">{u.name}</td>
                <td className="p-4 text-white/70">{u.email}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => removeManager(u.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 transition-colors hover:bg-zenithRed hover:text-white"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ApiDocs = () => {
  const CodeSnippet = ({ children }) => (
    <pre className="mt-2 rounded-lg bg-black/60 p-4 text-xs text-white/70 overflow-auto font-mono">
      {children}
    </pre>
  );
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">API Documentation</h2>
        <p className="text-sm text-white/60">
          Technical blueprint for integrating your core systems with Nexus
          Disrupt™.
        </p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-black/40 p-8 space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-zenithRed">
            Step 1
          </span>
          <h3 className="mt-1 text-xl font-semibold text-white">
            Authenticate & Secure Connection
          </h3>
          <p className="mt-2 text-sm text-white/70">
            All API communication requires your secret API key to be sent as a
            bearer token in the `Authorization` header. Communication is
            enforced over HTTPS with Mutual TLS (mTLS).
          </p>
          <CodeSnippet>{`Authorization: Bearer <YOUR_API_KEY>`}</CodeSnippet>
        </div>
        <div className="border-t border-white/10"></div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-zenithRed">
            Step 2
          </span>
          <h3 className="mt-1 text-xl font-semibold text-white">
            Stream Transaction Data (Inbound)
          </h3>
          <p className="mt-2 text-sm text-white/70">
            As transactions occur in your system, push them to our secure
            endpoint. You can send events individually or in batches up to 100.
          </p>
          <CodeSnippet>{`POST https://api.nexusdisrupt.com/v1/transactions/stream

[
  {
    "transactionId": "...",
    "timestamp": "...",
    "sourceAccount": "...",
    "destinationAccount": "...",
    "amount": 250000,
    "currency": "NGN",
    "metadata": { ... }
  }
]`}</CodeSnippet>
        </div>
        <div className="border-t border-white/10"></div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-zenithRed">
            Step 3
          </span>
          <h3 className="mt-1 text-xl font-semibold text-white">
            Implement Micro-Freeze Webhook (Outbound)
          </h3>
          <p className="mt-2 text-sm text-white/70">
            When our Agentic AI identifies a threat, it will call an endpoint on
            your system that you provide. This webhook must be able to place a
            temporary hold on an account.
          </p>
          <CodeSnippet>{`// Your server must expose an endpoint like this:
POST /hooks/nexus-disrupt/freeze

// Our system will send this payload:
{
  "accountId": "ACC_EXIT_POINT",
  "action": "MICRO_FREEZE",
  "reasonCode": "GNN_MULE_NETWORK_DETECTED",
  "incidentId": "CASE_12345"
}`}</CodeSnippet>
        </div>
      </div>
    </div>
  );
};

const SettingsPanel = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState("nd_prod_******************xyz");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setApiKey(
        `nd_prod_${[...Array(22)]
          .map(() => Math.random().toString(36)[2])
          .join("")}`
      );
      setIsGenerating(false);
      setShowKey(true);
    }, 2000);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Settings & API Keys
        </h2>
        <p className="text-sm text-white/60">
          Manage your integration credentials and AI sensitivity.
        </p>
      </div>
      <div className="max-w-3xl rounded-3xl border border-white/10 bg-black/40 p-8 space-y-8">
        <div>
          <h3 className="font-semibold text-white">API Key Management</h3>
          <p className="text-xs text-white/50 mb-4">
            Use this key in your backend to authenticate with our Transaction
            Stream endpoint.
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 p-3">
            <Key size={16} className="text-white/40" />
            <input
              readOnly
              value={showKey ? apiKey : "•".repeat(30)}
              className="flex-1 bg-transparent font-mono text-sm text-white/60 focus:outline-none"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-white/50 hover:text-white"
            >
              <span className="sr-only">Toggle visibility</span>
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              onClick={copyKey}
              className="text-white/50 hover:text-white"
            >
              <span className="sr-only">Copy key</span>
              {copied ? (
                <ShieldCheck size={16} className="text-green-400" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={generateKey}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 rounded-full bg-zenithRed/80 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zenithRed disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                "Generate New Key"
              )}
            </button>
            <p className="text-xs text-white/40 mt-2">
              Generating a new key will invalidate the old one immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PORTAL SHELL ---

const AdminPortal = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const pageTitles = {
    dashboard: "Administrator Dashboard",
    users: "User Management",
    api: "API Documentation",
    settings: "Settings & API Keys",
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <AdminDashboard onNavigate={setActivePage} />;
      case "users":
        return <UserManagement />;
      case "api":
        return <ApiDocs />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <AdminDashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#0a0204] via-[#1a060c] to-[#060505] font-sans text-white">
      <nav
        className={`z-20 flex flex-col border-r border-white/10 bg-black/60 backdrop-blur-2xl transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? "w-64" : "w-20"
        }`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="flex h-20 shrink-0 items-center justify-center border-b border-white/10">
          <span
            className={`text-xl font-bold text-zenithRed transition-transform duration-200 ${
              !isSidebarExpanded && "scale-110"
            }`}
          >
            ND
          </span>
          <span
            className={`ml-2 whitespace-nowrap text-xl font-bold text-white transition-all duration-200 ${
              isSidebarExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            Nexus Disrupt™
          </span>
        </div>
        <ul className="flex-grow space-y-2 py-6">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
            isExpanded={isSidebarExpanded}
            active={activePage === "dashboard"}
            onClick={() => setActivePage("dashboard")}
          />
          <NavItem
            icon={<Users size={20} />}
            text="User Management"
            isExpanded={isSidebarExpanded}
            active={activePage === "users"}
            onClick={() => setActivePage("users")}
          />
          <NavItem
            icon={<FileText size={20} />}
            text="API Docs"
            isExpanded={isSidebarExpanded}
            active={activePage === "api"}
            onClick={() => setActivePage("api")}
          />
          <NavItem
            icon={<Settings size={20} />}
            text="Settings"
            isExpanded={isSidebarExpanded}
            active={activePage === "settings"}
            onClick={() => setActivePage("settings")}
          />
        </ul>
        <div className="border-t border-white/10 p-6">
          <button
            onClick={onLogout}
            className="mt-2 flex h-12 w-full items-center rounded-lg px-4 text-gray-400 transition-colors hover:bg-zenithRed/20 hover:text-zenithRed"
          >
            <LogOut size={20} />
            <span
              className={`ml-4 text-sm font-medium transition-opacity ${
                isSidebarExpanded ? "opacity-100" : "opacity-0"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </nav>
      <main className="dashboard-scroll flex-1 overflow-y-auto">
        <div className="relative min-h-full">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-zenithRed/30 blur-3xl"></div>
            <div className="absolute right-[-12%] top-10 h-96 w-96 rounded-full bg-[#e84750]/25 blur-3xl"></div>
            <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl"></div>
          </div>
          <div className="relative z-10 pb-16">
            <PortalNavbar
              user={user}
              onLogout={onLogout}
              title={pageTitles[activePage] || "Admin Dashboard"}
            />
            <div className="mt-4 space-y-6 px-6 pb-6 md:px-10">
              {renderPage()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPortal;