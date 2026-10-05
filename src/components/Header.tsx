import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, User as UserIcon, Sprout, ChevronDown, Check, Shield, FlaskConical, Users, Database } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, onOpenAuth }) => {
  const {
    currentUser,
    currentRole,
    setCurrentRole,
    activeNav,
    setActiveNav,
    notifications,
    setIsSupabaseModalOpen,
    supabaseProjectId,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Filter unread notifications for current role or user
  const unreadCount = notifications.filter(
    (n) => !n.read && (n.userId === currentUser.id || n.role === currentRole || n.role === 'all')
  ).length;

  const roleNavItems: Record<UserRole, { id: string; label: string }[]> = {
    farmer: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'book', label: 'Book Test' },
      { id: 'appointments', label: 'My Appointments' },
      { id: 'reports', label: 'My Reports' },
      { id: 'farms', label: 'My Farms' },
    ],
    lab_staff: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'queue', label: 'Sample Queue' },
      { id: 'tests', label: 'Test Entry' },
      { id: 'reports', label: 'Reports' },
    ],
    admin: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'laboratories', label: 'Laboratories' },
      { id: 'appointments', label: 'Appointments' },
      { id: 'analytics', label: 'Analytics' },
      { id: 'announcements', label: 'Announcements' },
    ],
  };

  const currentNavItems = roleNavItems[currentRole] || [];

  const roleLabels: Record<UserRole, { title: string; badge: string; icon: React.ReactNode }> = {
    farmer: {
      title: 'Farmer Portal',
      badge: 'Farmer',
      icon: <Sprout className="w-4 h-4 text-emerald-700" />,
    },
    lab_staff: {
      title: 'Lab Console',
      badge: 'Lab Officer',
      icon: <FlaskConical className="w-4 h-4 text-blue-700" />,
    },
    admin: {
      title: 'Admin Desk',
      badge: 'Administrator',
      icon: <Shield className="w-4 h-4 text-purple-700" />,
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveNav('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-950 flex items-center justify-center text-white shadow-xs group-hover:from-emerald-800 group-hover:to-emerald-900 transition-all">
                <Sprout className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors">
                  Soil<span className="text-emerald-700">Care</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300/60">
                  {roleLabels[currentRole].badge}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single-line controls) */}
          <nav className="hidden md:flex items-center gap-1">
            {currentNavItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Role Switcher, Notifications, Profile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Supabase Live DB Badge */}
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 text-[11px] font-mono font-semibold text-stone-700 hover:bg-stone-50 hover:border-emerald-400 transition-colors"
              title="Click to check Supabase backend sync"
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span>DB: {supabaseProjectId}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </button>

            {/* Quick Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                title="Switch Portal Role"
              >
                {roleLabels[currentRole].icon}
                <span className="hidden sm:inline">{roleLabels[currentRole].badge}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50">
                  <div className="px-3 py-2 border-b border-stone-100 text-xs text-stone-500 font-medium">
                    Switch Portal View
                  </div>
                  {(['farmer', 'lab_staff', 'admin'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentRole(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left hover:bg-stone-50 transition-colors ${
                        currentRole === role ? 'text-emerald-800 bg-emerald-50/50' : 'text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {roleLabels[role].icon}
                        <span>{roleLabels[role].badge}</span>
                      </div>
                      {currentRole === role && <Check className="w-4 h-4 text-emerald-700" />}
                    </button>
                  ))}
                  <div className="border-t border-stone-100 pt-1 mt-1">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onOpenAuth();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-600 hover:bg-stone-50 text-left"
                    >
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      <span>Switch Demo Profile / Login</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar / Trigger */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-lg hover:bg-stone-100 transition-colors text-left"
              title="Profile & Demo Accounts"
            >
              <div className="w-7 h-7 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-700 font-semibold text-xs overflow-hidden">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-stone-600" />
                )}
              </div>
              <span className="hidden lg:inline text-xs font-medium text-stone-800 max-w-[120px] truncate">
                {currentUser.name}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2.5 border-t border-stone-100 scrollbar-none">
          {currentNavItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
