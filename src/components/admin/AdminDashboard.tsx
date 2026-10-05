import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Users,
  Calendar,
  FlaskConical,
  FileCheck,
  TrendingUp,
  Building2,
  Bell,
  Plus,
  Trash2,
  Sliders,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { TestingCenter, Announcement } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    allUsers,
    testingCenters,
    updateCenterCapacity,
    toggleCenterActive,
    appointments,
    reports,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    setSelectedReport,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'centers' | 'announcements'>('analytics');

  // Announcement modal
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annAudience, setAnnAudience] = useState<Announcement['targetAudience']>('all');
  const [annPriority, setAnnPriority] = useState<Announcement['priority']>('normal');

  // KPI Calculations
  const farmersCount = allUsers.filter((u) => u.role === 'farmer').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const apptsToday = appointments.filter((a) => a.appointmentDate === todayStr).length;
  const upcomingCount = appointments.filter((a) => ['Booked', 'Confirmed'].includes(a.status)).length;
  const underTestingCount = appointments.filter((a) =>
    ['Sample Submitted', 'Testing in Progress'].includes(a.status)
  ).length;
  const reportsPendingCount = appointments.filter((a) => a.status === 'Testing in Progress').length;
  const reportsCompletedCount = reports.length;

  // Monthly trends simulation
  const monthlyData = [
    { month: 'May 2026', appointments: 124, reports: 120 },
    { month: 'Jun 2026', appointments: 210, reports: 198 },
    { month: 'Jul 2026', appointments: 185, reports: 180 },
    { month: 'Aug 2026', appointments: 142, reports: 140 },
    { month: 'Sep 2026', appointments: 268, reports: 254 },
    { month: 'Oct 2026 (Rabi)', appointments: 312, reports: 289 },
  ];

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim()) return;

    addAnnouncement({
      title: annTitle,
      content: annContent,
      targetAudience: annAudience,
      priority: annPriority,
      author: 'State Directorate of Agriculture',
    });

    setIsAnnounceModalOpen(false);
    setAnnTitle('');
    setAnnContent('');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              State Agricultural Administration Console
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Monitoring Soil Health Card targets, lab capacity utilization, and farmer advisory dissemination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAnnounceModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 shadow-xs transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span>Broadcast Portal Advisory</span>
          </button>
        </div>
      </div>

      {/* 6 Key Macro Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500">Registered Farmers</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1 tabular-nums">
            {farmersCount * 142}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5">+14% this month</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500">Today's Intake</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1 tabular-nums">
            {apptsToday}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Across 3 centers</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500">Upcoming Intake</span>
          <div className="text-xl font-bold font-mono text-sky-800 mt-1 tabular-nums">
            {upcomingCount}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Scheduled slots</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500">In Lab Testing</span>
          <div className="text-xl font-bold font-mono text-amber-700 mt-1 tabular-nums">
            {underTestingCount}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Active analytical runs</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500">Reports Pending</span>
          <div className="text-xl font-bold font-mono text-indigo-700 mt-1 tabular-nums">
            {reportsPendingCount}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Awaiting sign-off</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500">SHC Issued</span>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1 tabular-nums">
            {reportsCompletedCount * 85 + 240}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5">98.4% target met</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-1">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'analytics'
              ? 'bg-purple-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Performance & Trends Analytics
        </button>
        <button
          onClick={() => setActiveTab('centers')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'centers'
              ? 'bg-purple-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Laboratories & Capacity Management
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'announcements'
              ? 'bg-purple-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Broadcast Announcements ({announcements.length})
        </button>
      </div>

      {/* TAB 1: Performance & Trends */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Monthly Trend Visual Bars */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Monthly Soil Testing & Report Turnaround Trends
                </h3>
                <p className="text-xs text-stone-500">
                  Total appointment volume vs completed Soil Health Cards issued (Last 6 Months).
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-700" />
                  <span>Appointments</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-500" />
                  <span>Reports Finalized</span>
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {monthlyData.map((d) => {
                const max = 350;
                const apptPct = Math.round((d.appointments / max) * 100);
                const repPct = Math.round((d.reports / max) * 100);

                return (
                  <div key={d.month} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-stone-700">
                      <span>{d.month}</span>
                      <span className="font-mono text-stone-900 tabular-nums">
                        {d.appointments} Appts · {d.reports} Cards ({Math.round((d.reports / d.appointments) * 100)}% Turnaround)
                      </span>
                    </div>
                    <div className="h-4 bg-stone-100 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${apptPct}%` }}
                        className="h-full bg-emerald-700 transition-all duration-500"
                        title={`Appointments: ${d.appointments}`}
                      />
                      <div
                        style={{ width: `${Math.max(0, repPct - apptPct)}%` }}
                        className="h-full bg-amber-500 transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testing Center Performance Breakdown */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-sm">
                District Soil Testing Center Performance Audit
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                    <th className="py-3 px-4">Center Code & Name</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4">Daily Slot Limit</th>
                    <th className="py-3 px-4">Active Queue</th>
                    <th className="py-3 px-4">Avg Turnaround</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {testingCenters.map((c) => {
                    const centerQueue = appointments.filter(
                      (a) => a.centerId === c.id && ['Confirmed', 'Sample Submitted', 'Testing in Progress'].includes(a.status)
                    ).length;

                    return (
                      <tr key={c.id} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900">{c.name}</div>
                          <div className="text-[11px] font-mono text-stone-500">{c.code} · {c.phone}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-stone-800">{c.district}, {c.state}</td>
                        <td className="py-3 px-4 font-mono font-bold text-stone-900 tabular-nums">
                          {c.maxDailyCapacity} samples/day
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700 tabular-nums">
                          {centerQueue} in process
                        </td>
                        <td className="py-3 px-4 text-stone-600 font-medium">3.8 Business Days</td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                              c.active
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {c.active ? 'Operational' : 'Maintenance'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Laboratories & Slot Capacities */}
      {activeTab === 'centers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testingCenters.map((center) => (
              <div
                key={center.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-semibold">
                        {center.code}
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm mt-1">{center.name}</h4>
                    </div>
                    <button
                      onClick={() => toggleCenterActive(center.id)}
                      className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                        center.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {center.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <p className="text-xs text-stone-500 mt-2">{center.address}</p>

                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 font-medium">Daily Sample Quota:</span>
                      <span className="font-mono font-bold text-stone-900">
                        {center.maxDailyCapacity} samples
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="10"
                        max="60"
                        step="5"
                        value={center.maxDailyCapacity}
                        onChange={(e) => updateCenterCapacity(center.id, parseInt(e.target.value))}
                        className="w-full accent-purple-800 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex justify-between">
                  <span>Operating: {center.operatingHours}</span>
                  <span className="font-semibold text-stone-800">{center.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stone-900 text-sm">Published Agricultural Advisories</h3>
            <button
              onClick={() => setIsAnnounceModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors"
            >
              + Create Advisory Notice
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {item.priority}
                    </span>
                    <span className="text-xs text-stone-400">Target: {item.targetAudience}</span>
                    <span className="text-xs text-stone-400">·</span>
                    <span className="text-xs text-stone-400 font-mono">{item.date}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">{item.content}</p>
                </div>

                <button
                  onClick={() => deleteAnnouncement(item.id)}
                  className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                  title="Remove Advisory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Broadcast Advisory Modal */}
      {isAnnounceModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">Broadcast Agricultural Advisory</h3>
            <p className="text-xs text-stone-500 mt-1">
              This notice will immediately appear in farmer and laboratory dashboards.
            </p>

            <form onSubmit={handleCreateAnnouncement} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Advisory Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rabi 2026 Soil Sampling Campaign Underway"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notice Content *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide concrete guidelines on soil testing subsidies or pre-sowing recommendations..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Audience</label>
                  <select
                    value={annAudience}
                    onChange={(e) =>
                      setAnnAudience(e.target.value as Announcement['targetAudience'])
                    }
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="all">All Users (Farmers & Labs)</option>
                    <option value="farmers">Farmers Only</option>
                    <option value="labs">Laboratory Staff Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Priority</label>
                  <select
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value as Announcement['priority'])}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="normal">Normal Information</option>
                    <option value="urgent">Urgent Advisory / Banner</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAnnounceModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 text-white rounded-lg font-bold hover:bg-emerald-900"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
