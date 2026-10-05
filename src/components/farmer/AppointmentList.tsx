import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, AppointmentStatus, TimeSlot } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Printer,
  XCircle,
  RefreshCw,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const AppointmentList: React.FC = () => {
  const {
    currentUser,
    appointments,
    rescheduleAppointment,
    cancelAppointment,
    setActiveNav,
    setSelectedReport,
    reports,
    setIsGuideOpen,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedSlipAppointment, setSelectedSlipAppointment] = useState<Appointment | null>(null);

  // Reschedule state
  const [rescheduleModalApp, setRescheduleModalApp] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState<TimeSlot>('09:00 AM - 11:00 AM');

  // Cancel state
  const [cancelModalApp, setCancelModalApp] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('Crop harvest delayed / Personal emergency');

  // Filter farmer appointments
  const farmerAppointments = appointments.filter(
    (a) => a.farmerId === currentUser.id || currentUser.role === 'admin'
  );

  const filtered = farmerAppointments.filter((app) => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Active')
      return !['Completed', 'Cancelled', 'Report Ready'].includes(app.status);
    if (statusFilter === 'Report Ready') return app.status === 'Report Ready';
    if (statusFilter === 'Cancelled') return app.status === 'Cancelled';
    return app.status === statusFilter;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    const config: Record<
      AppointmentStatus,
      { bg: string; text: string; border: string; icon: React.ReactNode }
    > = {
      Booked: {
        bg: 'bg-stone-100',
        text: 'text-stone-700',
        border: 'border-stone-200',
        icon: <Clock className="w-3.5 h-3.5 text-stone-500" />,
      },
      Confirmed: {
        bg: 'bg-sky-50',
        text: 'text-sky-800',
        border: 'border-sky-200',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />,
      },
      'Sample Submitted': {
        bg: 'bg-indigo-50',
        text: 'text-indigo-800',
        border: 'border-indigo-200',
        icon: <FileText className="w-3.5 h-3.5 text-indigo-600" />,
      },
      'Testing in Progress': {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        icon: <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />,
      },
      'Report Ready': {
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      },
      Completed: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-900',
        border: 'border-emerald-200',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />,
      },
      Cancelled: {
        bg: 'bg-rose-50',
        text: 'text-rose-800',
        border: 'border-rose-200',
        icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
      },
    };

    const c = config[status] || config.Booked;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
      >
        {c.icon}
        <span>{status}</span>
      </span>
    );
  };

  const handleOpenReschedule = (app: Appointment) => {
    setRescheduleModalApp(app);
    setNewDate(app.appointmentDate);
    setNewSlot(app.timeSlot);
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleModalApp || !newDate) return;
    rescheduleAppointment(rescheduleModalApp.id, newDate, newSlot);
    setRescheduleModalApp(null);
  };

  const handleConfirmCancel = () => {
    if (!cancelModalApp) return;
    cancelAppointment(cancelModalApp.id, cancelReason);
    setCancelModalApp(null);
  };

  const handleViewReport = (reportId?: string) => {
    if (!reportId) return;
    const found = reports.find((r) => r.id === reportId);
    if (found) {
      setSelectedReport(found);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Soil Testing Appointments
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track status from sample submission to lab testing and finalized soil report.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <span>Sampling Guide</span>
          </button>
          <button
            onClick={() => setActiveNav('book')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 shadow-xs transition-colors"
          >
            <span>+ Book New Appointment</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-200">
        {['All', 'Active', 'Report Ready', 'Cancelled'].map((tab) => {
          const isActive = statusFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Appointments List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-800 mt-3">No Appointments Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            No soil testing appointments match your selected filter criteria.
          </p>
          <button
            onClick={() => setActiveNav('book')}
            className="mt-4 px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
          >
            Book Your First Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const canReschedule = ['Booked', 'Confirmed'].includes(app.status);
            const canCancel = ['Booked', 'Confirmed'].includes(app.status);

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-stone-300 transition-all p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-mono text-stone-900">{app.id}</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs font-semibold text-stone-700">{app.farmName}</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs text-stone-500">{app.acreage} Acres</span>
                  </div>
                  <div>{getStatusBadge(app.status)}</div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 text-xs">
                  <div>
                    <span className="text-stone-400 font-medium">Testing Center</span>
                    <div className="font-semibold text-stone-900 mt-0.5">{app.centerName}</div>
                    <div className="text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>District Lab Hub</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 font-medium">Scheduled Intake Slot</span>
                    <div className="font-semibold text-stone-900 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{app.appointmentDate}</span>
                    </div>
                    <div className="text-stone-600 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>{app.timeSlot}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 font-medium">Sample Specification</span>
                    <div className="font-semibold text-stone-900 mt-0.5">
                      {app.sampleCount} Bag(s) · {app.sampleBarcodes.join(', ')}
                    </div>
                    <div className="text-stone-600 mt-0.5">
                      Target Crop: <span className="font-semibold text-emerald-800">{app.intendedCrop}</span>
                    </div>
                  </div>
                </div>

                {/* Status Timeline / Steps */}
                <div className="pt-3 pb-2 border-t border-stone-100">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium overflow-x-auto pb-1">
                    {[
                      'Booked',
                      'Confirmed',
                      'Sample Submitted',
                      'Testing in Progress',
                      'Report Ready',
                    ].map((stepName, idx) => {
                      const statusWeights: Record<string, number> = {
                        Booked: 1,
                        Confirmed: 2,
                        'Sample Submitted': 3,
                        'Testing in Progress': 4,
                        'Report Ready': 5,
                        Completed: 6,
                        Cancelled: 0,
                      };
                      const currentWeight = statusWeights[app.status] || 0;
                      const stepWeight = idx + 1;
                      const isDone = currentWeight >= stepWeight && app.status !== 'Cancelled';
                      const isCurrent = currentWeight === stepWeight && app.status !== 'Cancelled';

                      return (
                        <div key={stepName} className="flex items-center gap-1.5 shrink-0 px-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isDone
                                ? 'bg-emerald-700'
                                : isCurrent
                                ? 'bg-amber-500 ring-2 ring-amber-100'
                                : 'bg-stone-300'
                            }`}
                          />
                          <span
                            className={
                              isDone
                                ? 'text-stone-900 font-semibold'
                                : isCurrent
                                ? 'text-amber-800 font-bold'
                                : 'text-stone-400'
                            }
                          >
                            {stepName}
                          </span>
                          {idx < 4 && <span className="text-stone-200 mx-1">—</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedSlipAppointment(app)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Intake Confirmation Slip</span>
                    </button>
                    {app.reportId && (
                      <button
                        onClick={() => handleViewReport(app.reportId)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 text-xs font-bold transition-colors shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Soil Health Card</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {canReschedule && (
                      <button
                        onClick={() => handleOpenReschedule(app)}
                        className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors font-medium"
                      >
                        Reschedule Slot
                      </button>
                    )}
                    {canCancel && (
                      <button
                        onClick={() => setCancelModalApp(app)}
                        className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Appointment Confirmation Slip Modal */}
      {selectedSlipAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="no-print bg-stone-900 text-white p-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                Official Intake Slip
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1 px-3 py-1 bg-emerald-700 text-white text-xs font-semibold rounded hover:bg-emerald-800"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setSelectedSlipAppointment(null)}
                  className="text-stone-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs text-stone-800">
              <div className="text-center border-b border-stone-200 pb-3">
                <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  SoilCare Diagnostic Network
                </div>
                <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                  SoilCare Intake Confirmation Slip
                </h3>
                <div className="font-mono text-stone-500 mt-1">
                  Appointment ID: {selectedSlipAppointment.id}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div>
                  <span className="text-stone-500">Farmer:</span>
                  <div className="font-semibold text-stone-900">
                    {selectedSlipAppointment.farmerName}
                  </div>
                  <div className="font-mono text-stone-600">{selectedSlipAppointment.farmerPhone}</div>
                </div>
                <div>
                  <span className="text-stone-500">Scheduled Date & Slot:</span>
                  <div className="font-semibold text-emerald-900">
                    {selectedSlipAppointment.appointmentDate}
                  </div>
                  <div className="font-semibold text-stone-700">{selectedSlipAppointment.timeSlot}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-stone-500">Testing Center:</div>
                <div className="font-semibold text-stone-900">
                  {selectedSlipAppointment.centerName}
                </div>
              </div>

              <div className="border border-dashed border-stone-300 p-3 rounded-lg text-center bg-stone-50">
                <div className="font-bold text-stone-800 mb-1">Assigned Sample Barcode Tags</div>
                <div className="flex flex-wrap justify-center gap-2 font-mono font-bold text-stone-900">
                  {selectedSlipAppointment.sampleBarcodes.map((code) => (
                    <span key={code} className="px-2 py-1 bg-white border border-stone-300 rounded">
                      {code}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-stone-500 mt-2">
                  Attach these tags or write barcodes clearly with permanent marker on each dry sample bag.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <strong>Submission Instructions:</strong> Please present this slip along with shade-dried
                500g soil samples at the lab reception desk during your allotted intake slot.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalApp && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">Reschedule Appointment Slot</h3>
            <p className="text-xs text-stone-500 mt-1">
              Select a new date and time slot for {rescheduleModalApp.id}.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  New Time Slot
                </label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value as TimeSlot)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRescheduleModalApp(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalApp && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 text-rose-900">
              Cancel Appointment {cancelModalApp.id}?
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Are you sure you wish to cancel? The booked laboratory slot will be released for other
              farmers.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-600"
              >
                <option value="Harvesting delayed / personal emergency">
                  Harvesting delayed / personal emergency
                </option>
                <option value="Selected wrong farm parcel or test lab">
                  Selected wrong farm parcel or test lab
                </option>
                <option value="Soil is still too wet from recent rain">
                  Soil is still too wet from recent rain
                </option>
                <option value="Other agricultural reasons">Other agricultural reasons</option>
              </select>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelModalApp(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
