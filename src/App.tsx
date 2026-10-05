import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { BookAppointmentWizard } from './components/farmer/BookAppointmentWizard';
import { AppointmentList } from './components/farmer/AppointmentList';
import { ReportsList } from './components/farmer/ReportsList';
import { FarmManager } from './components/farmer/FarmManager';
import { ReportViewer } from './components/farmer/ReportViewer';
import { SampleCollectionGuideModal } from './components/farmer/SampleCollectionGuideModal';
import { LabDashboard } from './components/lab/LabDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationsModal } from './components/common/NotificationsModal';
import { AuthModal } from './components/auth/AuthModal';
import { SupabaseStatusModal } from './components/common/SupabaseStatusModal';
import { Sprout, Phone, ShieldCheck, Database } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentRole,
    activeNav,
    selectedReport,
    setSelectedReport,
    isGuideOpen,
    setIsGuideOpen,
    isSupabaseModalOpen,
    setIsSupabaseModalOpen,
    supabaseProjectId,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Render view based on role & active navigation
  const renderMainView = () => {
    if (currentRole === 'farmer') {
      switch (activeNav) {
        case 'book':
          return <BookAppointmentWizard />;
        case 'appointments':
          return <AppointmentList />;
        case 'reports':
          return <ReportsList />;
        case 'farms':
          return <FarmManager />;
        case 'dashboard':
        default:
          return <FarmerDashboard />;
      }
    }

    if (currentRole === 'lab_staff') {
      return <LabDashboard />;
    }

    if (currentRole === 'admin') {
      return <AdminDashboard />;
    }

    return <FarmerDashboard />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900">
      {/* Top Bar Header */}
      <Header
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">{renderMainView()}</main>

      {/* Global Clean Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-xs text-stone-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-stone-800">
              SoilCare · Modern Soil Testing & Farm Nutrient Diagnostic Network
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-stone-600">
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 text-[11px] font-mono border border-stone-200 transition-colors"
              title="Click to view Supabase connection status & SQL schema"
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span>Supabase: {supabaseProjectId}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            </button>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-800" />
              <span>Kisan Call Centre: 1800-180-1551</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Certified NABL & ICAR Norms</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Common Modals */}
      {selectedReport && (
        <ReportViewer report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}

      <SampleCollectionGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <SupabaseStatusModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Toast Feedbacks */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
