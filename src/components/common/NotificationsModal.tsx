import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  Calendar,
  FileText,
  Clock,
  MessageSquare,
  Smartphone,
  X,
  Check,
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    currentUser,
    currentRole,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedReport,
    reports,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [previewSMS, setPreviewSMS] = useState<NotificationItem | null>(null);

  if (!isOpen) return null;

  // Filter for current user/role
  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser.id || n.role === currentRole || n.role === 'all'
  );

  const filtered = userNotifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4 text-sky-600" />;
      case 'status':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'report':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'announcement':
        return <Bell className="w-4 h-4 text-purple-600" />;
    }
  };

  const handleClickItem = (item: NotificationItem) => {
    markNotificationRead(item.id);
    if (item.type === 'report' && item.relatedId) {
      const rep = reports.find((r) => r.id === item.relatedId);
      if (rep) {
        setSelectedReport(rep);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Notifications & Reminders</h3>
              <p className="text-[11px] text-stone-500">
                In-app alerts and SMS/WhatsApp notifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-stone-600 hover:text-stone-900 font-semibold"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-2 bg-stone-50/50 border-b border-stone-200 flex items-center gap-1.5 overflow-x-auto">
          {['all', 'appointment', 'status', 'report', 'announcement'].map((ft) => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                filterType === ft
                  ? 'bg-stone-800 text-white'
                  : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              {ft}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-stone-100 p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              No notifications in this category.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleClickItem(item)}
                className={`p-3.5 rounded-xl cursor-pointer transition-colors flex items-start gap-3 ${
                  !item.read ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-stone-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-stone-100 shrink-0 mt-0.5">{getIcon(item.type)}</div>
                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-stone-900 truncate">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-stone-600 mt-1 leading-relaxed">{item.message}</p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-stone-400">
                    <span>{new Date(item.date).toLocaleDateString()} · {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewSMS(item);
                      }}
                      className="text-stone-500 hover:text-emerald-800 font-semibold flex items-center gap-1"
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>SMS Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SMS Preview Bottom Sheet */}
        {previewSMS && (
          <div className="p-4 bg-stone-100 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <Smartphone className="w-4 h-4 text-emerald-800" />
                <span>Simulated SMS to {currentUser.phone}</span>
              </div>
              <button
                onClick={() => setPreviewSMS(null)}
                className="text-stone-500 hover:text-stone-800 text-xs"
              >
                Close
              </button>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs text-stone-800 shadow-inner font-mono leading-relaxed">
              [SOILCARE-GOV] {previewSMS.title}: {previewSMS.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
