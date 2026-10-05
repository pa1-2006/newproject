import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sprout,
  Building2,
  Calendar,
  Layers,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  MapPin,
  AlertCircle,
  Plus,
  Info,
} from 'lucide-react';
import { TimeSlot, SoilType } from '../../types';

export const BookAppointmentWizard: React.FC = () => {
  const {
    currentUser,
    farms,
    addFarm,
    testingCenters,
    appointments,
    bookAppointment,
    setActiveNav,
    setIsGuideOpen,
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form states
  const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || '');
  const [showNewFarmForm, setShowNewFarmForm] = useState(farms.length === 0);
  const [newFarmName, setNewFarmName] = useState('');
  const [newSurveyNumber, setNewSurveyNumber] = useState('');
  const [newVillage, setNewVillage] = useState(currentUser.village || 'Keregodu');
  const [newAcreage, setNewAcreage] = useState<number>(3.0);
  const [newSoilType, setNewSoilType] = useState<SoilType>('Red Sandy Loam');
  const [newCurrentCrop, setNewCurrentCrop] = useState('Sugarcane (Co 86032)');

  const [selectedCenterId, setSelectedCenterId] = useState<string>(testingCenters[0]?.id || '');

  // Date selection: default to 2 days from now
  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getDefaultDate());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>('09:00 AM - 11:00 AM');

  // Sample info
  const [sampleCount, setSampleCount] = useState<number>(2);
  const [currentCrop, setCurrentCrop] = useState<string>('Sugarcane');
  const [intendedCrop, setIntendedCrop] = useState<string>('Paddy (JGL 1798 / Jyothi)');
  const [samplingDepthNotes, setSamplingDepthNotes] = useState<string>(
    'Collected at 15cm depth from 8 zig-zag spots across field.'
  );

  const [agreedToGuidelines, setAgreedToGuidelines] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Available slots configuration
  const timeSlots: TimeSlot[] = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
  ];

  // Calculate capacity for selected date & center
  const center = testingCenters.find((c) => c.id === selectedCenterId) || testingCenters[0];
  const maxCap = center?.maxDailyCapacity || 25;

  const getSlotCapacity = (date: string, slot: TimeSlot) => {
    const bookedInSlot = appointments.filter(
      (a) =>
        a.centerId === selectedCenterId &&
        a.appointmentDate === date &&
        a.timeSlot === slot &&
        a.status !== 'Cancelled'
    ).length;

    const slotMax = Math.ceil(maxCap / timeSlots.length);
    const remaining = Math.max(0, slotMax - bookedInSlot);
    return {
      remaining,
      total: slotMax,
      isFull: remaining === 0,
    };
  };

  const selectedFarm = farms.find((f) => f.id === selectedFarmId);

  // Handle Quick Farm Creation
  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmName.trim()) return;

    const created = addFarm({
      name: newFarmName,
      surveyNumber: newSurveyNumber || `SY-${Math.floor(100 + Math.random() * 900)}`,
      village: newVillage,
      district: currentUser.district || 'Mandya',
      state: currentUser.state || 'Karnataka',
      acreage: Number(newAcreage) || 2.0,
      soilType: newSoilType,
      currentCrop: newCurrentCrop,
      irrigationSource: 'Canal / Borewell',
      coordinates: { lat: 12.52, lng: 76.89 },
    });

    setSelectedFarmId(created.id);
    setShowNewFarmForm(false);
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedFarmId && !showNewFarmForm) {
      return;
    }
    setStep((prev) => Math.min(5, prev + 1));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleConfirmBooking = () => {
    if (!agreedToGuidelines) return;

    setIsSubmitting(true);
    setTimeout(() => {
      bookAppointment({
        farmId: selectedFarmId,
        centerId: selectedCenterId,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        sampleCount,
        currentCrop: currentCrop || selectedFarm?.currentCrop || 'General Field Crop',
        intendedCrop,
        samplingDepthNotes,
      });
      setIsSubmitting(false);
      setActiveNav('appointments');
    }, 600);
  };

  // Generate next 10 days for calendar picker
  const upcomingDates = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const isSunday = d.getDay() === 0;
    return { dateStr, dayName, dayNum, isSunday };
  });

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
      {/* Wizard Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Book Soil Testing Appointment
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Select your farm parcel, choose an accredited testing lab, and secure an intake slot.
            </p>
          </div>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            <Info className="w-4 h-4" />
            <span>Soil Sampling Guide</span>
          </button>
        </div>

        {/* 5-Step Visual Progress Bar */}
        <div className="mt-6 grid grid-cols-5 gap-2 text-center text-xs font-semibold">
          {[
            { num: 1, label: 'Farm Details' },
            { num: 2, label: 'Testing Lab' },
            { num: 3, label: 'Date & Slot' },
            { num: 4, label: 'Sample Info' },
            { num: 5, label: 'Review & Book' },
          ].map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-700 text-white'
                      : isCurrent
                      ? 'bg-emerald-900 text-white ring-4 ring-emerald-100'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`mt-1.5 hidden sm:inline-block truncate max-w-[80px] ${
                    isCurrent ? 'text-stone-900 font-bold' : 'text-stone-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Container */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
        {/* STEP 1: Farm Details */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-700" />
                <span>Step 1: Select or Add Farm Parcel</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Choose the land parcel from which you are submitting soil samples.
              </p>
            </div>

            {!showNewFarmForm ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {farms.map((f) => {
                    const isSelected = selectedFarmId === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => setSelectedFarmId(f.id)}
                        className={`cursor-pointer p-4 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                            : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-stone-900 text-sm">{f.name}</h4>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                        </div>
                        <div className="text-xs text-stone-600 mt-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <span>Survey No: {f.surveyNumber}</span>
                            <span>·</span>
                            <span>{f.acreage} Acres</span>
                          </div>
                          <div>Soil Type: {f.soilType}</div>
                          <div>Current Crop: {f.currentCrop}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewFarmForm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-stone-300 text-stone-700 text-xs font-semibold hover:border-emerald-500 hover:text-emerald-700 transition-colors w-full justify-center"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Register a New Farm Plot</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateFarm} className="space-y-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-xs font-bold text-stone-800">Add New Farm Plot</span>
                  {farms.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewFarmForm(false)}
                      className="text-xs text-stone-500 hover:text-stone-800"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Farm / Plot Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. East Canal Field"
                      value={newFarmName}
                      onChange={(e) => setNewFarmName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Survey / Khasra Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SY-104/3"
                      value={newSurveyNumber}
                      onChange={(e) => setNewSurveyNumber(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Acreage (Acres) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      value={newAcreage}
                      onChange={(e) => setNewAcreage(parseFloat(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Soil Type (if known)
                    </label>
                    <select
                      value={newSoilType}
                      onChange={(e) => setNewSoilType(e.target.value as SoilType)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      <option value="Black Clay (Regur)">Black Clay (Regur)</option>
                      <option value="Alluvial Loam">Alluvial Loam</option>
                      <option value="Red Sandy Loam">Red Sandy Loam</option>
                      <option value="Laterite Soil">Laterite Soil</option>
                      <option value="Silty Clay Loam">Silty Clay Loam</option>
                      <option value="Sandy Loam">Sandy Loam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Current Standing Crop
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cotton, Groundnut, Fallow"
                      value={newCurrentCrop}
                      onChange={(e) => setNewCurrentCrop(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Village / Locality
                    </label>
                    <input
                      type="text"
                      value={newVillage}
                      onChange={(e) => setNewVillage(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 transition-colors"
                  >
                    Save & Use This Farm
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* STEP 2: Testing Center */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" />
                <span>Step 2: Choose Soil Testing Laboratory</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Select an accredited government or agricultural university laboratory.
              </p>
            </div>

            <div className="space-y-3.5">
              {testingCenters.map((c) => {
                const isSelected = selectedCenterId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCenterId(c.id)}
                    className={`cursor-pointer p-5 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-sm">{c.name}</h4>
                          <span className="text-[11px] font-mono font-medium text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                            {c.code}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{c.address}</span>
                          <span>·</span>
                          <span className="font-semibold text-stone-700">~{c.distanceKm} km away</span>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />}
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{c.operatingHours}</span>
                      </div>
                      <div className="text-[11px] text-emerald-900 bg-emerald-100/40 px-2 py-0.5 rounded">
                        Daily Capacity: {c.maxDailyCapacity} samples
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.services.map((srv, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Date & Slot */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <span>Step 3: Appointment Date & Time Slot</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Laboratories have daily intake limits to prevent sample deterioration.
              </p>
            </div>

            {/* Date Selection Grid */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-2">
                Select Intake Date
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {upcomingDates.map((d) => {
                  const isSelected = selectedDate === d.dateStr;
                  const isClosed = d.isSunday;
                  return (
                    <button
                      key={d.dateStr}
                      type="button"
                      disabled={isClosed}
                      onClick={() => setSelectedDate(d.dateStr)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isClosed
                          ? 'opacity-40 cursor-not-allowed bg-stone-100 border-stone-200'
                          : isSelected
                          ? 'border-emerald-700 bg-emerald-800 text-white shadow-xs font-bold'
                          : 'border-stone-200 bg-white hover:border-stone-300 text-stone-800'
                      }`}
                    >
                      <div className="text-[11px] uppercase tracking-wider">{d.dayName}</div>
                      <div className="text-sm font-bold mt-0.5">{d.dayNum}</div>
                      {isClosed && <div className="text-[9px] mt-0.5">Closed</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-2">
                Available Time Slots for {selectedDate}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {timeSlots.map((slot) => {
                  const cap = getSlotCapacity(selectedDate, slot);
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={cap.isFull}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        cap.isFull
                          ? 'opacity-50 cursor-not-allowed bg-stone-100 border-stone-200'
                          : isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-stone-900">{slot}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {cap.isFull ? (
                            <span className="text-rose-600 font-semibold">Fully Booked</span>
                          ) : (
                            <span>{cap.remaining} slots remaining</span>
                          )}
                        </div>
                      </div>
                      {!cap.isFull && isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Sample Information */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-700" />
                <span>Step 4: Sample Details & Crop Intent</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Laboratory fertilizer recommendations will be tailored to your planned crop.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Number of Soil Samples (Bags) *
                </label>
                <select
                  value={sampleCount}
                  onChange={(e) => setSampleCount(parseInt(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                >
                  <option value={1}>1 Sample (Single Composite Bag - 500g)</option>
                  <option value={2}>2 Samples (Surface 0-15cm & Subsurface 15-30cm)</option>
                  <option value={3}>3 Samples (3 Distinct Field Zones)</option>
                  <option value={4}>4 Samples (4 Field Quadrants)</option>
                  <option value={5}>5 Samples (Extensive Multi-Zone Sampling)</option>
                </select>
                <p className="text-[11px] text-stone-500 mt-1">
                  Recommended: 1 composite sample for every 2-3 acres of uniform soil.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Current Standing / Previous Crop *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cotton, Groundnut, Wheat"
                  value={currentCrop}
                  onChange={(e) => setCurrentCrop(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Intended Next Crop (Sowing Intent) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wheat (GW-496), Mustard, Chickpea"
                  value={intendedCrop}
                  onChange={(e) => setIntendedCrop(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sampling Depth & Field Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0-15cm V-cut zig-zag, well-drained loamy plot"
                  value={samplingDepthNotes}
                  onChange={(e) => setSamplingDepthNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 leading-relaxed">
                <span className="font-semibold">Important Packaging Reminder: </span>
                Ensure soil is shade-dried on clean newspaper, free from pebbles or fresh manure.
                Pack approximately 500 grams into a clean poly bag per sample.
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Confirmation */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>Step 5: Review & Confirm Appointment</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Please verify all booking details before final confirmation.
              </p>
            </div>

            {/* Summary Grid */}
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 text-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-stone-200">
                <div>
                  <span className="text-stone-500 font-medium">Farmer Details</span>
                  <div className="font-semibold text-stone-900 text-sm mt-0.5">
                    {currentUser.name}
                  </div>
                  <div className="text-stone-600">{currentUser.phone} · {currentUser.village}, {currentUser.district}</div>
                </div>

                <div>
                  <span className="text-stone-500 font-medium">Farm Parcel</span>
                  <div className="font-semibold text-stone-900 text-sm mt-0.5">
                    {selectedFarm?.name || 'Selected Farm'}
                  </div>
                  <div className="text-stone-600">
                    Survey: {selectedFarm?.surveyNumber} · {selectedFarm?.acreage} Acres · {selectedFarm?.soilType}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-stone-200">
                <div>
                  <span className="text-stone-500 font-medium">Testing Laboratory</span>
                  <div className="font-semibold text-stone-900 text-sm mt-0.5">{center.name}</div>
                  <div className="text-stone-600">{center.address}</div>
                </div>

                <div>
                  <span className="text-stone-500 font-medium">Intake Appointment Slot</span>
                  <div className="font-semibold text-stone-900 text-sm mt-0.5">
                    {selectedDate} ({selectedSlot})
                  </div>
                  <div className="text-emerald-700 font-medium">Confirmed Slot Guaranteed</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-stone-500 font-medium">Sample Specification</span>
                  <div className="font-semibold text-stone-900 mt-0.5">
                    {sampleCount} Soil Sample Bag(s) (approx. 500g each)
                  </div>
                  <div className="text-stone-600">Notes: {samplingDepthNotes}</div>
                </div>

                <div>
                  <span className="text-stone-500 font-medium">Crops Evaluated</span>
                  <div className="text-stone-800 mt-0.5">
                    Current: <span className="font-semibold">{currentCrop}</span>
                  </div>
                  <div className="text-stone-800">
                    Intended Next Crop: <span className="font-semibold text-emerald-800">{intendedCrop}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist Agreement */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToGuidelines}
                onChange={(e) => setAgreedToGuidelines(e.target.checked)}
                className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-700"
              />
              <span className="text-xs text-stone-700 leading-relaxed">
                I confirm that the soil samples were collected using clean tools according to standard
                sampling guidelines, shade-dried, and will be submitted during the allotted time slot.
              </span>
            </label>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 pt-4 border-t border-stone-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!agreedToGuidelines || isSubmitting}
              onClick={handleConfirmBooking}
              className={`flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold shadow-md transition-all ${
                !agreedToGuidelines || isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? 'Securing Slot...' : 'Confirm Soil Test Appointment'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
