import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Search,
  Download,
  Eye,
  Calendar,
  Building2,
  CheckCircle2,
  Award,
  Filter,
  Layers,
} from 'lucide-react';
import { SoilReport } from '../../types';

export const ReportsList: React.FC = () => {
  const { reports, currentUser, setSelectedReport, incrementReportDownload, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Ready' | 'Downloaded'>('All');
  const [cropFilter, setCropFilter] = useState<string>('All');

  // Filter reports belonging to current farmer (or all if admin)
  const farmerReports = reports.filter(
    (r) => r.farmerId === currentUser.id || currentUser.role === 'admin'
  );

  // Collect distinct crops for filter
  const uniqueCrops = Array.from(new Set(farmerReports.map((r) => r.intendedCrop)));

  const filteredReports = farmerReports.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.intendedCrop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.labName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' ? true : r.status === statusFilter;
    const matchesCrop = cropFilter === 'All' ? true : r.intendedCrop === cropFilter;

    return matchesSearch && matchesStatus && matchesCrop;
  });

  const handleDownload = (report: SoilReport, e: React.MouseEvent) => {
    e.stopPropagation();
    incrementReportDownload(report.id);
    setSelectedReport(report);
    addToast('success', 'Report Opened', `Soil Health Card ${report.id} opened for print & download.`);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Digital Soil Health Reports
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Access, view, and print official 12-parameter soil health cards for your registered farm plots.
          </p>
        </div>

        <div className="text-xs text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg">
          Showing <span className="font-bold text-stone-900">{filteredReports.length}</span> of {farmerReports.length} reports
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Report ID, farm name, crop, or lab..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="text-xs px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            >
              <option value="All">All Evaluated Crops</option>
              {uniqueCrops.map((c) => (
                <option key={c} value={c}>
                  Crop: {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100">
          {(['All', 'Ready', 'Downloaded'] as const).map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-800 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {tab} Reports
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Cards Grid */}
      {filteredReports.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-800 mt-3">No Soil Reports Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            Reports will appear here once laboratory analysis is completed and authorized by the soil chemist.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-700/60 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Top header row */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900 text-sm">{report.id}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded">
                        {report.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-base mt-1">{report.farmName}</h3>
                    <div className="text-xs text-stone-500">
                      Survey: {report.surveyNumber} · {report.acreage} Acres
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-emerald-900">{report.soilHealthIndex}</span>
                      <span className="text-[9px] uppercase font-bold text-emerald-700">Index</span>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="py-3 text-xs text-stone-600 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{report.labName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Tested: {report.testingCompletedDate}</span>
                    <span>·</span>
                    <span className="text-emerald-800 font-medium">For: {report.intendedCrop}</span>
                  </div>
                </div>

                {/* Key nutrient summary pills */}
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 text-xs">
                  <div className="text-[11px] font-semibold text-stone-500 mb-2">Key Diagnostic Readings</div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-1.5 bg-white rounded-lg border border-stone-200">
                      <div className="text-[10px] text-stone-400">pH</div>
                      <div className="font-mono font-bold text-stone-900">{report.parameters.pH.value}</div>
                      <div className="text-[9px] text-emerald-700 font-medium">{report.parameters.pH.status}</div>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg border border-stone-200">
                      <div className="text-[10px] text-stone-400">Nitrogen</div>
                      <div className="font-mono font-bold text-stone-900">{report.parameters.nitrogen.value}</div>
                      <div className={`text-[9px] font-medium ${report.parameters.nitrogen.status === 'Low' ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {report.parameters.nitrogen.status}
                      </div>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg border border-stone-200">
                      <div className="text-[10px] text-stone-400">Phosphorus</div>
                      <div className="font-mono font-bold text-stone-900">{report.parameters.phosphorus.value}</div>
                      <div className="text-[9px] text-emerald-700 font-medium">{report.parameters.phosphorus.status}</div>
                    </div>
                    <div className="p-1.5 bg-white rounded-lg border border-stone-200">
                      <div className="text-[10px] text-stone-400">Potassium</div>
                      <div className="font-mono font-bold text-stone-900">{report.parameters.potassium.value}</div>
                      <div className="text-[9px] text-purple-700 font-medium">{report.parameters.potassium.status}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {report.downloadCount > 0 ? `Downloaded ${report.downloadCount}x` : 'New Report'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDownload(report, e)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Card</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
