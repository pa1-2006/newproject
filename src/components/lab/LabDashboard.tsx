import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FlaskConical,
  Clock,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Search,
  Filter,
  Layers,
  Printer,
  UploadCloud,
  ChevronRight,
  User,
  MapPin,
  X,
} from 'lucide-react';
import { Appointment, AppointmentStatus, SoilReport, SoilParameter } from '../../types';
import labHeroImg from '../../assets/images/soil_testing_lab_technician_1791162290301.jpg';

export const LabDashboard: React.FC = () => {
  const {
    currentUser,
    appointments,
    updateAppointmentStatus,
    publishLabReport,
    reports,
    setSelectedReport,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'queue' | 'entry' | 'completed'>('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal for entering test measurements
  const [selectedAppForTesting, setSelectedAppForTesting] = useState<Appointment | null>(null);

  // 12 Parameter Form State
  const [paramPH, setParamPH] = useState<number>(7.2);
  const [paramEC, setParamEC] = useState<number>(0.45);
  const [paramOC, setParamOC] = useState<number>(0.55);
  const [paramN, setParamN] = useState<number>(240);
  const [paramP, setParamP] = useState<number>(18.5);
  const [paramK, setParamK] = useState<number>(260);
  const [paramS, setParamS] = useState<number>(9.5);
  const [paramZn, setParamZn] = useState<number>(0.55);
  const [paramFe, setParamFe] = useState<number>(6.5);
  const [paramMn, setParamMn] = useState<number>(3.2);
  const [paramCu, setParamCu] = useState<number>(0.35);
  const [paramB, setParamB] = useState<number>(0.48);

  const [overallAssessment, setOverallAssessment] = useState<SoilReport['overallAssessment']>(
    'Moderately Fertile'
  );
  const [labRemarks, setLabRemarks] = useState(
    'Soil reaction is neutral. Available Nitrogen and Zinc are deficient. Recommended basal zinc sulphate application.'
  );

  // Status computation helpers for 12 parameters
  const calcStatus = (val: number, low: number, high: number): 'Low' | 'Optimal' | 'High' => {
    if (val < low) return 'Low';
    if (val > high) return 'High';
    return 'Optimal';
  };

  // Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.appointmentDate === todayStr).length;
  const inQueue = appointments.filter((a) => a.status === 'Sample Submitted').length;
  const inTesting = appointments.filter((a) => a.status === 'Testing in Progress').length;
  const readyReports = appointments.filter((a) => a.status === 'Report Ready').length;
  const completedReports = reports.length;

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.farmName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' ? true : app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenTestEntry = (app: Appointment) => {
    setSelectedAppForTesting(app);
    // Pre-seed realistic values based on crop
    setParamPH(7.3);
    setParamEC(0.42);
    setParamOC(0.58);
    setParamN(245);
    setParamP(19.2);
    setParamK(280);
    setParamS(8.9);
    setParamZn(0.52);
    setParamFe(6.4);
    setParamMn(3.1);
    setParamCu(0.36);
    setParamB(0.46);
    setOverallAssessment('Moderately Fertile');
    setLabRemarks(
      `Soil test for ${app.intendedCrop} on plot ${app.farmName}. Primary deficiency detected in available Nitrogen and Zinc.`
    );
  };

  const handleSaveAndPublishReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForTesting) return;

    // Build the 12 parameters
    const parameters = {
      pH: {
        name: 'Soil Reaction (pH)',
        chemicalSymbol: 'pH',
        value: Number(paramPH),
        unit: 'pH Units',
        status: calcStatus(paramPH, 6.5, 7.5),
        optimalRange: '6.5 - 7.5',
        method: '1:2.5 Suspension Potentiometric',
        description: 'Soil reaction index.',
      },
      ec: {
        name: 'Electrical Conductivity',
        chemicalSymbol: 'EC',
        value: Number(paramEC),
        unit: 'dS/m',
        status: calcStatus(paramEC, 0.1, 1.0),
        optimalRange: '< 1.0 dS/m',
        method: 'Conductivity Cell',
        description: 'Soluble salts index.',
      },
      organicCarbon: {
        name: 'Organic Carbon',
        chemicalSymbol: 'OC',
        value: Number(paramOC),
        unit: '%',
        status: calcStatus(paramOC, 0.5, 0.75),
        optimalRange: '0.50 - 0.75%',
        method: 'Walkley & Black Method',
        description: 'Humus and microbial carbon reserve.',
      },
      nitrogen: {
        name: 'Available Nitrogen',
        chemicalSymbol: 'N',
        value: Number(paramN),
        unit: 'kg/ha',
        status: calcStatus(paramN, 280, 560),
        optimalRange: '280 - 560 kg/ha',
        method: 'Alkaline Permanganate',
        description: 'Available plant-absorbable nitrogen.',
      },
      phosphorus: {
        name: 'Available Phosphorus',
        chemicalSymbol: 'P₂O₅',
        value: Number(paramP),
        unit: 'kg/ha',
        status: calcStatus(paramP, 10, 25),
        optimalRange: '10 - 25 kg/ha',
        method: 'Olsen Extraction',
        description: 'Readily available phosphate.',
      },
      potassium: {
        name: 'Available Potassium',
        chemicalSymbol: 'K₂O',
        value: Number(paramK),
        unit: 'kg/ha',
        status: calcStatus(paramK, 140, 280),
        optimalRange: '140 - 280 kg/ha',
        method: 'Flame Photometer',
        description: 'Readily available potash.',
      },
      sulphur: {
        name: 'Available Sulphur',
        chemicalSymbol: 'S',
        value: Number(paramS),
        unit: 'ppm',
        status: calcStatus(paramS, 10, 20),
        optimalRange: '10 - 20 ppm',
        method: '0.15% CaCl₂ Turbidimetric',
        description: 'Secondary nutrient for protein synthesis.',
      },
      zinc: {
        name: 'Available Zinc',
        chemicalSymbol: 'Zn',
        value: Number(paramZn),
        unit: 'ppm',
        status: calcStatus(paramZn, 0.6, 1.2),
        optimalRange: '0.6 - 1.2 ppm',
        method: 'DTPA Extraction AAS',
        description: 'Essential micronutrient enzyme activator.',
      },
      iron: {
        name: 'Available Iron',
        chemicalSymbol: 'Fe',
        value: Number(paramFe),
        unit: 'ppm',
        status: calcStatus(paramFe, 4.5, 9.0),
        optimalRange: '4.5 - 9.0 ppm',
        method: 'DTPA Extraction AAS',
        description: 'Chlorophyll synthesis promoter.',
      },
      manganese: {
        name: 'Available Manganese',
        chemicalSymbol: 'Mn',
        value: Number(paramMn),
        unit: 'ppm',
        status: calcStatus(paramMn, 2.0, 5.0),
        optimalRange: '2.0 - 5.0 ppm',
        method: 'DTPA Extraction AAS',
        description: 'Enzyme cofactor.',
      },
      copper: {
        name: 'Available Copper',
        chemicalSymbol: 'Cu',
        value: Number(paramCu),
        unit: 'ppm',
        status: calcStatus(paramCu, 0.2, 0.5),
        optimalRange: '0.2 - 0.5 ppm',
        method: 'DTPA Extraction AAS',
        description: 'Lignification and defense enzyme.',
      },
      boron: {
        name: 'Available Boron',
        chemicalSymbol: 'B',
        value: Number(paramB),
        unit: 'ppm',
        status: calcStatus(paramB, 0.5, 1.0),
        optimalRange: '0.5 - 1.0 ppm',
        method: 'Azomethine-H',
        description: 'Flowering and grain development.',
      },
    };

    const fertilizerRecommendations = [
      {
        fertilizer: 'Urea (46% N)',
        nutrientTarget: 'Nitrogen (N)',
        basalDose: '50 kg / acre',
        topDressing: '50 kg / acre at first weeding',
        applicationGuidance: 'Apply in 2 equal splits in moist soil.',
      },
      {
        fertilizer: 'DAP (18:46:0)',
        nutrientTarget: 'Phosphorus (P₂O₅)',
        basalDose: '35 kg / acre',
        topDressing: 'Nil',
        applicationGuidance: 'Place 5cm below seed furrow.',
      },
      {
        fertilizer: 'MOP (60% K₂O)',
        nutrientTarget: 'Potassium (K₂O)',
        basalDose: '15 kg / acre',
        topDressing: 'Nil',
        applicationGuidance: 'Incorporate into soil during final ploughing.',
      },
      {
        fertilizer: 'Zinc Sulphate (21% Zn)',
        nutrientTarget: 'Zinc & Sulphur (Zn, S)',
        basalDose: '10 kg / acre',
        topDressing: 'Nil (or 0.5% foliar spray if chlorosis appears)',
        applicationGuidance: 'Broadcast evenly before sowing.',
      },
    ];

    const generalRecommendations = [
      'Incorporate 4 tonnes/acre well-decomposed FYM or compost.',
      'Adopt micro-irrigation to maximize nutrient use efficiency.',
      'Rotate with short-duration green manure crops during fallow.',
    ];

    const cropSpecificRecommendations = [
      `For ${selectedAppForTesting.intendedCrop}: Ensure adequate basal phosphorus placement.`,
      'Maintain recommended row-to-row spacing for optimal light penetration.',
    ];

    publishLabReport(selectedAppForTesting.id, {
      overallAssessment,
      parameters,
      fertilizerRecommendations,
      generalRecommendations,
      cropSpecificRecommendations,
      labRemarks,
    });

    setSelectedAppForTesting(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Lab Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 bg-stone-900 text-white min-h-[180px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src={labHeroImg}
          alt="Soil Testing Laboratory Staff"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity hover:opacity-35 transition-opacity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/60 to-transparent" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/80 text-blue-100 text-xs font-semibold backdrop-blur-xs mb-2">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>KVK Soil Analytical Wing · ICAR Certified Standards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Laboratory Analytical Console
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 mt-1">
            Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.designation})
          </p>
        </div>
      </div>

      {/* Lab Metric KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Today's Intake</span>
          <div className="mt-2 text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {todayAppointments}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Scheduled today</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Sample Queue</span>
          <div className="mt-2 text-2xl font-bold font-mono text-indigo-700 tabular-nums">
            {inQueue}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Awaiting processing</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Under Testing</span>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-700 tabular-nums">
            {inTesting}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Assay in progress</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Reports Ready</span>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {readyReports}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Published & notified</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Total Tested</span>
          <div className="mt-2 text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {completedReports}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">All-time archives</div>
        </div>
      </div>

      {/* Main Queue Table & Controls */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Table Filters Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-stone-900 text-sm">Laboratory Sample Workflow</h3>
            <span className="text-xs text-stone-500">({filteredAppointments.length} records)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search ID, farmer, farm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Sample Submitted">Sample Submitted</option>
              <option value="Testing in Progress">Testing in Progress</option>
              <option value="Report Ready">Report Ready</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Workflow Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                <th className="py-3 px-4">Appt ID & Barcodes</th>
                <th className="py-3 px-4">Farmer Details</th>
                <th className="py-3 px-4">Farm Parcel & Crop</th>
                <th className="py-3 px-4">Scheduled Slot</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Laboratory Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 font-normal">
              {filteredAppointments.map((app) => (
                <tr key={app.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-stone-900">{app.id}</div>
                    <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                      {app.sampleBarcodes.join(', ')} ({app.sampleCount} bags)
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-stone-900">{app.farmerName}</div>
                    <div className="text-[11px] text-stone-500 font-mono">{app.farmerPhone}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-stone-900">{app.farmName}</div>
                    <div className="text-[11px] text-stone-500">
                      Current: {app.currentCrop} ➔ Intended: <strong className="text-emerald-800">{app.intendedCrop}</strong>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-stone-800">{app.appointmentDate}</div>
                    <div className="text-[11px] text-stone-500">{app.timeSlot}</div>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateAppointmentStatus(app.id, e.target.value as AppointmentStatus)
                      }
                      className="text-xs font-semibold px-2 py-1 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                    >
                      <option value="Booked">Booked</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Sample Submitted">Sample Submitted</option>
                      <option value="Testing in Progress">Testing in Progress</option>
                      <option value="Report Ready">Report Ready</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {app.reportId ? (
                        <button
                          onClick={() => {
                            const r = reports.find((rep) => rep.id === app.reportId);
                            if (r) setSelectedReport(r);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-semibold hover:bg-emerald-200 transition-colors text-xs"
                        >
                          View Card
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenTestEntry(app)}
                          className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold transition-colors text-xs flex items-center gap-1 shadow-xs"
                        >
                          <FlaskConical className="w-3.5 h-3.5" />
                          <span>Enter 12 Nutrients</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Enter 12 Soil Nutrient Measurements */}
      {selectedAppForTesting && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                  Soil Chemistry Diagnostic Worksheet
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Enter 12 Parameters for {selectedAppForTesting.id}
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  Farmer: {selectedAppForTesting.farmerName} · Plot: {selectedAppForTesting.farmName} ({selectedAppForTesting.intendedCrop})
                </p>
              </div>
              <button
                onClick={() => setSelectedAppForTesting(null)}
                className="text-blue-200 hover:text-white p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveAndPublishReport} className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
              {/* Reaction & Macronutrients */}
              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-200 text-xs">
                  Section 1: Soil Reaction & Macronutrients (NPK)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      pH (Optimal: 6.5 - 7.5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={paramPH}
                      onChange={(e) => setParamPH(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      EC dS/m (&lt; 1.0 dS/m)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={paramEC}
                      onChange={(e) => setParamEC(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Organic Carbon % (0.5 - 0.75%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={paramOC}
                      onChange={(e) => setParamOC(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Available N (kg/ha) [280-560]
                    </label>
                    <input
                      type="number"
                      required
                      value={paramN}
                      onChange={(e) => setParamN(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Available P (kg/ha) [10-25]
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={paramP}
                      onChange={(e) => setParamP(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Available K (kg/ha) [140-280]
                    </label>
                    <input
                      type="number"
                      required
                      value={paramK}
                      onChange={(e) => setParamK(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>
                </div>
              </div>

              {/* Secondary & Micronutrients (AAS & Turbidimetric) */}
              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-200 text-xs">
                  Section 2: Secondary & Micronutrients (S, Zn, Fe, Mn, Cu, B in ppm)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Sulphur S (10 - 20 ppm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={paramS}
                      onChange={(e) => setParamS(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Zinc Zn (0.6 - 1.2 ppm)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={paramZn}
                      onChange={(e) => setParamZn(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Iron Fe (4.5 - 9.0 ppm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={paramFe}
                      onChange={(e) => setParamFe(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Manganese Mn (2.0 - 5.0 ppm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={paramMn}
                      onChange={(e) => setParamMn(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Copper Cu (0.2 - 0.5 ppm)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={paramCu}
                      onChange={(e) => setParamCu(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Boron B (0.5 - 1.0 ppm)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={paramB}
                      onChange={(e) => setParamB(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>
                </div>
              </div>

              {/* Assessment & Remarks */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Overall Soil Fertility Classification
                  </label>
                  <select
                    value={overallAssessment}
                    onChange={(e) =>
                      setOverallAssessment(e.target.value as SoilReport['overallAssessment'])
                    }
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white"
                  >
                    <option value="Highly Fertile">Highly Fertile</option>
                    <option value="Moderately Fertile">Moderately Fertile</option>
                    <option value="Deficient in Micronutrients">Deficient in Micronutrients</option>
                    <option value="High Salinity Risk">High Salinity Risk</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Chemist Observations & Field Remarks
                  </label>
                  <textarea
                    rows={3}
                    value={labRemarks}
                    onChange={(e) => setLabRemarks(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-700 leading-relaxed"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                <span className="text-[11px] text-blue-900">
                  Publishing will immediately generate the official Soil Health Card and alert the farmer via in-app & SMS.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAppForTesting(null)}
                    className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white rounded-lg font-bold shadow-md transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Finalize & Publish Soil Card</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
