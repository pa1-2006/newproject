import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Smartphone,
  CheckCircle2,
  Sprout,
  FlaskConical,
  Shield,
  ArrowRight,
  X,
  Lock,
} from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { allUsers, currentUser, switchUser, registerFarmer } = useApp();

  const [mode, setMode] = useState<'switch' | 'farmer_login' | 'farmer_register'>('switch');

  // Login with Mobile + OTP
  const [mobilePhone, setMobilePhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regVillage, setRegVillage] = useState('Keregodu');
  const [regDistrict, setRegDistrict] = useState('Mandya');
  const [regState, setRegState] = useState('Karnataka');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobilePhone) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Match phone or switch to farmer
    const matched = allUsers.find(
      (u) => u.phone.replace(/\D/g, '').includes(mobilePhone.replace(/\D/g, ''))
    );
    if (matched) {
      switchUser(matched.id);
    } else {
      switchUser('usr-farmer-1');
    }
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerFarmer({
      name: regName,
      phone: regPhone || '+91 98799 00000',
      email: regEmail || `${regName.toLowerCase().replace(/\s+/g, '')}@kisanmail.in`,
      village: regVillage,
      district: regDistrict,
      state: regState,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">SoilCare Account & Persona Switcher</h3>
            <p className="text-[11px] text-stone-500">
              Access the SoilCare portal as farmer, lab chemist, or administrator
            </p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 border-b border-stone-200 text-xs font-semibold text-center">
          <button
            onClick={() => setMode('switch')}
            className={`py-2.5 transition-colors ${
              mode === 'switch'
                ? 'border-b-2 border-emerald-800 text-emerald-900 font-bold bg-emerald-50/30'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Switch Persona
          </button>
          <button
            onClick={() => setMode('farmer_login')}
            className={`py-2.5 transition-colors ${
              mode === 'farmer_login'
                ? 'border-b-2 border-emerald-800 text-emerald-900 font-bold bg-emerald-50/30'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            OTP Login
          </button>
          <button
            onClick={() => setMode('farmer_register')}
            className={`py-2.5 transition-colors ${
              mode === 'farmer_register'
                ? 'border-b-2 border-emerald-800 text-emerald-900 font-bold bg-emerald-50/30'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            New Farmer
          </button>
        </div>

        {/* MODE 1: Switch Persona (Quick Demo Switch) */}
        {mode === 'switch' && (
          <div className="p-5 space-y-3">
            <p className="text-xs text-stone-600 mb-2">
              Select an account to preview specific dashboard workflows and permissions:
            </p>

            {allUsers.map((user) => {
              const isSelected = currentUser.id === user.id;
              const roleIcons: Record<UserRole, React.ReactNode> = {
                farmer: <Sprout className="w-4 h-4 text-emerald-700" />,
                lab_staff: <FlaskConical className="w-4 h-4 text-blue-700" />,
                admin: <Shield className="w-4 h-4 text-purple-700" />,
              };

              return (
                <div
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                      {roleIcons[user.role]}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-xs">{user.name}</div>
                      <div className="text-[11px] text-stone-500 capitalize">
                        {user.role.replace('_', ' ')} · {user.district || user.department}
                      </div>
                    </div>
                  </div>

                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                </div>
              );
            })}
          </div>
        )}

        {/* MODE 2: Farmer Mobile + OTP Login */}
        {mode === 'farmer_login' && (
          <div className="p-5">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98251 44321"
                      value={mobilePhone}
                      onChange={(e) => setMobilePhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    We will send a 4-digit verification OTP to your registered mobile.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-800 text-white rounded-lg font-bold hover:bg-emerald-900 transition-colors shadow-xs"
                >
                  Request OTP Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-[11px]">
                  OTP sent to <strong>{mobilePhone}</strong> (Simulation: Enter <strong>1234</strong> or any 4 digits)
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Enter 4-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    placeholder="1234"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="w-full text-center tracking-widest text-lg font-bold p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-800 text-white rounded-lg font-bold hover:bg-emerald-900 transition-colors shadow-xs"
                >
                  Verify & Enter Portal
                </button>
              </form>
            )}
          </div>
        )}

        {/* MODE 3: New Farmer Registration */}
        {mode === 'farmer_register' && (
          <form onSubmit={handleRegisterSubmit} className="p-5 space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Farmer Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Baldev Patel"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98980 12345"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Village</label>
                <input
                  type="text"
                  placeholder="Kalyanpur"
                  value={regVillage}
                  onChange={(e) => setRegVillage(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">District</label>
                <input
                  type="text"
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">State</label>
                <input
                  type="text"
                  value={regState}
                  onChange={(e) => setRegState(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-800 text-white rounded-lg font-bold hover:bg-emerald-900 transition-colors shadow-xs"
              >
                Register & Open Farmer Dashboard
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
