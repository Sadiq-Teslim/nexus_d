// src/portals/AdminPortal.jsx
import React, { useState, useEffect } from "react";
import logo from "../assets/nobglogo.png";
import {
  Plus,
  Trash2,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Wallet,
  X,
  ShieldCheck,
  Eye,
  Zap,
  Cpu,
  Calendar,
  Clock,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  Send,
  Play,
  Copy,
  RefreshCw,
  Loader,
  ArrowRight,
  Database,
  Server,
  Workflow,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const useAuth = () => ({ user: { email: "admin@premierbank.com" } });
const NGN_FORMAT = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
});

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
  subtitle,
  icon: Icon, // eslint-disable-line no-unused-vars
  colorClass = "text-slate-600",
  trend,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-500 mb-2">{title}</p>
        <p className={`text-3xl font-bold ${colorClass} mb-1`}>{value}</p>
        <p className="text-sm text-slate-400">{subtitle}</p>
        {trend && (
          <div
            className={`flex items-center gap-1 mt-2 text-xs ${trend > 0 ? "text-green-600" : "text-red-600"
              }`}
          >
            <TrendingUp
              size={12}
              className={trend < 0 ? "rotate-180" : ""}
            />
            <span>{Math.abs(trend)}% vs last month</span>
          </div>
        )}
      </div>
      <div className={`${colorClass} bg-slate-50 p-3 rounded-lg`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const NavItem = ({ icon, text, isExpanded, active, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`mx-auto flex h-12 w-full items-center rounded-lg transition-colors duration-200 ${isExpanded ? "px-4" : "justify-center px-0"
        } ${active
          ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
          : "text-slate-300 hover:bg-slate-700 hover:text-white"
        }`}
    >
      <span className="shrink-0">{icon}</span>
      <span
        className={`ml-4 text-sm font-medium transition-all duration-200 ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
          }`}
      >
        {text}
      </span>
    </button>
  </li>
);

const FraudCaseCard = ({ caseId, amount, similarity, timestamp, status }) => {
  const getColorByRisk = (sim) => {
    if (sim >= 80)
      return {
        bg: "bg-red-50",
        border: "border-red-300",
        text: "text-red-700",
        badge: "bg-red-600",
      };
    if (sim >= 50)
      return {
        bg: "bg-orange-50",
        border: "border-orange-300",
        text: "text-orange-700",
        badge: "bg-orange-500",
      };
    if (sim >= 20)
      return {
        bg: "bg-yellow-50",
        border: "border-yellow-300",
        text: "text-yellow-700",
        badge: "bg-yellow-500",
      };
    return {
      bg: "bg-green-50",
      border: "border-green-300",
      text: "text-green-700",
      badge: "bg-green-600",
    };
  };

  const colors = getColorByRisk(similarity);
  const getRiskLabel = (sim) => {
    if (sim >= 80) return "Critical";
    if (sim >= 50) return "High";
    if (sim >= 20) return "Medium";
    return "Low";
  };

  return (
    <div
      className={`${colors.bg} border ${colors.border} rounded-lg p-4 hover:shadow-md transition-all cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-sm text-slate-600">#{caseId}</p>
          <p className="text-lg font-bold text-slate-900 mt-1">
            {NGN_FORMAT.format(amount)}
          </p>
        </div>
        <div
          className={`${colors.badge} text-white px-3 py-1 rounded-full text-xs font-semibold`}
        >
          {similarity}% {getRiskLabel(similarity)}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>{new Date(timestamp).toLocaleString()}</span>
        {status === "blocked" ? (
          <CheckCircle size={16} className="text-green-600" />
        ) : (
          <XCircle size={16} className="text-red-600" />
        )}
      </div>
    </div>
  );
};

// --- MODAL COMPONENTS ---

const AddUserModal = ({ onAddUser, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Fraud Manager",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddUser({ id: `mgr-${Date.now()}`, ...form });
    onClose();
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 className="text-2xl font-bold text-slate-900">
            Provision New Manager
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-600"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm((s) => ({ ...s, name: e.target.value }))
              }
              placeholder="Adebayo Tunde"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              value={form.email}
              onChange={(e) =>
                setForm((s) => ({ ...s, email: e.target.value }))
              }
              placeholder="name@bank.com"
              type="email"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm((s) => ({ ...s, role: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
            >
              <option>Fraud Manager</option>
              <option>Lead Analyst</option>
              <option>Compliance Officer</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              <Plus size={16} />
              Grant Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LicenseCalculationModal = ({
  years,
  onYearsChange,
  onClose,
  onPurchase,
}) => {
  const BASE_PRICE = 10000000;
  const calculateDiscount = (years) => {
    if (years === 1) return 0;
    if (years === 2) return 0.05;
    if (years === 3) return 0.1;
    if (years >= 4 && years <= 5) return 0.15;
    if (years >= 6) return 0.2;
    return 0;
  };
  const baseTotal = BASE_PRICE * years;
  const discountRate = calculateDiscount(years);
  const discountAmount = baseTotal * discountRate;
  const finalPrice = baseTotal - discountAmount;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 className="text-2xl font-bold text-slate-900">
            License Pricing Calculator
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="mt-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-slate-700">
                Number of Years
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onYearsChange(Math.max(1, years - 1))}
                  className="rounded-full w-8 h-8 flex items-center justify-center border border-slate-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                >
                  <span className="text-lg">−</span>
                </button>
                <span className="text-2xl font-bold text-slate-900 w-12 text-center">
                  {years}
                </span>
                <button
                  onClick={() => onYearsChange(years + 1)}
                  className="rounded-full w-8 h-8 flex items-center justify-center border border-slate-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">
                Base Price ({years} {years === 1 ? "year" : "years"})
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {NGN_FORMAT.format(baseTotal)}
              </span>
            </div>
            {discountRate > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">
                    Discount ({(discountRate * 100).toFixed(0)}%)
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    -{NGN_FORMAT.format(discountAmount)}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-slate-900">
                      Total Price
                    </span>
                    <span className="text-2xl font-bold text-red-600">
                      {NGN_FORMAT.format(finalPrice)}
                    </span>
                  </div>
                </div>
              </>
            )}
            {discountRate === 0 && (
              <div className="border-t border-slate-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-slate-900">
                    Total Price
                  </span>
                  <span className="text-2xl font-bold text-red-600">
                    {NGN_FORMAT.format(finalPrice)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onPurchase({ years, price: finalPrice });
                onClose();
              }}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              Purchase License
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PAGES ---

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");

  // License configuration
  const licenseStart = new Date("2025-01-01");
  const licenseEnd = new Date("2025-12-31");
  const currentDate = new Date();

  const totalDuration = Math.ceil(
    (licenseEnd - licenseStart) / (1000 * 60 * 60 * 24)
  );
  const daysUsed = Math.ceil(
    (currentDate - licenseStart) / (1000 * 60 * 60 * 24)
  );
  const daysRemaining = Math.ceil(
    (licenseEnd - currentDate) / (1000 * 60 * 60 * 24)
  );
  const percentageUsed = Math.round((daysUsed / totalDuration) * 100);

  // Fraud detection metrics
  const totalTransactions = 847362;
  const fraudsDetected = 1247;
  const fraudsBlocked = 1089;
  const fraudsPassed = 158;
  const detectionRate = ((fraudsDetected / totalTransactions) * 100).toFixed(
    3
  );
  const blockRate = ((fraudsBlocked / fraudsDetected) * 100).toFixed(1);
  const dailyApiCalls = 12850;
  const isLicenseActive =
    currentDate >= licenseStart && currentDate <= licenseEnd;

  // Time series data for fraud detection
  const fraudTrendData = [
    {
      date: "Nov 7",
      transactions: 121000,
      frauds: 167,
      blocked: 145,
      passed: 22,
    },
    {
      date: "Nov 8",
      transactions: 118500,
      frauds: 172,
      blocked: 151,
      passed: 21,
    },
    {
      date: "Nov 9",
      transactions: 125300,
      frauds: 189,
      blocked: 165,
      passed: 24,
    },
    {
      date: "Nov 10",
      transactions: 119800,
      frauds: 178,
      blocked: 155,
      passed: 23,
    },
    {
      date: "Nov 11",
      transactions: 127600,
      frauds: 195,
      blocked: 172,
      passed: 23,
    },
    {
      date: "Nov 12",
      transactions: 123400,
      frauds: 184,
      blocked: 160,
      passed: 24,
    },
    {
      date: "Nov 13",
      transactions: 131762,
      frauds: 162,
      blocked: 141,
      passed: 21,
    },
  ];

  // Risk distribution data
  const riskDistribution = [
    { range: "Critical (80-100%)", count: 287, color: "#dc2626" },
    { range: "High (50-79%)", count: 412, color: "#f97316" },
    { range: "Medium (20-49%)", count: 368, color: "#eab308" },
    { range: "Low (0-19%)", count: 180, color: "#16a34a" },
  ];

  // Success vs Failure
  const outcomeData = [
    { name: "Blocked", value: fraudsBlocked, color: "#16a34a" },
    { name: "Passed", value: fraudsPassed, color: "#dc2626" },
  ];

  // Recent fraud cases
  const recentCases = [
    {
      caseId: "FR-2847",
      amount: 45780000,
      similarity: 94,
      timestamp: "2025-11-13T14:23:00",
      status: "blocked",
    },
    {
      caseId: "FR-2846",
      amount: 12500000,
      similarity: 67,
      timestamp: "2025-11-13T13:45:00",
      status: "blocked",
    },
    {
      caseId: "FR-2845",
      amount: 8900000,
      similarity: 38,
      timestamp: "2025-11-13T12:18:00",
      status: "blocked",
    },
    {
      caseId: "FR-2844",
      amount: 52300000,
      similarity: 89,
      timestamp: "2025-11-13T11:52:00",
      status: "blocked",
    },
    {
      caseId: "FR-2843",
      amount: 3400000,
      similarity: 23,
      timestamp: "2025-11-13T10:30:00",
      status: "blocked",
    },
    {
      caseId: "FR-2842",
      amount: 78900000,
      similarity: 91,
      timestamp: "2025-11-13T09:15:00",
      status: "passed",
    },
  ];

  const totalSaved =
    recentCases.filter((c) => c.status === "blocked").reduce((sum, c) => sum + c.amount, 0) * 7.2;

  const kpis = [
    {
      title: "Total Transactions",
      value: totalTransactions.toLocaleString(),
      subtitle: `${detectionRate}% Fraud Rate`,
      icon: Activity,
      colorClass: "text-blue-600",
      trend: 8.3,
    },
    {
      title: "Frauds Detected",
      value: fraudsDetected.toLocaleString(),
      subtitle: `${blockRate}% Blocked`,
      icon: AlertTriangle,
      colorClass: "text-orange-600",
      trend: -12.5,
    },
    {
      title: "Amount Saved",
      value: NGN_FORMAT.format(totalSaved),
      subtitle: "Last 7 Days",
      icon: Shield,
      colorClass: "text-green-600",
      trend: 15.2,
    },
    {
      title: "API Calls (24h)",
      value: dailyApiCalls.toLocaleString(),
      subtitle: isLicenseActive ? "Stream Active" : "License Expired",
      icon: Zap,
      colorClass: isLicenseActive ? "text-purple-600" : "text-red-600",
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Fraud Detection Dashboard
          </h2>
          <p className="text-slate-500 mt-1">
            Real-time fraud monitoring & analytics for Premier Bank
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, index) => (
          <KpiCard key={index} {...k} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Fraud Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Fraud Detection Trend
            </h3>
            <Activity className="text-blue-600" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={fraudTrendData}>
              <defs>
                <linearGradient id="colorFrauds" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="frauds"
                stroke="#f97316"
                fillOpacity={1}
                fill="url(#colorFrauds)"
                name="Detected"
              />
              <Area
                type="monotone"
                dataKey="blocked"
                stroke="#16a34a"
                fillOpacity={1}
                fill="url(#colorBlocked)"
                name="Blocked"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Risk Distribution
            </h3>
            <Eye className="text-orange-600" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" style={{ fontSize: "12px" }} />
              <YAxis
                dataKey="range"
                type="category"
                width={130}
                stroke="#64748b"
                style={{ fontSize: "11px" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Cases" radius={[0, 8, 8, 0]}>
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Success Rate and Recent Cases */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Success Rate Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Block Rate
            </h3>
            <CheckCircle className="text-green-600" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={outcomeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {outcomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-3xl font-bold text-green-600">{blockRate}%</p>
            <p className="text-sm text-slate-500">Successfully Blocked</p>
          </div>
        </div>

        {/* Recent Fraud Cases */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Fraud Cases
            </h3>
            <AlertTriangle className="text-orange-600" size={20} />
          </div>
          <div className="grid gap-3 max-h-[280px] overflow-y-auto pr-2">
            {recentCases.map((fraudCase) => (
              <FraudCaseCard key={fraudCase.caseId} {...fraudCase} />
            ))}
          </div>
        </div>
      </div>

      {/* License Status */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-slate-900">
            License Status
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">
              Start: {licenseStart.toLocaleDateString()}
            </span>
            <span className="text-slate-600">
              End: {licenseEnd.toLocaleDateString()}
            </span>
          </div>

          <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all ${percentageUsed > 80 ? "bg-orange-500" : "bg-blue-600"
                }`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {totalDuration}
              </p>
              <p className="text-sm text-slate-500">Total Days</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{daysUsed}</p>
              <p className="text-sm text-slate-500">Days Used</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {daysRemaining}
              </p>
              <p className="text-sm text-slate-500">Days Remaining</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {percentageUsed}%
              </p>
              <p className="text-sm text-slate-500">Consumed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Renewal Alert */}
      {daysRemaining <= 30 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <Clock className="text-orange-600 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-orange-900">
              License Renewal Reminder
            </p>
            <p className="text-sm text-orange-700 mt-1">
              Your license expires in {daysRemaining} days. Contact support to
              renew and maintain uninterrupted fraud detection services.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const BillingPage = () => {
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [licenseYears, setLicenseYears] = useState(1);
  
  // Pilot program: 6 weeks = 42 days
  const PILOT_DURATION_DAYS = 42;
  const [licenseRemainingDays, setLicenseRemainingDays] = useState(PILOT_DURATION_DAYS);

  // Calculate expiry date from account creation (today)
  const accountCreationDate = new Date();
  const licenseExpiryDate = new Date();
  licenseExpiryDate.setDate(accountCreationDate.getDate() + PILOT_DURATION_DAYS);
  
  // Calculate days remaining from today
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((licenseExpiryDate - today) / (1000 * 60 * 60 * 24)));
  
  const totalLicenseDays = PILOT_DURATION_DAYS;
  const licenseProgress = (daysRemaining / totalLicenseDays) * 100;

  const licenseHistory = [
    {
      date: accountCreationDate.toISOString().split('T')[0],
      transaction: "Pilot Program License - 6 Weeks",
      amount: 2500000,
      duration: "6 Weeks",
      status: "Active",
    },
  ];

  const handlePurchaseLicense = ({ years, price }) => {
    console.log(
      `Purchasing ${years} year(s) license for ${NGN_FORMAT.format(price)}`
    );
    // When purchasing full license, add years to current expiry date
    setLicenseRemainingDays(licenseRemainingDays + years * 365);
  };

  const getTimeRemainingLabel = () => {
    const weeks = Math.floor(daysRemaining / 7);
    const days = daysRemaining % 7;
    if (weeks > 0) {
      return `${weeks} ${weeks === 1 ? "week" : "weeks"}${days > 0 ? ` and ${days} ${days === 1 ? "day" : "days"}` : ""}`;
    }
    return `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"}`;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-900">
        License & Billing Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="License Status"
          value="Pilot Program"
          subtitle={`Expires: ${licenseExpiryDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}`}
          icon={ShieldCheck}
          colorClass="text-blue-600"
        />
        <KpiCard
          title="Time Remaining"
          value={getTimeRemainingLabel()}
          subtitle={`${daysRemaining} days left in pilot`}
          icon={TrendingUp}
          colorClass="text-blue-600"
        />
        <KpiCard
          title="Pilot Program Fee"
          value={NGN_FORMAT.format(2500000)}
          subtitle="6 weeks access"
          icon={Wallet}
          colorClass="text-blue-600"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Pilot Program Time Remaining
          </h3>
          <span className="text-sm font-medium text-slate-600">
            {daysRemaining} / {totalLicenseDays} days
          </span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max={totalLicenseDays}
            value={daysRemaining}
            readOnly
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${licenseProgress}%, #e2e8f0 ${licenseProgress}%, #e2e8f0 100%)`,
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>Expired</span>
            <span className="font-semibold text-blue-600">
              {Math.round(licenseProgress)}% Remaining
            </span>
            <span>Full Period</span>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-slate-900">
              Current Status:
            </span>{" "}
            You are currently on a <span className="font-semibold text-blue-600">6-week pilot program</span> that will expire on{" "}
            <span className="font-semibold text-blue-600">
              {licenseExpiryDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            . Upgrade to a full annual license below to continue using the platform.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold pt-4 text-slate-800">
          Upgrade to Full License
        </h3>
        <p className="text-sm text-slate-600 mt-2 mb-6">
          Your pilot program expires soon. Upgrade to a full annual license to continue using Nexus Disrupt™ Platform.
        </p>
        <div className="mt-6">
          <div className="rounded-2xl border-4 border-red-600 bg-slate-50 p-8 shadow-xl text-center flex flex-col">
            <h4 className="text-3xl font-extrabold mb-2 text-slate-800">
              Annual License
            </h4>
            <p className="text-lg font-semibold text-red-600 mb-4">
              {NGN_FORMAT.format(10000000)} / Year
            </p>
            <p className="text-5xl font-extrabold text-slate-900 mb-2">
              1 Year
            </p>
            <p className="text-lg font-medium text-slate-500 mb-6">
              Full Access to Nexus Disrupt™ Platform
            </p>
            <div className="bg-red-100 text-red-700 py-1 rounded-full mb-6 text-xs font-semibold">
              Multi-Year Discounts Available
            </div>
            <button
              onClick={() => {
                setLicenseYears(1);
                setShowCalculationModal(true);
              }}
              className="w-full mt-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Calculate & Purchase License
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold pt-4 text-slate-800">
          License & Billing History
        </h3>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden mt-6">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {licenseHistory.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {item.transaction}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                    {NGN_FORMAT.format(item.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {item.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${item.status === "Active"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCalculationModal && (
        <LicenseCalculationModal
          years={licenseYears}
          onYearsChange={setLicenseYears}
          onClose={() => setShowCalculationModal(false)}
          onPurchase={handlePurchaseLicense}
        />
      )}
    </div>
  );
};

const UserManagement = () => {
  const [managers, setManagers] = useState([
    {
      id: "mgr-1",
      name: "Aisha Bello",
      email: "aisha.bello@examplebank.com",
      role: "Fraud Manager",
    },
    {
      id: "mgr-2",
      name: "Chike Obi",
      email: "chike.obi@examplebank.com",
      role: "Lead Analyst",
    },
    {
      id: "mgr-3",
      name: "Kemi Adebayo",
      email: "kemi.adebayo@examplebank.com",
      role: "Compliance Officer",
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const handleAddUser = (newUser) => {
    setManagers((m) => [newUser, ...m]);
  };
  const removeManager = (id) => {
    setManagers((m) => m.filter((x) => x.id !== id));
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">
            User Management
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Provision and manage operational access for your team.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 shadow-md hover:shadow-lg"
        >
          <Plus size={16} />
          Provision New User
        </button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200">
            <tr className="text-xs text-slate-500 uppercase">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((u) => (
              <tr
                key={u.id}
                className="border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors"
              >
                <td className="p-4 font-medium text-slate-900">{u.name}</td>
                <td className="p-4 text-slate-600">{u.email}</td>
                <td className="p-4 text-sm text-slate-600">{u.role}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => removeManager(u.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs text-red-700 transition-colors hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 size={14} />
                    Remove Access
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddModal && (
        <AddUserModal
          onAddUser={handleAddUser}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

const ApiDocs = () => {
  const [apiKey] = useState("bank_a_test123");
  const [baseUrl] = useState("https://api.nexusdisrupt.com");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(null);
  const [resultResponse, setResultResponse] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [requestPayload, setRequestPayload] = useState(`{
  "amount": 50000,
  "sender": "ACC123456",
  "receiver": "ACC789012",
  "currency": "USD",
  "timestamp": "${new Date().toISOString()}"
}`);

  const CodeSnippet = ({ children, lang, copyable = false }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
      navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="relative">
        {copyable && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
          </button>
        )}
        <pre className={`language-${lang} mt-2 rounded-xl bg-slate-900 p-4 text-xs text-white/80 overflow-auto font-mono ${copyable ? "pr-12" : ""}`}>
          {children}
        </pre>
      </div>
    );
  };

  const handleSubmitTransaction = async () => {
    setIsSubmitting(true);
    setSubmitResponse(null);
    
    try {
      const payload = JSON.parse(requestPayload);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = {
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: "queued"
      };
      
      setSubmitResponse({
        status: 202,
        data: response
      });
      setTransactionId(response.transactionId);
    } catch (error) {
      setSubmitResponse({
        status: 400,
        error: "Invalid JSON payload. Please check your request body."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetResult = async () => {
    if (!transactionId) {
      setResultResponse({
        status: 400,
        error: "Please submit a transaction first to get a transaction ID."
      });
      return;
    }

    setIsFetching(true);
    setResultResponse(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const parsedPayload = JSON.parse(requestPayload);
      const gnnScore = 0.87;
      const fraudScore = gnnScore;
      const regulatoryPenalty = Math.round(gnnScore * 100000);
      const reputationalDamageScore = (gnnScore * 45).toFixed(1);
      const impactLevel = gnnScore >= 0.85 ? "HIGH" : gnnScore >= 0.70 ? "MEDIUM" : "LOW";
      
      const result = {
        transactionId: transactionId,
        status: "completed",
        timestamp: new Date().toISOString(),
        transaction: {
          amount: parsedPayload.amount,
          sender: parsedPayload.sender,
          receiver: parsedPayload.receiver,
          currency: parsedPayload.currency || "USD",
          timestamp: parsedPayload.timestamp
        },
        analysis: {
          gnnScore: gnnScore,
          fraudScore: fraudScore,
          riskLevel: gnnScore >= 0.90 ? "CRITICAL" : gnnScore >= 0.85 ? "HIGH" : gnnScore >= 0.70 ? "MEDIUM" : "LOW",
          confidence: Math.round(gnnScore * 100)
        },
        cdt: {
          regulatoryPenalty: regulatoryPenalty,
          reputationalDamageScore: parseFloat(reputationalDamageScore),
          impactLevel: impactLevel,
          estimatedLoss: Math.round(gnnScore * parsedPayload.amount * 0.5)
        },
        ccn: {
          ccnId: `CCN-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${transactionId.slice(-3).toUpperCase()}`,
          reportType: gnnScore >= 0.85 ? "SAR" : "STR",
          riskScore: Math.round(gnnScore * 100),
          indicators: gnnScore >= 0.85 
            ? ["Structuring", "Unusual Activity Pattern", "Network Analysis Flag", "High-Risk Geographic Location"]
            : ["Unusual Activity Pattern", "Transaction Amount Anomaly"],
          narrative: `Transaction ${parsedPayload.sender} → ${parsedPayload.receiver} exhibits ${gnnScore >= 0.85 ? "multiple high-risk indicators" : "suspicious activity patterns"}. GNN analysis indicates ${Math.round(gnnScore * 100)}% confidence of fraudulent activity. The transaction pattern suggests potential money laundering activities with a ${impactLevel.toLowerCase()} risk profile. Regulatory penalty estimated at ${parsedPayload.currency || "USD"} ${regulatoryPenalty.toLocaleString()}. Reputational damage score: ${reputationalDamageScore} (${impactLevel} impact). Immediate regulatory review recommended.`,
          dateGenerated: new Date().toISOString()
        }
      };
      
      setResultResponse({
        status: 200,
        data: result
      });
    } catch (error) {
      setResultResponse({
        status: 500,
        error: "Failed to fetch result. Please try again."
      });
    } finally {
      setIsFetching(false);
    }
  };

  const ArchitectureFlow = () => (
    <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-lg">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Workflow size={24} className="text-red-600" />
        System Architecture Flow
      </h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center border-2 border-blue-300">
              <Server size={24} className="text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700">Bank Request</span>
          </div>
          <ArrowRight className="text-slate-400" size={24} />
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-16 h-16 rounded-xl bg-green-100 flex items-center justify-center border-2 border-green-300">
              <Server size={24} className="text-green-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700">API Server</span>
          </div>
          <ArrowRight className="text-slate-400" size={24} />
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-16 h-16 rounded-xl bg-yellow-100 flex items-center justify-center border-2 border-yellow-300">
              <Activity size={24} className="text-yellow-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700">BullMQ Queue</span>
          </div>
          <ArrowRight className="text-slate-400" size={24} />
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center border-2 border-purple-300">
              <Cpu size={24} className="text-purple-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700">Worker</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center border-2 border-indigo-300">
              <Database size={24} className="text-indigo-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700">PostgreSQL</span>
            <span className="text-xs text-slate-500 text-center">Results Storage</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-xl bg-red-100 flex items-center justify-center border-2 border-red-300">
              <Zap size={24} className="text-red-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700">GNN + CDT + LLM</span>
            <span className="text-xs text-slate-500 text-center">AI Processing</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-green-900 mb-1">System Status: Operational</p>
              <ul className="text-xs text-green-700 space-y-1">
                <li>✅ API key authentication</li>
                <li>✅ Asynchronous transaction processing</li>
                <li>✅ Background job queue with BullMQ</li>
                <li>✅ GNN fraud scoring engine</li>
                <li>✅ CDT impact calculation</li>
                <li>✅ CCN compliance report generation</li>
                <li>✅ Result retrieval and storage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Developer Sandbox
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Interactive testing environment for the Nexus Disrupt™ API. Test transactions, view results, and understand the system architecture.
        </p>
      </div>

      <ArchitectureFlow />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submit Transaction Section */}
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Send size={20} className="text-green-600" />
                Submit Transaction
              </h3>
              <p className="text-xs text-slate-500 mt-1">POST /transactions</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              POST
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Request Payload (JSON)
              </label>
              <textarea
                value={requestPayload}
                onChange={(e) => setRequestPayload(e.target.value)}
                className="w-full h-40 p-4 rounded-lg bg-slate-900 text-green-400 font-mono text-xs border-2 border-slate-300 focus:border-red-500 focus:outline-none resize-none"
                placeholder="Enter JSON payload..."
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-slate-600 mb-1">Headers:</p>
              <CodeSnippet lang="http" copyable>{`x-api-key: ${apiKey}`}</CodeSnippet>
            </div>

            <button
              onClick={handleSubmitTransaction}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Play size={18} />
                  Submit Transaction
                </>
              )}
            </button>

            {submitResponse && (
              <div className={`p-4 rounded-lg border-2 ${
                submitResponse.status === 202 
                  ? "bg-green-50 border-green-200" 
                  : "bg-red-50 border-red-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {submitResponse.status === 202 ? (
                    <CheckCircle className="text-green-600" size={18} />
                  ) : (
                    <XCircle className="text-red-600" size={18} />
                  )}
                  <span className="font-semibold text-slate-900">
                    Response {submitResponse.status}
                  </span>
                </div>
                <CodeSnippet lang="json" copyable>
                  {submitResponse.data 
                    ? JSON.stringify(submitResponse.data, null, 2)
                    : submitResponse.error}
                </CodeSnippet>
              </div>
            )}
          </div>
        </div>

        {/* Get Result Section */}
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <RefreshCw size={20} className="text-blue-600" />
                Get Result
              </h3>
              <p className="text-xs text-slate-500 mt-1">GET /transactions/:id/result</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              GET
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Transaction ID
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID or submit a transaction first"
                className="w-full p-3 rounded-lg bg-slate-50 border-2 border-slate-300 focus:border-blue-500 focus:outline-none font-mono text-sm"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-slate-600 mb-1">Headers:</p>
              <CodeSnippet lang="http" copyable>{`x-api-key: ${apiKey}`}</CodeSnippet>
            </div>

            <button
              onClick={handleGetResult}
              disabled={isFetching || !transactionId}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {isFetching ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Fetching Result...
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Get Result
                </>
              )}
            </button>

            {resultResponse && (
              <div className={`p-4 rounded-lg border-2 ${
                resultResponse.status === 200 
                  ? "bg-blue-50 border-blue-200" 
                  : "bg-red-50 border-red-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {resultResponse.status === 200 ? (
                    <CheckCircle className="text-blue-600" size={18} />
                  ) : (
                    <XCircle className="text-red-600" size={18} />
                  )}
                  <span className="font-semibold text-slate-900">
                    Response {resultResponse.status}
                  </span>
                </div>
                <CodeSnippet lang="json" copyable>
                  {resultResponse.data 
                    ? JSON.stringify(resultResponse.data, null, 2)
                    : resultResponse.error}
                </CodeSnippet>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Examples Section */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-lg">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Code Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <FileText size={16} />
              cURL Example
            </h4>
            <CodeSnippet lang="bash" copyable>{`curl -X POST ${baseUrl}/transactions \\
  -H "x-api-key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 50000,
    "sender": "ACC123456",
    "receiver": "ACC789012",
    "currency": "USD",
    "timestamp": "2024-01-15T10:30:00Z"
  }'`}</CodeSnippet>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <FileText size={16} />
              JavaScript (Fetch)
            </h4>
            <CodeSnippet lang="javascript" copyable>{`const response = await fetch('${baseUrl}/transactions', {
  method: 'POST',
  headers: {
    'x-api-key': '${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 50000,
    sender: 'ACC123456',
    receiver: 'ACC789012',
    currency: 'USD',
    timestamp: new Date().toISOString()
  })
});

const data = await response.json();
console.log(data);`}</CodeSnippet>
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6 shadow-lg">
        <h3 className="text-xl font-bold text-slate-900 mb-4">API Endpoint Details</h3>
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">POST</span>
              <code className="text-sm font-mono text-slate-900">/transactions</code>
            </div>
            <p className="text-sm text-slate-600 mb-3">Submit a transaction for fraud analysis. Returns a transaction ID and queued status.</p>
            <div className="text-xs text-slate-500">
              <p className="font-semibold mb-1">Response: 202 Accepted</p>
              <CodeSnippet lang="json">{`{
  "transactionId": "uuid",
  "status": "queued"
}`}</CodeSnippet>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">GET</span>
              <code className="text-sm font-mono text-slate-900">/transactions/:id/result</code>
            </div>
            <p className="text-sm text-slate-600 mb-3">Retrieve the fraud analysis result for a submitted transaction.</p>
            <div className="text-xs text-slate-500">
              <p className="font-semibold mb-1">Response: 200 OK</p>
              <CodeSnippet lang="json">{`{
  "transactionId": "uuid",
  "status": "completed",
  "timestamp": "2024-01-15T10:35:00Z",
  "transaction": {
    "amount": 50000,
    "sender": "ACC123456",
    "receiver": "ACC789012",
    "currency": "USD",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "analysis": {
    "gnnScore": 0.87,
    "fraudScore": 0.87,
    "riskLevel": "HIGH",
    "confidence": 87
  },
  "cdt": {
    "regulatoryPenalty": 87000,
    "reputationalDamageScore": 39.2,
    "impactLevel": "HIGH",
    "estimatedLoss": 21750
  },
  "ccn": {
    "ccnId": "CCN-20240115-ABC",
    "reportType": "SAR",
    "riskScore": 87,
    "indicators": ["Structuring", "Unusual Activity Pattern"],
    "narrative": "Transaction analysis report...",
    "dateGenerated": "2024-01-15T10:35:00Z"
  }
}`}</CodeSnippet>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPanel = () => {
  const [gnnThreshold, setGnnThreshold] = useState(0.92);
  const [licenseNotifications, setLicenseNotifications] = useState(true);
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  // License configuration
  const licenseStart = new Date("2025-01-01");
  const licenseEnd = new Date("2025-12-31");
  const currentDate = new Date();
  const daysRemaining = Math.ceil((licenseEnd - currentDate) / (1000 * 60 * 60 * 24));
  const isLicenseActive = currentDate >= licenseStart && currentDate <= licenseEnd;
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-slate-900">
          License Settings & AI Controls
        </h2>
        <p className="text-sm text-slate-600">
          Manage your license configuration and AI sensitivity settings.
        </p>
      </div>

      {/* License Status Overview */}
      <div className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-semibold text-slate-900 text-xl mb-1">
              License Status Overview
            </h3>
            <p className="text-sm text-slate-500">
              Current license information and system access status.
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
            isLicenseActive 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {isLicenseActive ? "Active" : "Expired"}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-2xl font-bold text-slate-900">{daysRemaining}</p>
            <p className="text-sm text-slate-500">Days Remaining</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-2xl font-bold text-slate-900">
              {licenseEnd.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
            </p>
            <p className="text-sm text-slate-500">Expiry Date</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-2xl font-bold text-red-600">Annual</p>
            <p className="text-sm text-slate-500">License Type</p>
          </div>
        </div>

        {/* License renewal warning */}
        {daysRemaining <= 30 && daysRemaining > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3 mb-6">
            <AlertTriangle className="text-orange-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-orange-900">License Renewal Required</p>
              <p className="text-sm text-orange-700 mt-1">
                Your license expires in {daysRemaining} days. Renew now to avoid service interruption.
              </p>
            </div>
          </div>
        )}

        {!isLicenseActive && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6">
            <XCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-red-900">License Expired</p>
              <p className="text-sm text-red-700 mt-1">
                Your license has expired. Please renew to restore full system access and functionality.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 space-y-8 shadow-lg">
        {/* AI Sensitivity Controls */}
        <div>
          <h3 className="font-semibold text-slate-900 text-xl mb-1">
            AI Sensitivity Controls (GNN Threshold)
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Adjust the GNN's confidence level required to trigger the Agentic Micro-Freeze command.
            {!isLicenseActive && " (Requires active license)"}
          </p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.80"
              max="0.99"
              step="0.01"
              value={gnnThreshold}
              onChange={(e) => setGnnThreshold(parseFloat(e.target.value))}
              disabled={!isLicenseActive}
              className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${
                isLicenseActive ? "bg-slate-200 accent-red-600" : "bg-red-200 accent-red-300"
              }`}
            />
            <span className={`font-bold w-16 ${isLicenseActive ? "text-red-600" : "text-red-400"}`}>
              {`${(gnnThreshold * 100).toFixed(0)}%`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Current Threshold: A GNN Score of {gnnThreshold} or higher triggers autonomous disruption.
            {!isLicenseActive && " (Adjustment disabled - license expired)"}
          </p>
        </div>

        {/* License Preferences */}
        <div className="border-t border-slate-200 pt-8">
          <h3 className="font-semibold text-slate-900 text-xl mb-4">
            License Preferences
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Renewal Notifications</p>
                <p className="text-sm text-slate-500">
                  Receive email alerts about upcoming license renewals
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={licenseNotifications}
                  onChange={(e) => setLicenseNotifications(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-red-300"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Auto-Renewal</p>
                <p className="text-sm text-slate-500">
                  Automatically renew license before expiration (requires saved payment method)
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={autoRenewal}
                  onChange={(e) => setAutoRenewal(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-red-300"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Maintenance Mode</p>
                <p className="text-sm text-slate-500">
                  Temporarily disable fraud detection during system maintenance
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  disabled={!isLicenseActive}
                  className="peer sr-only"
                />
                <div className={`peer h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-focus:ring-4 ${
                  isLicenseActive 
                    ? "bg-slate-200 after:border-slate-300 peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-red-300"
                    : "bg-red-200 after:border-red-300 cursor-not-allowed"
                }`}></div>
              </label>
            </div>
          </div>
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
  const pageTitles = {
    dashboard: "Fraud Detection Dashboard",
    users: "User Management",
    billing: "License & Billing Management",
    api: "API Integration",
    settings: "Settings & AI Controls",
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <AdminDashboard />;
      case "users":
        return <UserManagement />;
      case "billing":
        return <BillingPage />;
      case "api":
        return <ApiDocs />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      <nav
        className={`z-20 flex flex-col border-r border-black/10 bg-slate-900 transition-all duration-300 ease-in-out ${isSidebarExpanded ? "w-64" : "w-20"
          }`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="flex h-20 shrink-0 items-center justify-center border-b border-white/10">
          <span
            className={`text-xl font-bold text-red-600 transition-transform duration-200 ${!isSidebarExpanded && "scale-110"
              }`}
          >
            ND
          </span>
          <span
            className={`ml-2 whitespace-nowrap text-xl font-bold text-white transition-all duration-200 ${isSidebarExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
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
            icon={<Wallet size={20} />}
            text="Billing & License"
            isExpanded={isSidebarExpanded}
            active={activePage === "billing"}
            onClick={() => setActivePage("billing")}
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
            text="API Integration"
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
        <div className="border-t border-white/10 p-4">
          <button
            onClick={onLogout}
            className="mt-2 flex h-12 w-full items-center rounded-lg px-4 text-slate-300 transition-colors hover:bg-red-600/20 hover:text-red-600"
          >
            <LogOut size={20} />
            <span
              className={`ml-4 text-sm font-medium transition-opacity ${isSidebarExpanded ? "opacity-100" : "opacity-0"
                }`}
            >
              Logout
            </span>
          </button>
        </div>
      </nav>
      <main className="dashboard-scroll flex-1 overflow-y-auto">
        <div className="relative min-h-full">
          <PortalNavbar
            user={user.email}
            onLogout={onLogout}
            title={pageTitles[activePage] || "Admin Dashboard"}
          />
          <div className="p-8">{renderPage()}</div>
        </div>
      </main>
    </div>
  );
};

export default AdminPortal;