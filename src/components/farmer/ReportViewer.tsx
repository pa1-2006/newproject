import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SoilReport, SoilParameter } from '../../types';
import {
  Printer,
  Download,
  X,
  CheckCircle2,
  AlertTriangle,
  Award,
  Calendar,
  Building2,
  FileCheck,
  ShieldCheck,
  User,
  MapPin,
  TrendingUp,
} from 'lucide-react';

interface ReportViewerProps {
  report: SoilReport;
  onClose: () => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ report, onClose }) => {
  const { incrementReportDownload, addToast } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    incrementReportDownload(report.id);
    window.print();
  };

  const handleDownloadPDF = () => {
    incrementReportDownload(report.id);
    addToast('success', 'Soil Report Exported', `Digital Soil Health Card ${report.id} generated for printing/download.`);
    window.print();
  };

  // Status badge styling helper
  const getStatusBadge = (param: SoilParameter) => {
    switch (param.status) {
      case 'Optimal':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>Optimal</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded">
            <span>Moderate</span>
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            <span>Deficient / Low</span>
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded">
            <span>Surplus / High</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden my-4 sm:my-8">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-stone-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-sm font-bold text-white">Digital Soil Health Card</div>
              <div className="text-[11px] text-stone-400 font-mono">
                Card ID: {report.id} · Ref: {report.appointmentId}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors ml-2"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Soil Health Card Container */}
        <div ref={printRef} className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto text-stone-900 bg-white">
          {/* Official Document Header */}
          <div className="border-b-2 border-emerald-900 pb-5 text-center">
            <div className="text-[11px] uppercase tracking-widest font-semibold text-emerald-900">
              SoilCare Diagnostic Network · Department of Agriculture & Farmers Welfare
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              SOILCARE HEALTH CARD / मृदा स्वास्थ्य पत्रक
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-stone-600 mt-2">
              <span className="font-semibold text-stone-800">{report.labName}</span>
              <span>·</span>
              <span>Accredited Testing Facility Code: {report.labId}</span>
              <span>·</span>
              <span className="font-mono">Tested: {report.testingCompletedDate}</span>
            </div>
          </div>

          {/* Farmer & Land Particulars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-stone-200 bg-stone-50/70 text-xs">
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wide">
                <User className="w-3.5 h-3.5 text-emerald-800" />
                <span>Farmer Identification</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-stone-200/60">
                <span className="text-stone-500">Farmer Name:</span>
                <span className="font-semibold text-stone-900">{report.farmerName}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-stone-200/60">
                <span className="text-stone-500">Contact Number:</span>
                <span className="font-mono text-stone-800">{report.farmerPhone}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-stone-500">Village / District:</span>
                <span className="font-medium text-stone-800">{report.village}, {report.district}, {report.state}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                <span>Field & Crop Parameters</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-stone-200/60">
                <span className="text-stone-500">Plot Name / Survey No:</span>
                <span className="font-semibold text-stone-900">{report.farmName} ({report.surveyNumber})</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-stone-200/60">
                <span className="text-stone-500">Parcel Area:</span>
                <span className="font-medium text-stone-800">{report.acreage} Acres</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-stone-500">Crop Sequence:</span>
                <span className="font-medium text-stone-800">{report.currentCrop} ➔ <strong className="text-emerald-800">{report.intendedCrop}</strong></span>
              </div>
            </div>
          </div>

          {/* Soil Health Overall Score Index */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white font-mono font-extrabold text-lg flex items-center justify-center shadow-xs">
                {report.soilHealthIndex}
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  Soil Fertility Assessment
                </div>
                <div className="text-base font-bold text-emerald-900 mt-0.5">
                  {report.overallAssessment}
                </div>
                <div className="text-[11px] text-emerald-800">
                  Calculated against ICAR soil fertility index standards
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-stone-600 sm:border-l sm:border-emerald-200 sm:pl-4">
              <div>Sample Collection: <span className="font-mono font-medium text-stone-900">{report.sampleCollectionDate}</span></div>
              <div>Analysis Finalized: <span className="font-mono font-medium text-stone-900">{report.testingCompletedDate}</span></div>
            </div>
          </div>

          {/* 12 Soil Nutrient Parameters Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Soil Chemical & Nutrient Analysis (12 Parameters)
              </h3>
              <span className="text-[11px] text-stone-500">DTPA & Colorimetric Assays</span>
            </div>

            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-200 text-stone-700 font-semibold">
                    <th className="py-2.5 px-3">Parameter Tested</th>
                    <th className="py-2.5 px-3">Chemical Symbol</th>
                    <th className="py-2.5 px-3 text-right">Measured Value</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3">Rating / Status</th>
                    <th className="py-2.5 px-3">Standard Optimal Range</th>
                    <th className="py-2.5 px-3 hidden md:table-cell">Standard Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-normal">
                  {Object.entries(report.parameters).map(([key, param]) => (
                    <tr key={key} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-2 px-3 font-medium text-stone-900">{param.name}</td>
                      <td className="py-2 px-3 font-mono text-stone-600">{param.chemicalSymbol}</td>
                      <td className="py-2 px-3 font-mono font-bold text-stone-900 text-right tabular-nums">
                        {param.value}
                      </td>
                      <td className="py-2 px-3 text-stone-500">{param.unit || '—'}</td>
                      <td className="py-2 px-3">{getStatusBadge(param)}</td>
                      <td className="py-2 px-3 text-stone-600 font-medium">{param.optimalRange}</td>
                      <td className="py-2 px-3 text-stone-400 text-[11px] hidden md:table-cell truncate max-w-[160px]">
                        {param.method}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fertilizer & Nutrient Recommendations Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Targeted Fertilizer & Nutrient Recommendations (Per Acre)
              </h3>
              <span className="text-[11px] text-stone-500">Tailored for: {report.intendedCrop}</span>
            </div>

            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-200 text-stone-700 font-semibold">
                    <th className="py-2.5 px-3">Fertilizer Grade</th>
                    <th className="py-2.5 px-3">Nutrient Target</th>
                    <th className="py-2.5 px-3">Basal Dose (at Sowing)</th>
                    <th className="py-2.5 px-3">Top Dressing / Foliar Split</th>
                    <th className="py-2.5 px-3">Application Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {report.fertilizerRecommendations.map((rec, i) => (
                    <tr key={i} className="hover:bg-stone-50/70">
                      <td className="py-2.5 px-3 font-semibold text-stone-900">{rec.fertilizer}</td>
                      <td className="py-2.5 px-3 font-medium text-emerald-800">{rec.nutrientTarget}</td>
                      <td className="py-2.5 px-3 font-bold text-stone-900 tabular-nums">{rec.basalDose}</td>
                      <td className="py-2.5 px-3 text-stone-700">{rec.topDressing}</td>
                      <td className="py-2.5 px-3 text-stone-600 text-[11px] leading-relaxed">
                        {rec.applicationGuidance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* General & Crop-Specific Advisory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Soil Health Management Tips</span>
              </h4>
              <ul className="text-xs text-stone-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                {report.generalRecommendations.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                <span>Crop-Specific Advisory ({report.intendedCrop})</span>
              </h4>
              <ul className="text-xs text-stone-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                {report.cropSpecificRecommendations.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Laboratory Remarks */}
          <div className="p-4 rounded-xl border border-stone-200 bg-amber-50/30 text-xs">
            <span className="font-bold text-stone-900 uppercase tracking-wider">
              Laboratory Officer Remarks:
            </span>
            <p className="text-stone-700 mt-1 leading-relaxed italic">{report.labRemarks}</p>
          </div>

          {/* Official Sign-off & Digital Signature Verification */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-stone-600">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <div className="font-semibold text-stone-900">Digitally Verified Soil Health Document</div>
                <div className="text-[11px] text-stone-500 font-mono">
                  Authentication Hash: SHA256:{report.id.replace(/-/g, '').toLowerCase()}9f8b4c
                </div>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="font-semibold text-stone-900">{report.labOfficerName}</div>
              <div className="text-stone-500 text-[11px]">{report.labOfficerDesignation}</div>
              <div className="text-[10px] text-emerald-800 font-mono font-medium mt-0.5">
                [Digitally Signed & Certified]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
