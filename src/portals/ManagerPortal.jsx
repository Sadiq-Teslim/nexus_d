// src/portals/ManagerPortal.jsx
import React, { useState, useEffect, useMemo } from "react";
import ReactFlow, { Controls, Background, MarkerType } from "reactflow";
import "reactflow/dist/style.css"; // Required styles for React Flow

import {
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  GitBranch,
  FileText,
  Settings,
  AlertTriangle,
  ArrowRight,
  Clock,
  ShieldCheck,
  X,
  CheckCircle,
  Undo2,
} from "lucide-react";
import {
  fetchTransactions,
  authorizeHold,
  releaseFunds,
  MOCK_CCN_REPORT,
} from "../services/mockApiService";
import PortalNavbar from "../components/PortalNavbar.jsx";
import "./ManagerPortal.css";

// Utility & reusable UI components

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
    return `${value} minute${value === 1 ? "" : "s"} ago`;
  }
  if (diff < day) {
    const value = Math.floor(diff / hour);
    return `${value} hour${value === 1 ? "" : "s"} ago`;
  }
  const value = Math.floor(diff / day);
  return `${value} day${value === 1 ? "" : "s"} ago`;
};

const KpiCard = ({ title, value }) => (
  <div className="rounded-2xl border border-white/15 bg-black/60 p-6 backdrop-blur-xl">
    <p className="mb-2 text-sm text-white/60">{title}</p>
    <p className="text-3xl font-bold text-white">{value}</p>
  </div>
);

const FilterButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
      active
        ? "bg-zenithRed text-white shadow-lg shadow-zenithRed/20"
        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
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

// Graph & page components

// 1. GNN Graph Component
const GNNGraph = ({ nodes, edges }) => (
  <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-tr from-[#31050c] via-[#110307] to-[#050304]">
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      proOptions={{ hideAttribution: true }}
    >
      <Controls
        showInteractive={false}
        className="[&>button]:bg-white/10 [&>button]:border-none [&>button:hover]:bg-white/20"
      />
      <Background
        variant="dots"
        gap={20}
        size={1}
        color="rgba(255, 255, 255, 0.1)"
      />
    </ReactFlow>
  </div>
);

// 2. Operational Dashboard Page
const OperationalDashboard = ({ onViewDetails }) => {
  const [transactions, setTransactions] = useState([]);
  const [streamedTransactions, setStreamedTransactions] = useState([]);
  const [kpiStats, setKpiStats] = useState({ secured: 0, disruptions: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchTransactions().then(setTransactions);
  }, []);

  useEffect(() => {
    if (!transactions.length) return;
    setStreamedTransactions([]);
    setKpiStats({ secured: 0, disruptions: 0 });
    let i = 0;
    const interval = setInterval(() => {
      setStreamedTransactions((prev) => {
        if (i >= transactions.length) {
          clearInterval(interval);
          return prev;
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
          }));
        }
        setCurrentPage(1);
        return [nextTxn, ...prev];
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
      if (amountFilter !== "all") {
        if (amountFilter === "lt100k" && txn.amount >= 100000) return false;
        if (
          amountFilter === "100-500" &&
          (txn.amount < 100000 || txn.amount > 500000)
        )
          return false;
        if (amountFilter === "gt500" && txn.amount <= 500000) return false;
      }
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
    amountFilter,
    timeFilter,
    searchTerm,
  ]);

  const { activeFiltersCount, activeFilterLabels } = useMemo(() => {
    const labels = [];
    if (statusFilter !== "all") labels.push(`Status: ${statusFilter}`);
    if (networkFilter !== "all")
      labels.push(networkFilter === "fraud" ? "Fraud Network" : "Legitimate");
    if (amountFilter !== "all") {
      labels.push(
        `Amount: ${
          amountFilter === "lt100k"
            ? "< 100k"
            : amountFilter === "100-500"
            ? "100k-500k"
            : "> 500k"
        }`
      );
    }
    if (timeFilter !== "all") {
      labels.push(
        timeFilter === "last15"
          ? "Last 15m"
          : timeFilter === "last60"
          ? "Last 1h"
          : "Last 24h"
      );
    }
    return { activeFiltersCount: labels.length, activeFilterLabels: labels };
  }, [statusFilter, networkFilter, amountFilter, timeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / PAGE_SIZE)
  );
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, networkFilter, amountFilter, timeFilter, searchTerm]);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getStatusClasses = (status) => {
    switch (status) {
      case "HIGH RISK":
        return "bg-yellow-500/10 text-yellow-400";
      case "FROZEN":
        return "bg-zenithRed/20 text-zenithRed";
      case "AUTHORIZED HOLD":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-white/5 text-white/60";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Funds Secured"
          value={`NGN ${kpiStats.secured.toLocaleString()}`}
        />
        <KpiCard title="Active Disruptions" value={kpiStats.disruptions} />
        <KpiCard title="AI False Positive Rate" value="0.12%" />
        <KpiCard title="Avg. Disruption Time" value="280ms" />
      </div>
      <div
        className={`rounded-3xl border border-white/10 bg-black/40 px-4 md:px-6 backdrop-blur-xl shadow-[0_30px_60px_-40px_rgba(0,0,0,0.8)] ${
          filtersOpen ? "py-5" : "py-3"
        }`}
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className={`flex-1 ${filtersOpen ? "space-y-4" : "space-y-2"}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                  Transaction filters
                </p>
                <p className="text-xs text-white/60">
                  {activeFiltersCount > 0
                    ? activeFilterLabels.join(" • ")
                    : "No filters applied"}
                </p>
              </div>
              <button
                onClick={() => setFiltersOpen((p) => !p)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                  filtersOpen
                    ? "bg-white/10 text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {filtersOpen ? "Hide" : "Show"} Filters
                {activeFiltersCount > 0 && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zenithRed text-[10px] font-bold text-white">
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
                    { label: "Authorized Hold", value: "AUTHORIZED HOLD" },
                    { label: "OK", value: "OK" },
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
                    { label: "All amounts", value: "all" },
                    { label: "< 100k", value: "lt100k" },
                    { label: "100k-500k", value: "100-500" },
                    { label: "> 500k", value: "gt500" },
                  ].map((o) => (
                    <FilterButton
                      key={o.value}
                      active={amountFilter === o.value}
                      onClick={() => setAmountFilter(o.value)}
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
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50"
            >
              Search transactions
            </label>
            <div className="rounded-full border border-white/10 bg-black/60 px-4 py-2 focus-within:border-zenithRed focus-within:ring-2 focus-within:ring-zenithRed/30">
              <input
                id="tx-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ID, account, device, amount..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/15 bg-black/50 p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        <h3 className="mb-4 text-xl font-semibold text-white">
          Real-Time Transaction Feed
        </h3>
        <div className="dashboard-scroll overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/10">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-400">
                  Timestamp
                </th>
                <th className="p-4 text-sm font-semibold text-gray-400">
                  Source
                </th>
                <th className="p-4 text-sm font-semibold text-gray-400">
                  Destination
                </th>
                <th className="p-4 text-sm font-semibold text-gray-400">
                  Amount
                </th>
                <th className="p-4 text-sm font-semibold text-gray-400">
                  GNN Score
                </th>
                <th className="p-4 text-sm font-semibold text-gray-400">
                  Status
                </th>
                <th className="p-4 text-sm font-semibold text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-6 text-center text-sm text-gray-500"
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
                    className="border-b border-white/5 transition-colors hover:bg-white/5"
                  >
                    <td className="p-4 text-sm text-gray-300">
                      {new Date(txn.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-300">
                      {txn.source}
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-300">
                      {txn.destination}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-300">
                      NGN {txn.amount.toLocaleString()}
                    </td>
                    <td
                      className={`p-4 font-mono text-sm font-semibold ${
                        txn.gnnScore > 0.9 ? "text-zenithRed" : "text-green-400"
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
                        className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-zenithRed/80 hover:text-white"
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
          <p className="text-xs text-gray-500">
            {filteredTransactions.length === 0
              ? "No results"
              : `Showing ${paginatedTransactions.length} of ${filteredTransactions.length} transactions`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || filteredTransactions.length === 0}
              className={`h-9 rounded-lg px-3 text-sm font-medium transition-colors ${
                currentPage === 1 || filteredTransactions.length === 0
                  ? "cursor-not-allowed bg-white/5 text-white/40"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              Previous
            </button>
            <span className="text-xs text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={
                currentPage === totalPages || filteredTransactions.length === 0
              }
              className={`h-9 rounded-lg px-3 text-sm font-medium transition-colors ${
                currentPage === totalPages || filteredTransactions.length === 0
                  ? "cursor-not-allowed bg-white/5 text-white/40"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
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
  useEffect(() => { setCurrentPageCases(1); }, [cases]);
  const totalPagesCases = Math.max(1, Math.ceil(cases.length / PAGE_SIZE_CASES));
  const startCase = (currentPageCases - 1) * PAGE_SIZE_CASES;
  const endCase = startCase + PAGE_SIZE_CASES;
  const paginatedCases = cases.slice(startCase, endCase);
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetchTransactions().then((data) => {
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
          return b.amount - a.amount;
        });
      setCases(queue);
      setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [refreshToken]);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Authorization Queue
          </h2>
          <p className="text-sm text-white/60">
            Prioritized list of high-risk incidents awaiting human review.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
          <AlertTriangle size={14} className="text-zenithRed" />
          {cases.length} active case{cases.length === 1 ? "" : "s"}
        </div>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-sm text-white/60">
            Scanning for active disruptions...
          </div>
        ) : cases.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-sm text-white/60">
            No active incidents require review. The network is stable.
          </div>
        ) : (
          paginatedCases.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectCase?.(item)}
              className="group w-full rounded-3xl border border-white/10 bg-black/45 p-5 text-left transition hover:border-zenithRed/40 hover:bg-black/60"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-zenithRed">
                    <ShieldAlert size={14} />
                    {item.status === "FROZEN"
                      ? "Awaiting Authorization"
                      : "AI Escalation"}
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {item.id}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                    <span className="inline-flex items-center gap-2">
                      <ArrowRight size={14} className="text-white/40" />
                      {item.source} → {item.destination}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck size={14} className="text-white/40" />
                      NGN {item.amount.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock size={14} className="text-white/40" />
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-zenithRed/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-zenithRed">
                    {item.status}
                  </div>
                  <div className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                    GNN {item.gnnScore.toFixed(2)}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
        {/* pagination controls for queue */}
        {cases.length > PAGE_SIZE_CASES && (
          <div className="mt-2 flex items-center justify-end gap-2">
            <button onClick={() => setCurrentPageCases(prev => Math.max(prev - 1, 1))} disabled={currentPageCases === 1} className={`h-9 rounded-lg px-3 text-sm font-medium ${currentPageCases === 1 ? 'cursor-not-allowed bg-white/5 text-white/40' : 'bg-white/15 text-white hover:bg-white/25'}`}>Previous</button>
            <span className="text-xs text-gray-400">Page {currentPageCases} of {totalPagesCases}</span>
            <button onClick={() => setCurrentPageCases(prev => Math.min(prev + 1, totalPagesCases))} disabled={currentPageCases === totalPagesCases} className={`h-9 rounded-lg px-3 text-sm font-medium ${currentPageCases === totalPagesCases ? 'cursor-not-allowed bg-white/5 text-white/40' : 'bg-white/15 text-white hover:bg-white/25'}`}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

const MiniGNNVisualizer = ({ transaction }) => {
  // Render a focused ReactFlow subgraph centered on the transaction's account
  const [localNodes, setLocalNodes] = useState([]);
  const [localEdges, setLocalEdges] = useState([]);

  useEffect(() => {
    let mounted = true;
    if (!transaction) {
      setLocalNodes([]);
      setLocalEdges([]);
      return;
    }
    const acct = transaction.source || transaction.destination;
    fetchTransactions().then((all) => {
      if (!mounted) return;
      // build a small subgraph of transactions involving the account (and their immediate neighbors)
      const related = all.filter((t) => t.source === acct || t.destination === acct);
      const neighbors = new Set();
      related.forEach((t) => {
        neighbors.add(t.source);
        neighbors.add(t.destination);
      });

      const nodesArr = Array.from(neighbors);
      const nodes = nodesArr.map((id, i) => ({
        id,
        position: { x: 50 + (Math.cos((i / nodesArr.length) * Math.PI * 2) * 40), y: 50 + (Math.sin((i / nodesArr.length) * Math.PI * 2) * 40) },
        data: { label: id },
        style: {
          minWidth: 90,
          padding: 6,
          fontSize: 12,
          background: id === acct ? '#0ea5e9' : '#111827',
          color: 'white',
          border: id === acct ? '2px solid #60a5fa' : 'none',
        },
      }));

      const edges = related.map((t) => ({
        id: `e-${t.id}`,
        source: t.source,
        target: t.destination,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#60a5fa' },
        style: { stroke: '#60a5fa', strokeWidth: 1 },
      }));

      setLocalNodes(nodes);
      setLocalEdges(edges);
    });
    return () => { mounted = false; };
  }, [transaction]);

  if (!transaction) return null;

  return (
    <div className="w-full h-40 rounded-md overflow-hidden bg-black/60">
      {localNodes.length === 0 ? (
        <div className="h-full flex items-center justify-center text-xs text-white/60">No graph data available</div>
      ) : (
        <ReactFlow nodes={localNodes} edges={localEdges} fitView attributionPosition="bottom-left">
          <Background variant="dots" gap={12} size={1} color="rgba(255,255,255,0.03)" />
          <Controls showInteractive={false} />
        </ReactFlow>
      )}
    </div>
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
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 py-10 backdrop-blur-md">
      <div className="relative grid w-full max-w-6xl grid-cols-1 gap-6 rounded-3xl border border-white/15 bg-[#0d0507]/95 p-8 shadow-[0_60px_120px_-50px_rgba(0,0,0,0.9)] md:grid-cols-[1.2fr_0.9fr]">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white/70 transition hover:bg-white/20"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Evidence Summary
            </h3>
            <p className="text-sm text-white/60">
              AI surfaced intelligence supporting this freeze.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              Nexus map visualizer
            </p>
            <div className="mt-3 h-40 rounded-xl bg-gradient-to-br from-[#2b0e14] via-[#160608] to-[#0a0204]">
              <MiniGNNVisualizer transaction={caseData} />
            </div>
          </div>
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                Consequence report (CDT)
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>
                  Regulatory Penalty Value:{" "}
                  {caseData.cdt?.regulatoryPenaltyValue
                    ? `NGN ${caseData.cdt.regulatoryPenaltyValue.toLocaleString()}`
                    : "—"}
                </li>
                <li>
                  Reputational Damage Score:{" "}
                  {caseData.cdt?.reputationalDamageScore ?? "—"}
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                Transaction details
              </p>
              <dl className="mt-3 space-y-2 text-sm text-white/70">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Amount</dt>
                  <dd className="font-semibold text-white">
                    NGN {caseData.amount.toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Route</dt>
                  <dd>
                    {caseData.source} → {caseData.destination}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Status</dt>
                  <dd>{caseData.status}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Freeze time</dt>
                  <dd>{new Date(caseData.timestamp).toLocaleString()}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Device ID</dt>
                  <dd>{caseData.deviceFingerprint}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-black/40 p-5">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Cognitive Compliance Narrative
            </h3>
            <p className="text-sm text-white/60">
              Regulator-ready memo justifying the freeze.
            </p>
          </div>
          <div className="dashboard-scroll max-h-72 overflow-auto rounded-xl border border-white/10 bg-black/60 p-4 text-xs leading-relaxed text-white/70">
            <pre className="whitespace-pre-wrap font-sans">
              {MOCK_CCN_REPORT}
            </pre>
          </div>
          <div className="space-y-3">
            <button
              onClick={onAuthorize}
              disabled={isProcessing}
              className={`flex w-full items-center justify-center gap-2 rounded-full bg-zenithRed px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition ${
                isProcessing
                  ? "cursor-not-allowed opacity-70"
                  : "hover:brightness-110"
              }`}
            >
              <CheckCircle size={16} />
              {isProcessing ? "Processing…" : "Authorize Formal Hold"}
            </button>
            <button
              onClick={onRelease}
              disabled={isProcessing}
              className={`flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition ${
                isProcessing
                  ? "cursor-not-allowed opacity-60"
                  : "hover:bg-white/20"
              }`}
            >
              <Undo2 size={16} />
              Release Funds
            </button>
            {errorMessage && (
              <p className="text-xs text-zenithRed">{errorMessage}</p>
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
  // richer account metadata for tooltips / hover details
  const [topAccounts, setTopAccounts] = useState([]);
  const nodeTypes = useMemo(
    () => ({
      custom: ({ data }) => (
        <div
          className={`group/node relative p-2 px-4 rounded-full shadow-md text-sm font-medium ${
            data.isExit
              ? "bg-zenithRed text-white animate-pulse"
              : "bg-black text-white"
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
    fetchTransactions().then((data) => {
      const fraudTxns = data.filter((t) => t.is_fraud_network);

      // build per-account stats: counts, totalVolume, lastSeen, sample txns and counterparties
      const accountStats = new Map();
      fraudTxns.forEach((t) => {
        [t.source, t.destination].forEach((acc, idx) => {
          if (!accountStats.has(acc)) {
            accountStats.set(acc, {
              account: acc,
              count: 0,
              totalVolume: 0,
              lastSeen: 0,
              counterparts: new Map(),
              sampleTxns: [],
            });
          }
          const s = accountStats.get(acc);
          s.count += 1;
          s.totalVolume += t.amount;
          const ts = new Date(t.timestamp).getTime();
          if (ts > s.lastSeen) s.lastSeen = ts;
          const other = idx === 0 ? t.destination : t.source;
          s.counterparts.set(other, (s.counterparts.get(other) || 0) + 1);
          if (s.sampleTxns.length < 4)
            s.sampleTxns.push({
              id: t.id,
              route: `${t.source} → ${t.destination}`,
              amount: t.amount,
              timestamp: t.timestamp,
            });
        });
      });

      const accountSet = new Set(accountStats.keys());

      // nodes & edges for ReactFlow
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
        markerEnd: { type: MarkerType.ArrowClosed, color: "#d71e28" },
        style: { stroke: "#d71e28", strokeWidth: 1.5 },
      }));

      // build top accounts array sorted by count
      const top = Array.from(accountStats.values())
        .map((s) => ({
          account: s.account,
          count: s.count,
          totalVolume: s.totalVolume,
          lastSeen: s.lastSeen,
          topCounterparties: Array.from(s.counterparts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([acc, c]) => ({ acc, count: c })),
          sampleTxns: s.sampleTxns,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 12);

      setNodes(initialNodes);
      setEdges(initialEdges);
      setStats({
        accounts: accountSet.size,
        edges: fraudTxns.length,
        density: accountSet.size
          ? (fraudTxns.length / accountSet.size).toFixed(2)
          : "0.00",
      });
      setTopAccounts(top);
    });
  }, [refreshToken]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Nexus Map Visualizer
        </h2>
        <p className="text-sm text-white/60">
          Forensic graph analysis of high-risk transaction networks.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Active Network Accounts" value={stats.accounts} />
        <KpiCard title="High-Risk Connections" value={stats.edges} />
        <KpiCard title="Identified Fraud Nodes" value={stats.accounts} />
        <KpiCard title="Network Density" value={stats.density} />
      </div>
      {/* Top accounts list with hover tooltips showing richer details */}
      {topAccounts && topAccounts.length > 0 && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-4">
          {topAccounts.map((a) => (
            <div
              key={a.account}
              className="group relative rounded-2xl border border-white/10 bg-black/50 p-3 text-sm text-white"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold truncate">{a.account}</div>
                <div className="text-xs text-white/60 ml-2">{a.count}</div>
              </div>
              <div className="mt-2 text-xs text-white/50">Total: NGN {a.totalVolume.toLocaleString()}</div>

              <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 mt-2 w-64 rounded-md bg-slate-800 p-3 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <div className="mb-1 font-semibold">Details</div>
                <div className="text-[11px] text-white/60">Last seen: {a.lastSeen ? new Date(a.lastSeen).toLocaleString() : '—'}</div>
                {a.topCounterparties && a.topCounterparties.length > 0 && (
                  <div className="mt-2">
                    <div className="text-[11px] text-white/60 mb-1">Top counterparties</div>
                    <ul className="space-y-1">
                      {a.topCounterparties.map((c) => (
                        <li key={c.acc} className="flex justify-between text-[11px]"><span>{c.acc}</span><span className="text-white/50">{c.count}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
                {a.sampleTxns && a.sampleTxns.length > 0 && (
                  <div className="mt-2">
                    <div className="text-[11px] text-white/60 mb-1">Recent txns</div>
                    <ul className="space-y-1 max-h-28 overflow-auto">
                      {a.sampleTxns.map((t) => (
                        <li key={t.id} className="text-[11px] text-white/70">{t.route} • NGN {t.amount.toLocaleString()}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-black/40 p-6 h-[60vh]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50 mb-4">
          Live Network Graph
        </p>
        <GNNGraph nodes={nodes} edges={edges} />
      </div>
    </div>
  );
};

const AuditLogsPage = ({ refreshToken }) => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageLogs, setCurrentPageLogs] = useState(1);
  const PAGE_SIZE_LOGS = 20;
  useEffect(() => {
    let mounted = true;
    fetchTransactions().then((data) => {
      if (!mounted) return;
      const entries = data.map((txn) => {
        let eventType = "Transaction";
        if (txn.status === "FROZEN") eventType = "AI Micro-Freeze Executed";
        else if (txn.status === "AUTHORIZED HOLD")
          eventType = "Human Authorization";
        else if (txn.is_fraud_network && txn.status === "HIGH RISK")
          eventType = "High-Risk Escalation";
        return {
          id: `${txn.id}-${txn.status}`,
          timestamp: txn.timestamp,
          description: `${eventType} for ${txn.id} | Route ${txn.source} → ${
            txn.destination
          } | NGN ${txn.amount.toLocaleString()}`,
          status: txn.status,
        };
      });
      setLogs(
        entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      );
    });
    return () => {
      mounted = false;
    };
  }, [refreshToken]);
  const filteredLogs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return logs;
    return logs.filter((log) => log.description.toLowerCase().includes(query));
  }, [logs, searchTerm]);
  const totalPagesLogs = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE_LOGS));
  useEffect(() => {
    if (currentPageLogs > totalPagesLogs) setCurrentPageLogs(totalPagesLogs);
  }, [currentPageLogs, totalPagesLogs]);
  useEffect(() => { setCurrentPageLogs(1); }, [filteredLogs]);
  const paginatedLogs = filteredLogs.slice((currentPageLogs - 1) * PAGE_SIZE_LOGS, currentPageLogs * PAGE_SIZE_LOGS);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Audit & Compliance Logs
          </h2>
          <p className="text-sm text-white/60">
            Immutable trace of AI actions and human interventions.
          </p>
        </div>
        <div className="w-full max-w-sm">
          <label
            htmlFor="log-search"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/50"
          >
            Search logs
          </label>
          <input
            id="log-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, route or status"
            className="w-full rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-zenithRed focus:outline-none"
          />
        </div>
      </div>
      <div className="space-y-3">
        {paginatedLogs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-sm text-white/60">
            No log entries match your criteria.
          </div>
        ) : (
          paginatedLogs.map((log) => (
            <div
              key={log.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm text-white">{log.description}</p>
                <p className="text-xs text-white/50">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                {log.status}
              </span>
            </div>
          ))
        )}
        {/* pagination controls for audit logs */}
        {filteredLogs.length > PAGE_SIZE_LOGS && (
          <div className="mt-2 flex items-center justify-end gap-2">
            <button onClick={() => setCurrentPageLogs(p => Math.max(p - 1, 1))} disabled={currentPageLogs === 1} className={`h-9 rounded-lg px-3 text-sm font-medium ${currentPageLogs === 1 ? 'cursor-not-allowed bg-white/5 text-white/40' : 'bg-white/15 text-white hover:bg-white/25'}`}>Previous</button>
            <span className="text-xs text-gray-400">Page {currentPageLogs} of {totalPagesLogs}</span>
            <button onClick={() => setCurrentPageLogs(p => Math.min(p + 1, totalPagesLogs))} disabled={currentPageLogs === totalPagesLogs} className={`h-9 rounded-lg px-3 text-sm font-medium ${currentPageLogs === totalPagesLogs ? 'cursor-not-allowed bg-white/5 text-white/40' : 'bg-white/15 text-white hover:bg-white/25'}`}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsPage = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-semibold text-white">Portal Settings</h2>
      <p className="text-sm text-white/60">
        Manage your preferences and workspace configuration.
      </p>
    </div>
    <div className="max-w-2xl rounded-2xl border border-white/10 bg-black/40 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <label htmlFor="notifications" className="font-semibold text-white">
          Email Notifications
        </label>
        <input
          type="checkbox"
          id="notifications"
          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-zenithRed focus:ring-zenithRed"
          defaultChecked
        />
      </div>
      <div className="flex items-center justify-between">
        <label htmlFor="auto-refresh" className="font-semibold text-white">
          Auto-Refresh Dashboard
        </label>
        <input
          type="checkbox"
          id="auto-refresh"
          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-zenithRed focus:ring-zenithRed"
          defaultChecked
        />
      </div>
      <div className="flex items-center justify-between">
        <label htmlFor="theme" className="font-semibold text-white/50">
          Light Mode (Coming Soon)
        </label>
        <input
          type="checkbox"
          id="theme"
          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-zenithRed focus:ring-zenithRed"
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
  };
  const handleCaseDecision = async (action) => {
    if (!selectedCase) return;
    setCaseProcessing(true);
    setCaseError("");
    try {
      const updated =
        action === "authorize"
          ? await authorizeHold(selectedCase.id)
          : await releaseFunds(selectedCase.id);
      setSelectedCase(updated);
      setRefreshToken((p) => p + 1);
    } catch (error) {
      setCaseError("Unable to log the decision. Please retry.");
    } finally {
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
            icon={<ShieldAlert size={20} />}
            text="Active Disruptions"
            isExpanded={isSidebarExpanded}
            active={activePage === "disruptions"}
            onClick={() => setActivePage("disruptions")}
          />
          <NavItem
            icon={<GitBranch size={20} />}
            text="Nexus Map"
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
        <div className="border-t border-white/10 p-6">
          <NavItem
            icon={<Settings size={20} />}
            text="Settings"
            isExpanded={isSidebarExpanded}
            active={activePage === "settings"}
            onClick={() => setActivePage("settings")}
          />
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
              title={pageTitles[activePage] || "Operational Dashboard"}
            />
            <div className="mt-4 space-y-6 px-6 pb-6 md:px-10">
              {renderPage()}
            </div>
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
