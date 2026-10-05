import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sprout,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Layers,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import heroImg from '../../assets/images/hero_farmer_soil_field_1791162273799.jpg';
import labHeroImg from '../../assets/images/soil_testing_lab_technician_1791162290301.jpg';

export const FarmerDashboard: React.FC = () => {
  const {
    currentUser,
    appointments,
    reports,
    farms,
    setActiveNav,
    setSelectedReport,
    setIsGuideOpen,
  } = useApp();

  // Metrics calculation
  const farmerAppointments = appointments.filter(
    (a) => a.farmerId === currentUser.id || currentUser.role === 'admin'
  );
  const farmerReports = reports.filter(
    (r) => r.farmerId === currentUser.id || currentUser.role === 'admin'
  );

  const completedTests = farmerReports.length;
  const pendingReports = farmerAppointments.filter((a) =>
    ['Sample Submitted', 'Testing in Progress'].includes(a.status)
  ).length;

  // Find nearest upcoming appointment
  const upcomingAppointment = farmerAppointments
    .filter((a) => ['Booked', 'Confirmed'].includes(a.status))
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())[0];

  // Latest completed report
  const latestReport = farmerReports[0];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Unique SoilCare Hero Section with Crisp Photography & Agricultural Accent */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200/90 bg-gradient-to-br from-[#123E28] via-[#17462E] to-[#2B1B10] text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Column: SoilCare Mission & CTAs */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between z-10 space-y-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold backdrop-blur-xs mb-3 border border-emerald-500/30">
                <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                <span>SoilCare Diagnostic Network · Certified Testing Protocol</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Welcome to SoilCare, <span className="text-emerald-300">{currentUser.name}</span>!
              </h1>
              <p className="text-xs sm:text-sm text-stone-200 mt-2.5 leading-relaxed max-w-xl">
                Nurture your farmland with precision soil analytics. Book accredited lab tests,
                track live sample analysis, and receive tailored crop nutrient guidance to boost yields
                and reduce unnecessary fertilizer expenses.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveNav('book')}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>+ Book Soil Test Appointment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsGuideOpen(true)}
                className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors border border-white/25 flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                <span>Field Sampling Guide</span>
              </button>
            </div>

            {/* Micro feature badges */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-[11px] text-stone-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>12-Nutrient Complete Assay</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Government Certified Labs</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>SMS & Digital Health Card</span>
              </span>
            </div>
          </div>

          {/* Right Column: Prominent High-Fidelity Agricultural Image Showcase */}
          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full overflow-hidden">
            <img
              src={heroImg}
              alt="Farmer inspecting rich fertile soil in sunlit field"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Subtle Gradient Framing */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#123E28]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#123E28] lg:via-transparent lg:to-transparent" />
            
            {/* Overlay Soil Tag */}
            <div className="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-right">
              <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                Soil Health First
              </div>
              <div className="text-xs font-semibold text-white">Fertile Soil · Resilient Crops</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Completed Tests</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {completedTests}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Soil Health Cards Issued</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Upcoming Intake</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {upcomingAppointment ? '1 Active' : '0'}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">
            {upcomingAppointment ? upcomingAppointment.appointmentDate : 'No scheduled test'}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">In Testing Queue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {pendingReports}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Samples at Laboratory</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Registered Land</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {farms.reduce((acc, f) => acc + f.acreage, 0).toFixed(1)} <span className="text-xs font-normal">Acres</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">{farms.length} distinct plot(s)</div>
        </div>
      </div>

      {/* Main Dashboard Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Appointment & Latest Test Results (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointment Spotlight Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-sm">Next Testing Appointment</h3>
              </div>
              <button
                onClick={() => setActiveNav('appointments')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingAppointment ? (
              <div className="mt-4 p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 text-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {upcomingAppointment.id}
                    </span>
                    <span className="text-stone-400 mx-2">·</span>
                    <span className="font-semibold text-stone-800">
                      {upcomingAppointment.farmName}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                    {upcomingAppointment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-stone-600">
                  <div>
                    <span className="text-stone-400">Date:</span>{' '}
                    <span className="font-semibold text-stone-900">
                      {upcomingAppointment.appointmentDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400">Slot:</span>{' '}
                    <span className="font-semibold text-stone-900">
                      {upcomingAppointment.timeSlot}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400">Samples:</span>{' '}
                    <span className="font-semibold text-stone-900">
                      {upcomingAppointment.sampleCount} Bag(s)
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 pt-2 border-t border-emerald-100/70">
                  Lab: <span className="font-medium text-stone-700">{upcomingAppointment.centerName}</span>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-6 rounded-xl border border-dashed border-stone-200 text-center">
                <p className="text-xs text-stone-500">
                  You have no appointments currently scheduled. Testing before sowing is
                  strongly recommended.
                </p>
                <button
                  onClick={() => setActiveNav('book')}
                  className="mt-3 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900"
                >
                  Book Soil Test Now
                </button>
              </div>
            )}
          </div>

          {/* Latest Soil Test Result Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-sm">Latest Soil Health Assessment</h3>
              </div>
              <button
                onClick={() => setActiveNav('reports')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                <span>All Reports</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {latestReport ? (
              <div className="mt-4 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div>
                    <div className="font-bold text-stone-900 text-sm">{latestReport.farmName}</div>
                    <div className="text-xs text-stone-500">
                      Card ID: <span className="font-mono">{latestReport.id}</span> · Tested on {latestReport.testingCompletedDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">
                      Index: {latestReport.soilHealthIndex} / 100
                    </span>
                    <button
                      onClick={() => setSelectedReport(latestReport)}
                      className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold"
                    >
                      View Card
                    </button>
                  </div>
                </div>

                {/* Quick N-P-K & pH visual bars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl border border-stone-200 bg-white">
                    <div className="text-stone-400 text-[10px]">Soil Reaction</div>
                    <div className="font-bold text-stone-900 text-sm mt-0.5">
                      pH {latestReport.parameters.pH.value}
                    </div>
                    <div className="text-emerald-700 text-[10px] font-semibold mt-1">
                      {latestReport.parameters.pH.status}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-stone-200 bg-white">
                    <div className="text-stone-400 text-[10px]">Nitrogen (N)</div>
                    <div className="font-bold text-stone-900 text-sm mt-0.5">
                      {latestReport.parameters.nitrogen.value} kg/ha
                    </div>
                    <div className="text-amber-700 text-[10px] font-semibold mt-1">
                      {latestReport.parameters.nitrogen.status}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-stone-200 bg-white">
                    <div className="text-stone-400 text-[10px]">Phosphorus (P)</div>
                    <div className="font-bold text-stone-900 text-sm mt-0.5">
                      {latestReport.parameters.phosphorus.value} kg/ha
                    </div>
                    <div className="text-emerald-700 text-[10px] font-semibold mt-1">
                      {latestReport.parameters.phosphorus.status}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-stone-200 bg-white">
                    <div className="text-stone-400 text-[10px]">Potassium (K)</div>
                    <div className="font-bold text-stone-900 text-sm mt-0.5">
                      {latestReport.parameters.potassium.value} kg/ha
                    </div>
                    <div className="text-purple-700 text-[10px] font-semibold mt-1">
                      {latestReport.parameters.potassium.status}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950">
                  <span className="font-bold">Agronomist Note: </span>
                  {latestReport.labRemarks}
                </div>
              </div>
            ) : (
              <div className="mt-4 p-6 rounded-xl border border-dashed border-stone-200 text-center">
                <p className="text-xs text-stone-500">
                  No completed soil test reports yet. Once your sample is tested by the lab,
                  your complete Soil Health Card will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Navigation & Seasonal Advisory (1 col) */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-stone-900 text-sm">Quick Actions</h3>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setActiveNav('book')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-stone-900">Book Soil Test</div>
                    <div className="text-[11px] text-stone-500">Select date & laboratory</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-800" />
              </button>

              <button
                onClick={() => setActiveNav('appointments')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-stone-900">My Appointments</div>
                    <div className="text-[11px] text-stone-500">Slips & status tracker</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                onClick={() => setActiveNav('reports')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-stone-900">My Reports</div>
                    <div className="text-[11px] text-stone-500">Download Soil Health Cards</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                onClick={() => setActiveNav('farms')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-stone-900">Farm Parcels</div>
                    <div className="text-[11px] text-stone-500">Manage survey numbers</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </div>

          {/* Accredited Lab Diagnostic Network Card */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="relative h-28 overflow-hidden">
              <img
                src={labHeroImg}
                alt="Accredited Soil Testing Laboratory"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                <span className="text-xs font-bold">Accredited Lab Testing</span>
                <span className="text-[10px] bg-emerald-600/90 px-1.5 py-0.5 rounded font-medium">NABL & ICAR</span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-xs text-stone-600 leading-relaxed">
                State-of-the-art spectrophotometry & flame photometric assay for 12 essential nutrients.
              </p>
              <button
                onClick={() => setActiveNav('book')}
                className="w-full py-1.5 px-3 rounded-lg border border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs font-bold text-center transition-colors"
              >
                Locate Nearby Soil Laboratory
              </button>
            </div>
          </div>

          {/* Seasonal Advisory Card */}
          <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Rabi 2026 Seasonal Notice</span>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Applying balanced fertilizer dosages based on actual laboratory NPK deficiency avoids
              excessive urea usage and saves up to ₹1,800/acre while improving soil microbiology.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="text-xs text-white underline hover:text-emerald-200 font-semibold"
              >
                Review Proper Soil Sampling Steps ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
