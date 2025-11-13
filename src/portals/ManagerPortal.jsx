/* eslint-disable no-unused-vars */
// src/portals/ManagerPortal.jsx
import React, { useState, useEffect, useMemo } from "react";
import ReactFlow, { Background, Controls, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import logo from "../assets/nobglogo.png";
import {
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  Waypoints,
  Users,
  FileText,
  Settings,
  AlertTriangle,
  ArrowRight,
  Clock,
  ShieldCheck,
  X,
  CheckCircle,
  Undo2,
  Zap,
} from "lucide-react";

// --- INLINED STYLES & MOCK SERVICE ---

const GlobalStyles = () => (
  <style>{`
        .dashboard-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .dashboard-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
        .dashboard-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
        .dashboard-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    `}</style>
);

const NGN_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
});

const MOCK_TRANSACTIONS = [
  {
    id: "TXN1001",
    amount: 85000,
    gnnScore: 0.12,
    status: "CLEAN",
    source: "ACC...234",
    destination: "ACC...567",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    is_fraud_network: false,
    deviceFingerprint: "DEV_A",
  },
  {
    id: "TXN1003",
    amount: 5000000,
    gnnScore: 0.96,
    status: "HIGH RISK",
    source: "ACC_STOLEN",
    destination: "ACC_MULE_1",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    is_fraud_network: true,
    deviceFingerprint: "DEV_C_FRAUD",
  },
  {
    id: "TXN1005",
    amount: 4800000,
    gnnScore: 0.98,
    status: "FROZEN",
    source: "ACC_MULE_1",
    destination: "ACC_MULE_2",
    timestamp: new Date(Date.now() - 7 * 60000).toISOString(),
    is_fraud_network: true,
    deviceFingerprint: "DEV_C_FRAUD",
  },
  {
    id: "TXN1007",
    amount: 5200000,
    gnnScore: 0.97,
    status: "FROZEN",
    source: "ACC_MULE_2",
    destination: "ACC_EXIT_POINT",
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    is_fraud_network: true,
    deviceFingerprint: "DEV_C_FRAUD",
  },
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `TXN_C_${i}`,
    amount: Math.random() * 50000 + 1000,
    gnnScore: Math.random() * 0.2,
    status: "CLEAN",
    source: `ACC...${1000 + i}`,
    destination: `ACC...${2000 + i}`,
    timestamp: new Date(Date.now() - (11 + i) * 60000).toISOString(),
    is_fraud_network: false,
    deviceFingerprint: `DEV_CLEAN_${i}`,
  })),
];

const MOCK_CCN_REPORT = (caseData) =>
  `INCIDENT ID: ${
    caseData.id
  }\nAI-GENERATED COMPLIANCE MEMORANDUM\nSTATUS: PENDING HUMAN AUTHORIZATION\n\n1. ACTION TAKEN: Autonomous Micro-Freeze executed on ${
    caseData.destination
  }.\n2. JUSTIFICATION (GNN): Transaction ${
    caseData.id
  } is part of a high-confidence 'Fan-Out, Converge-In' structural anomaly (GNN Score: ${(
    caseData.gnnScore * 100
  ).toFixed(1)}%) originating from ${
    caseData.source
  }.\n3. CONSEQUENCE ANALYSIS (CDT): Failure to act carried a 98.5% confidence of regulatory non-compliance, with an estimated Regulatory Penalty Value of 850,000,000 NGN and a Reputational Damage Score of 9.2 (Critical).\n4. RECOMMENDATION: Authorize Formal Hold and proceed with regulatory filing.`;

const mockApiService = {
  fetchTransactions: () =>
    new Promise((resolve) => setTimeout(() => resolve(MOCK_TRANSACTIONS), 500)),
  authorizeHold: (id) => {
    const txn = MOCK_TRANSACTIONS.find((t) => t.id === id);
    return Promise.resolve({ ...txn, status: "AUTHORIZED HOLD" });
  },
  releaseFunds: (id) => {
    const txn = MOCK_TRANSACTIONS.find((t) => t.id === id);
    return Promise.resolve({ ...txn, status: "CLEAN" });
  },
  MOCK_CCN_REPORT: MOCK_CCN_REPORT,
};

const formatRelativeTime = (input) => {
  const timestamp = new Date(input).getTime();
  if (Number.isNaN(timestamp)) return "Unknown";
  const diff = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return "Just now";
  if (diff < hour) {
    const value = Math.floor(diff / minute);
    return `${value}m ago`;
  }
  if (diff < day) {
    const value = Math.floor(diff / hour);
    return `${value}h ago`;
  }
  const value = Math.floor(diff / day);
  return `${value}d ago`;
};

// --- REUSABLE UI COMPONENTS ---

const PortalNavbar = ({ title, user, onLogout }) => (
  <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md md:px-10">
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="Nexus Disrupt logo"
        className="h-10 w-10 rounded-full bg-slate-100 object-cover shadow"
      />
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>
    </div>
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-slate-600 sm:inline">{user}</span>
      <button
        onClick={onLogout}
        className="rounded-full p-2 text-slate-500 transition-colors hover:bg-red-100 hover:text-red-600"
      >
        <LogOut size={20} />
      </button>
    </div>
  </header>
);

const KpiCard = ({
  title,
  value,
  icon: Icon,
  colorClass = "text-slate-900",
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
    <div className="flex items-start justify-between">
      <p className="mb-2 text-sm font-medium text-slate-500">{title}</p>
      {Icon && <Icon size={20} className={colorClass} />}
    </div>
    <div className="flex items-baseline gap-3">
      <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
    </div>
  </div>
);

const FilterButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
      active
        ? "bg-red-600 text-white shadow-md shadow-red-600/20"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
    }`}
  >
    {children}
  </button>
);

const NavItem = ({ icon, text, isExpanded, active = false, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`mx-auto flex h-12 w-full items-center rounded-lg transition-colors duration-200 ${
        isExpanded ? "px-4" : "justify-center px-0"
      } ${
        active
          ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
          : "text-slate-300 hover:bg-slate-700 hover:text-white"
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

const OperationalDashboard = ({ onViewDetails }) => {
  const [transactions, setTransactions] = useState([]);
  const [streamedTransactions, setStreamedTransactions] = useState([]);
  const [kpiStats, setKpiStats] = useState({
    secured: 0,
    disruptions: 0,
    credits: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const PAGE_SIZE = 10;
  useEffect(() => {
    mockApiService.fetchTransactions().then(setTransactions);
  }, []);
  useEffect(() => {
    if (!transactions.length) return;
    setStreamedTransactions([]);
    setKpiStats({ secured: 0, disruptions: 0, credits: 0 });
    let i = 0;
    const interval = setInterval(() => {
      setStreamedTransactions((prev) => {
        if (i >= transactions.length) {
          i = 0;
        }
        const nextTxn = transactions[i];
        i++;
        if (
          nextTxn.is_fraud_network &&
          (nextTxn.status === "HIGH RISK" || nextTxn.status === "FROZEN")
        ) {
          setKpiStats((s) => ({
            secured: s.secured + nextTxn.amount,
            disruptions: s.disruptions + 1,
            credits: s.credits + 1,
          }));
        }
        setCurrentPage(1);
        return [nextTxn, ...prev.slice(0, 199)];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const now = Date.now();
    const thresholds = {
      last15: now - 15 * 60 * 1000,
      last60: now - 60 * 60 * 1000,
      last1440: now - 24 * 60 * 60 * 1000,
    };
    const query = searchTerm.trim().toLowerCase();
    return streamedTransactions.filter((txn) => {
      if (statusFilter !== "all" && txn.status !== statusFilter) return false;
      if (networkFilter === "fraud" && !txn.is_fraud_network) return false;
      if (networkFilter === "legit" && txn.is_fraud_network) return false;
      if (timeFilter !== "all") {
        const txnTime = new Date(txn.timestamp).getTime();
        if (timeFilter === "last15" && txnTime < thresholds.last15)
          return false;
        if (timeFilter === "last60" && txnTime < thresholds.last60)
          return false;
        if (timeFilter === "last1440" && txnTime < thresholds.last1440)
          return false;
      }
      if (query) {
        const haystack = [
          txn.id,
          txn.source,
          txn.destination,
          txn.deviceFingerprint,
          txn.status,
          String(txn.amount),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [
    streamedTransactions,
    statusFilter,
    networkFilter,
    timeFilter,
    searchTerm,
  ]);

  const { activeFiltersCount, activeFilterLabels } = useMemo(() => {
    const labels = [];
    if (statusFilter !== "all") labels.push(`Status: ${statusFilter}`);
    if (networkFilter !== "all")
      labels.push(networkFilter === "fraud" ? "Fraud Network" : "Legitimate");
    if (timeFilter !== "all") {
      labels.push(
        timeFilter === "last15"
          ? "Last 15m"
          : timeFilter === "last60"
          ? "Last 1h"
          : "Last 24h"
      );
    }
    return {
      activeFiltersCount: labels.length,
      activeFilterLabels: labels.join(" • "),
    };
  }, [statusFilter, networkFilter, timeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / PAGE_SIZE)
  );
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, networkFilter, timeFilter, searchTerm]);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const getStatusClasses = (status) => {
    switch (status) {
      case "HIGH RISK":
        return "bg-yellow-100 text-yellow-800";
      case "FROZEN":
        return "bg-red-100 text-red-800";
      case "AUTHORIZED HOLD":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };
  const getRowClasses = (status) => {
    switch (status) {
      case "HIGH RISK":
        return "bg-yellow-50 hover:bg-yellow-100/60";
      case "FROZEN":
        return "bg-red-50 hover:bg-red-100/60 border-l-4 border-red-500";
      case "AUTHORIZED HOLD":
        return "bg-blue-50 hover:bg-blue-100/60";
      default:
        return "bg-white hover:bg-slate-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Funds Secured (24h)"
          value={NGN_FORMATTER.format(kpiStats.secured)}
          icon={ShieldCheck}
          colorClass="text-green-600"
        />
        <KpiCard
          title="Active Disruptions"
          value={kpiStats.disruptions}
          icon={ShieldAlert}
          colorClass="text-red-600"
        />
        <KpiCard
          title="GNN Credits Used (24h)"
          value={kpiStats.credits.toLocaleString()}
          icon={Zap}
        />
        <KpiCard title="Avg. Disruption Time" value="280ms" icon={Clock} />
      </div>
      <div
        className={`rounded-2xl border border-slate-200 bg-white/80 px-4 md:px-6 shadow-lg backdrop-blur-md ${
          filtersOpen ? "py-5" : "py-3"
        }`}
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className={`flex-1 ${filtersOpen ? "space-y-4" : "space-y-2"}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Transaction filters
                </p>
                <p className="text-xs text-slate-500">
                  {activeFiltersCount > 0
                    ? activeFilterLabels
                    : "No filters applied"}
                </p>
              </div>
              <button
                onClick={() => setFiltersOpen((p) => !p)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                  filtersOpen
                    ? "bg-slate-200 text-slate-800"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filtersOpen ? "Hide" : "Show"} Filters{" "}
                {activeFiltersCount > 0 && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
            {filtersOpen && (
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: "All statuses", value: "all" },
                    { label: "High Risk", value: "HIGH RISK" },
                    { label: "Frozen", value: "FROZEN" },
                    { label: "Authorized", value: "AUTHORIZED HOLD" },
                    { label: "Clean", value: "CLEAN" },
                  ].map((o) => (
                    <FilterButton
                      key={o.value}
                      active={statusFilter === o.value}
                      onClick={() => setStatusFilter(o.value)}
                    >
                      {o.label}
                    </FilterButton>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: "All traffic", value: "all" },
                    { label: "Fraud network", value: "fraud" },
                    { label: "Legitimate", value: "legit" },
                  ].map((o) => (
                    <FilterButton
                      key={o.value}
                      active={networkFilter === o.value}
                      onClick={() => setNetworkFilter(o.value)}
                    >
                      {o.label}
                    </FilterButton>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: "Any time", value: "all" },
                    { label: "Last 15m", value: "last15" },
                    { label: "Last 1h", value: "last60" },
                    { label: "Last 24h", value: "last1440" },
                  ].map((o) => (
                    <FilterButton
                      key={o.value}
                      active={timeFilter === o.value}
                      onClick={() => setTimeFilter(o.value)}
                    >
                      {o.label}
                    </FilterButton>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="w-full max-w-sm">
            <label
              htmlFor="tx-search"
              className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400"
            >
              Search transactions
            </label>
            <div className="rounded-full border border-slate-300 bg-white px-4 py-2 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-600/20">
              <input
                id="tx-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ID, account, device, amount..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur-md">
        <h3 className="mb-4 text-xl font-semibold text-slate-900">
          Real-Time Transaction Feed
        </h3>
        <div className="dashboard-scroll overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-500">
                  Timestamp
                </th>
                <th className="p-4 text-sm font-semibold text-slate-500">
                  Source
                </th>
                <th className="p-4 text-sm font-semibold text-slate-500">
                  Destination
                </th>
                <th className="p-4 text-sm font-semibold text-slate-500">
                  Amount
                </th>
                <th className="p-4 text-sm font-semibold text-slate-500">
                  GNN Score
                </th>
                <th className="p-4 text-sm font-semibold text-slate-500">
                  Status
                </th>
                <th className="p-4 text-sm font-semibold text-slate-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-6 text-center text-sm text-slate-500"
                  >
                    {streamedTransactions.length === 0
                      ? "Initializing live data stream..."
                      : "No transactions match filters."}
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className={`border-b border-slate-100 last:border-none transition-colors ${getRowClasses(
                      txn.status
                    )}`}
                  >
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(txn.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-4 font-mono text-sm text-slate-700">
                      {txn.source}
                    </td>
                    <td className="p-4 font-mono text-sm text-slate-700">
                      {txn.destination}
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-800">
                      {NGN_FORMATTER.format(txn.amount)}
                    </td>
                    <td
                      className={`p-4 font-mono text-sm font-semibold ${
                        txn.gnnScore > 0.9 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {txn.gnnScore.toFixed(2)}
                    </td>
                    <td className="p-4 text-xs font-semibold">
                      <span
                        className={`rounded-full px-2 py-1 ${getStatusClasses(
                          txn.status
                        )}`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onViewDetails(txn)}
                        className="rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-600"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-slate-500">
            {filteredTransactions.length === 0
              ? "No results"
              : `Showing ${paginatedTransactions.length} of ${filteredTransactions.length} transactions`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || filteredTransactions.length === 0}
              className="h-9 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors disabled:cursor-not-allowed disabled:text-slate-300 enabled:hover:bg-slate-100"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={
                currentPage === totalPages || filteredTransactions.length === 0
              }
              className="h-9 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors disabled:cursor-not-allowed disabled:text-slate-300 enabled:hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActiveDisruptions = ({ onSelectCase, refreshToken }) => {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPageCases, setCurrentPageCases] = useState(1);
  const PAGE_SIZE_CASES = 8;
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    mockApiService.fetchTransactions().then((data) => {
      if (!mounted) return;
      const queue = data
        .filter(
          (txn) =>
            txn.status === "FROZEN" ||
            (txn.is_fraud_network && txn.status === "HIGH RISK")
        )
        .sort((a, b) => {
          const pA = a.status === "FROZEN" ? 0 : 1;
          const pB = b.status === "FROZEN" ? 0 : 1;
          if (pA !== pB) return pA - pB;
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
      setCases(queue);
      setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [refreshToken]);
  const totalPagesCases = Math.max(
    1,
    Math.ceil(cases.length / PAGE_SIZE_CASES)
  );
  const paginatedCases = cases.slice(
    (currentPageCases - 1) * PAGE_SIZE_CASES,
    currentPageCases * PAGE_SIZE_CASES
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Authorization Queue
          </h2>
          <p className="text-sm text-slate-600">
            Prioritized list of high-risk incidents awaiting human review.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-red-700">
          <AlertTriangle size={14} />
          {cases.length} active case{cases.length === 1 ? "" : "s"}
        </div>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            Scanning for active disruptions...
          </div>
        ) : cases.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No active incidents require review. The network is stable.
          </div>
        ) : (
          paginatedCases.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectCase?.(item)}
              className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-lg transition hover:border-red-600/40 hover:shadow-xl"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-red-600 font-semibold">
                    <ShieldAlert size={14} />
                    {item.status === "FROZEN"
                      ? "Awaiting Authorization"
                      : "AI Escalation"}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.id}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <ArrowRight size={14} className="text-slate-400" />
                      {item.source} → {item.destination}
                    </span>
                    <span className="inline-flex items-center gap-2 font-medium text-slate-800">
                      <ShieldCheck size={14} className="text-slate-400" />
                      {NGN_FORMATTER.format(item.amount)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-red-100 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-red-700">
                    {item.status}
                  </div>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-600">
                    GNN {item.gnnScore.toFixed(2)}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      {cases.length > PAGE_SIZE_CASES && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={() => setCurrentPageCases((prev) => Math.max(prev - 1, 1))}
            disabled={currentPageCases === 1}
            className="h-9 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors disabled:cursor-not-allowed disabled:text-slate-300 enabled:hover:bg-slate-100"
          >
            Previous
          </button>
          <span className="text-xs text-slate-500">
            Page {currentPageCases} of {totalPagesCases}
          </span>
          <button
            onClick={() =>
              setCurrentPageCases((prev) => Math.min(prev + 1, totalPagesCases))
            }
            disabled={currentPageCases === totalPagesCases}
            className="h-9 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors disabled:cursor-not-allowed disabled:text-slate-300 enabled:hover:bg-slate-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const MiniGNNVisualizer = ({ transaction }) => {
  const nodes = useMemo(() => {
    if (!transaction) return [];
    return [
      { id: transaction.source, x: 50, y: 100 },
      { id: transaction.destination, x: 250, y: 100, isExit: true },
      { id: "...", x: 150, y: 200 },
    ];
  }, [transaction]);
  const edges = useMemo(() => {
    if (!transaction) return [];
    return [
      { from: transaction.source, to: transaction.destination },
      { from: "...", to: transaction.source },
    ];
  }, [transaction]);
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 250">
      {edges.map((edge, i) => {
        const from = nodes.find((n) => n.id === edge.from);
        const to = nodes.find((n) => n.id === edge.to);
        if (!from || !to) return null;
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#dc2626"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
        );
      })}
      {nodes.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r={node.isExit ? 20 : 16}
            fill={node.isExit ? "#DC2626" : "#4B5563"}
            stroke="#FFF"
            strokeWidth="2"
          />
          <text
            x={node.x}
            y={node.y + 30}
            textAnchor="middle"
            fontSize="10"
            fill="#FFFFFF"
            fontWeight="600"
          >
            {node.id}
          </text>
        </g>
      ))}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#DC2626" />
        </marker>
      </defs>
    </svg>
  );
};

const GNNGraph = ({ nodes = [], edges = [] }) => {
  const nodeTypes = useMemo(
    () => ({
      gnnNode: ({ data }) => (
        <div
          className={`rounded-full px-4 py-2 text-xs font-semibold shadow-lg shadow-slate-900/40 ${
            data.isExit
              ? "bg-red-600 text-white"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          {data.label}
        </div>
      ),
    }),
    []
  );

  const flowNodes = useMemo(
    () =>
      nodes.map((node) => ({
        id: node.id,
        data: node.data,
        position: node.position,
        type: "gnnNode",
      })),
    [nodes]
  );

  const flowEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: "#dc2626" },
        style: { stroke: "#dc2626", strokeWidth: 1.5 },
      })),
    [edges]
  );

  if (!nodes.length) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        Awaiting network activity…
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={flowNodes}
      edges={flowEdges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      panOnScroll={false}
      zoomOnScroll={false}
      proOptions={{ hideAttribution: true }}
      className="rounded-xl bg-slate-950/80"
      style={{ width: "100%", height: "100%" }}
    >
      <Background gap={24} color="#1e293b" />
      <Controls showZoom={false} showFitView position="bottom-right" />
    </ReactFlow>
  );
};

const CaseReviewModal = ({
  open,
  caseData,
  onClose,
  onAuthorize,
  onRelease,
  isProcessing,
  errorMessage,
}) => {
  if (!open || !caseData) return null;
  const cdtReport = {
    regulatoryPenaltyValue: NGN_FORMATTER.format(caseData.gnnScore * 900000000),
    reputationalDamageScore: `${(caseData.gnnScore * 10).toFixed(
      1
    )}/10 (Critical)`,
  };
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 py-10 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative grid w-full max-w-6xl grid-cols-1 gap-0 rounded-3xl border border-slate-300 bg-white shadow-2xl overflow-hidden md:grid-cols-[1.2fr_0.9fr]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 z-50"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div className="space-y-6 p-8 overflow-y-auto max-h-[80vh] dashboard-scroll">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              Evidence Summary: {caseData.id}
            </h3>
            <p className="text-sm text-slate-600">
              AI-surfaced intelligence supporting this freeze.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Nexus map visualizer
            </p>
            <div className="mt-3 h-40 rounded-xl bg-slate-900">
              <MiniGNNVisualizer transaction={caseData} />
            </div>
          </div>
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Consequence report (CDT)
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="font-medium">
                  Regulatory Penalty Value:{" "}
                  <span className="font-bold text-red-600">
                    {cdtReport.regulatoryPenaltyValue}
                  </span>
                </li>
                <li className="font-medium">
                  Reputational Damage Score:{" "}
                  <span className="font-bold text-yellow-600">
                    {cdtReport.reputationalDamageScore}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Transaction details
              </p>
              <dl className="mt-3 space-y-2 text-sm text-slate-700">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Amount</dt>
                  <dd className="font-semibold text-slate-900">
                    {NGN_FORMATTER.format(caseData.amount)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Route</dt>
                  <dd>
                    {caseData.source} → {caseData.destination}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Status</dt>
                  <dd className="font-medium text-red-600">
                    {caseData.status}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Freeze time</dt>
                  <dd>{new Date(caseData.timestamp).toLocaleString()}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Device ID</dt>
                  <dd className="font-mono">{caseData.deviceFingerprint}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 rounded-l-3xl bg-slate-50 p-8 border-l border-slate-200">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              Cognitive Compliance Narrative (CCN™)
            </h3>
            <p className="text-sm text-slate-600">
              Regulator-ready memo justifying the freeze.
            </p>
          </div>
          <div className="dashboard-scroll flex-1 max-h-72 overflow-auto rounded-xl border border-slate-200 bg-slate-800 p-4 text-xs leading-relaxed text-white/80">
            <pre className="whitespace-pre-wrap font-mono">
              {mockApiService.MOCK_CCN_REPORT(caseData)}
            </pre>
          </div>
          <div className="space-y-3 pt-4">
            <button
              onClick={onAuthorize}
              disabled={isProcessing}
              className={`flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg shadow-red-600/30 transition ${
                isProcessing
                  ? "cursor-not-allowed opacity-70"
                  : "hover:bg-red-700"
              }`}
            >
              <CheckCircle size={16} />
              {isProcessing ? "Processing…" : "Authorize Formal Hold"}
            </button>
            <button
              onClick={onRelease}
              disabled={isProcessing}
              className={`flex w-full items-center justify-center gap-2 rounded-full bg-slate-200 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-slate-700 transition ${
                isProcessing
                  ? "cursor-not-allowed opacity-60"
                  : "hover:bg-slate-300"
              }`}
            >
              <Undo2 size={16} />
              Release Funds
            </button>
            {errorMessage && (
              <p className="text-xs text-red-600 text-center">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NexusMapVisualizer = ({ refreshToken }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [stats, setStats] = useState({
    accounts: 0,
    edges: 0,
    density: "0.00",
  });
  const nodeTypes = useMemo(
    () => ({
      custom: ({ data }) => (
        <div
          className={`group/node relative p-2 px-4 rounded-full shadow-md text-xs font-semibold ${
            data.isExit
              ? "bg-red-600 text-white animate-pulse"
              : "bg-white text-slate-800 border border-slate-300"
          }`}
        >
          {data.label}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-xs rounded-md p-2 opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none z-10">
            <strong>Account:</strong> {data.label}
            <br />
            <strong>Status:</strong>{" "}
            {data.isExit ? "Predicted Exit Point" : "Mule Account"}
          </div>
        </div>
      ),
    }),
    []
  );
  useEffect(() => {
    mockApiService.fetchTransactions().then((data) => {
      const fraudTxns = data.filter((t) => t.is_fraud_network);
      const accountSet = new Set();
      fraudTxns.forEach((t) => {
        accountSet.add(t.source);
        accountSet.add(t.destination);
      });
      const initialNodes = Array.from(accountSet).map((acc, i) => ({
        id: acc,
        position: {
          x: (i % 4) * 250 + Math.random() * 50,
          y: Math.floor(i / 4) * 150 + Math.random() * 50,
        },
        data: { label: acc, isExit: acc === "ACC_EXIT_POINT" },
        type: "custom",
      }));
      const initialEdges = fraudTxns.map((t) => ({
        id: t.id,
        source: t.source,
        target: t.destination,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: "#dc2626" },
        style: { stroke: "#dc2626", strokeWidth: 1.5 },
      }));
      setNodes(initialNodes);
      setEdges(initialEdges);
      setStats({
        accounts: accountSet.size,
        edges: fraudTxns.length,
        density: (fraudTxns.length / accountSet.size).toFixed(2),
        fraudNodes: accountSet.size,
      });
    });
  }, [refreshToken]);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Nexus Map Visualizer
        </h2>
        <p className="text-sm text-slate-600">
          Forensic graph analysis of high-risk transaction networks.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Active Network Accounts"
          value={stats.accounts}
          icon={Users}
        />
        <KpiCard
          title="High-Risk Connections"
          value={stats.edges}
          icon={Waypoints}
        />
        <KpiCard
          title="Identified Fraud Nodes"
          value={stats.fraudNodes}
          icon={AlertTriangle}
          colorClass="text-red-600"
        />
        <KpiCard title="Network Density" value={stats.density} icon={Zap} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg h-[60vh]">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
          Live Network Graph
        </p>
        <GNNGraph nodes={nodes} edges={edges} />
      </div>
    </div>
  );
};

const AuditLogsPage = ({ refreshToken }) => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    mockApiService.fetchTransactions().then((data) => {
      if (!active) return;
      const entries = data.slice(0, 30).map((txn) => ({
        id: `${txn.id}-${txn.timestamp}`,
        timestamp: txn.timestamp,
        actor: txn.is_fraud_network ? "AI Sentinel" : "Risk Engine",
        status: txn.status,
        message:
          txn.status === "FROZEN"
            ? `Escalated freeze on ${txn.destination}`
            : txn.status === "HIGH RISK"
            ? `Flagged anomaly on route ${txn.source} → ${txn.destination}`
            : `Cleared transaction ${txn.id}`,
      }));
      setLogs(entries);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [refreshToken]);

  const getStatusPill = (status) => {
    switch (status) {
      case "FROZEN":
        return "bg-red-100 text-red-700";
      case "HIGH RISK":
        return "bg-yellow-100 text-yellow-700";
      case "AUTHORIZED HOLD":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-emerald-100 text-emerald-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-slate-900">
          Audit & Compliance Logs
        </h2>
        <p className="text-sm text-slate-600">
          Immutable event trail generated by the Cognitive Compliance Narrative
          engine.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Last 30 events
          </span>
          <span className="text-xs text-slate-500">
            {logs.length} records • auto-refreshed on action
          </span>
        </header>
        <div className="dashboard-scroll max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-sm text-slate-500">
              Reconstructing compliance trail…
            </div>
          ) : logs.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No audit events generated in the current window.
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {logs.map((log) => (
                <li key={log.id} className="flex items-start gap-4 px-6 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900/90 text-xs font-semibold uppercase tracking-widest text-white">
                    {log.actor === "AI Sentinel" ? "AI" : "RE"}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {log.message}
                      </p>
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold ${getStatusPill(
                          log.status
                        )}`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {formatRelativeTime(log.timestamp)} • {log.actor}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Portal Settings</h2>
      <p className="text-sm text-slate-600">
        Manage your preferences and workspace configuration.
      </p>
    </div>
    <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 space-y-6 shadow-lg">
      <div className="flex items-center justify-between">
        <label htmlFor="notifications" className="font-semibold text-slate-700">
          Email Notifications
        </label>
        <input
          type="checkbox"
          id="notifications"
          className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
          defaultChecked
        />
      </div>
      <div className="flex items-center justify-between">
        <label htmlFor="auto-refresh" className="font-semibold text-slate-700">
          Auto-Refresh Dashboard
        </label>
        <input
          type="checkbox"
          id="auto-refresh"
          className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
          defaultChecked
        />
      </div>
      <div className="flex items-center justify-between">
        <label htmlFor="theme" className="font-semibold text-slate-400">
          Dark Mode (Coming Soon)
        </label>
        <input
          type="checkbox"
          id="theme"
          className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
          disabled
        />
      </div>
    </div>
  </div>
);

// --- MAIN PORTAL SHELL ---
const ManagerPortal = ({ user, onLogout }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedCase, setSelectedCase] = useState(null);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [caseProcessing, setCaseProcessing] = useState(false);
  const [caseError, setCaseError] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);
  const handleSelectCase = (txn, navigateToQueue = false) => {
    setSelectedCase(txn);
    setIsCaseModalOpen(true);
    if (navigateToQueue) setActivePage("disruptions");
  };
  const handleCloseCase = () => {
    setIsCaseModalOpen(false);
    setCaseError("");
    setRefreshToken((p) => p + 1);
  };
  const handleCaseDecision = async (action) => {
    if (!selectedCase) return;
    setCaseProcessing(true);
    setCaseError("");
    try {
      const updated =
        action === "authorize"
          ? await mockApiService.authorizeHold(selectedCase.id)
          : await mockApiService.releaseFunds(selectedCase.id);
      setSelectedCase(updated);
      setTimeout(() => {
        handleCloseCase();
        setCaseProcessing(false);
      }, 1000);
    } catch (error) {
      setCaseError("Unable to log the decision. Please retry.");
      setCaseProcessing(false);
    }
  };
  const pageTitles = {
    dashboard: "Operational Dashboard",
    disruptions: "Active Disruptions",
    map: "Nexus Map Visualizer",
    logs: "Audit & Compliance Logs",
    settings: "Portal Settings",
  };
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <OperationalDashboard
            onViewDetails={(txn) => handleSelectCase(txn, true)}
          />
        );
      case "disruptions":
        return (
          <ActiveDisruptions
            onSelectCase={(txn) => handleSelectCase(txn, false)}
            refreshToken={refreshToken}
          />
        );
      case "map":
        return <NexusMapVisualizer refreshToken={refreshToken} />;
      case "logs":
        return <AuditLogsPage refreshToken={refreshToken} />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <OperationalDashboard
            onViewDetails={(txn) => handleSelectCase(txn, true)}
          />
        );
    }
  };
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans text-slate-900">
      <GlobalStyles />
      <nav
        className={`z-20 flex flex-col border-r border-black/10 bg-slate-900 transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? "w-64" : "w-20"
        }`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="flex h-20 shrink-0 items-center justify-center gap-3 border-b border-white/10 px-2">
          <img
            src={logo}
            alt="Nexus Disrupt logo"
            className={`h-10 w-10 rounded-full bg-white/90 object-cover shadow transition-transform duration-200 ${
              !isSidebarExpanded ? "scale-105" : "scale-100"
            }`}
          />
          <span
            className={`whitespace-nowrap text-xl font-bold text-white transition-all duration-200 ${
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
            icon={<ShieldAlert size={20} />}
            text="Disruptions"
            isExpanded={isSidebarExpanded}
            active={activePage === "disruptions"}
            onClick={() => setActivePage("disruptions")}
          />
          <NavItem
            icon={<Waypoints size={20} />}
            text="GNN Map"
            isExpanded={isSidebarExpanded}
            active={activePage === "map"}
            onClick={() => setActivePage("map")}
          />
          <NavItem
            icon={<FileText size={20} />}
            text="Audit Logs"
            isExpanded={isSidebarExpanded}
            active={activePage === "logs"}
            onClick={() => setActivePage("logs")}
          />
        </ul>
        <div className="border-t border-white/10 p-4">
          <NavItem
            icon={<Settings size={20} />}
            text="Settings"
            isExpanded={isSidebarExpanded}
            active={activePage === "settings"}
            onClick={() => setActivePage("settings")}
          />
          <button
            onClick={onLogout}
            className="mt-2 flex h-12 w-full items-center rounded-lg px-4 text-slate-300 transition-colors hover:bg-red-600/20 hover:text-red-600"
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
      <main className="dashboard-scroll flex-1 overflow-y-auto bg-slate-100">
        <div className="relative min-h-full">
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-red-600/5 blur-3xl"></div>
            <div className="absolute right-[-12%] top-10 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"></div>
          </div>
          <div className="relative z-10 pb-16">
            <PortalNavbar
              user={user?.email}
              onLogout={onLogout}
              title={pageTitles[activePage] || "Operational Dashboard"}
            />
            <div className="p-8">{renderPage()}</div>
          </div>
        </div>
      </main>
      <CaseReviewModal
        open={isCaseModalOpen}
        caseData={selectedCase}
        onClose={handleCloseCase}
        onAuthorize={() => handleCaseDecision("authorize")}
        onRelease={() => handleCaseDecision("release")}
        isProcessing={caseProcessing}
        errorMessage={caseError}
      />
    </div>
  );
};

export default ManagerPortal;
