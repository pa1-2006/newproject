import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Farm,
  TestingCenter,
  Appointment,
  SoilReport,
  NotificationItem,
  Announcement,
  ToastMessage,
  AppointmentStatus,
  TimeSlot,
  SoilParameter,
  FertilizerRecommendation,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_FARMS,
  INITIAL_TESTING_CENTERS,
  INITIAL_APPOINTMENTS,
  INITIAL_REPORTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANNOUNCEMENTS,
} from '../data/initialData';
import {
  saveAppointmentToSupabase,
  fetchAppointmentsFromSupabase,
  updateSupabaseAppointmentStatus,
  SUPABASE_PROJECT_ID,
  isSupabaseConfigured,
} from '../lib/supabase';

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  allUsers: User[];
  registerFarmer: (data: { name: string; phone: string; email: string; village: string; district: string; state: string }) => void;

  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  supabaseProjectId: string;

  farms: Farm[];
  addFarm: (farm: Omit<Farm, 'id' | 'farmerId'>) => Farm;
  updateFarm: (id: string, farm: Partial<Farm>) => void;
  deleteFarm: (id: string) => void;

  testingCenters: TestingCenter[];
  updateCenterCapacity: (id: string, newCapacity: number) => void;
  toggleCenterActive: (id: string) => void;

  appointments: Appointment[];
  bookAppointment: (booking: {
    farmId: string;
    centerId: string;
    appointmentDate: string;
    timeSlot: TimeSlot;
    sampleCount: number;
    currentCrop: string;
    intendedCrop: string;
    samplingDepthNotes: string;
  }) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus, remarks?: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newSlot: TimeSlot) => void;
  cancelAppointment: (id: string, reason: string) => void;

  reports: SoilReport[];
  publishLabReport: (appointmentId: string, reportData: {
    overallAssessment: SoilReport['overallAssessment'];
    parameters: SoilReport['parameters'];
    fertilizerRecommendations: FertilizerRecommendation[];
    generalRecommendations: string[];
    cropSpecificRecommendations: string[];
    labRemarks: string;
  }) => SoilReport;
  incrementReportDownload: (reportId: string) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendNotification: (item: Omit<NotificationItem, 'id' | 'date' | 'read'>) => void;

  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  deleteAnnouncement: (id: string) => void;

  activeNav: string;
  setActiveNav: (nav: string) => void;

  selectedReport: SoilReport | null;
  setSelectedReport: (report: SoilReport | null) => void;

  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;

  isGuideOpen: boolean;
  setIsGuideOpen: (open: boolean) => void;

  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial or persisted state
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('soilcare_mandya_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem('soilcare_mandya_current_user_id');
    return saved || 'usr-farmer-1';
  });

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const [currentRole, setCurrentRoleState] = useState<UserRole>(currentUser.role);

  const [farms, setFarms] = useState<Farm[]>(() => {
    const saved = localStorage.getItem('soilcare_mandya_farms');
    return saved ? JSON.parse(saved) : INITIAL_FARMS;
  });

  const [testingCenters, setTestingCenters] = useState<TestingCenter[]>(() => {
    const saved = localStorage.getItem('soilcare_mandya_centers');
    return saved ? JSON.parse(saved) : INITIAL_TESTING_CENTERS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('soilcare_mandya_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [reports, setReports] = useState<SoilReport[]>(() => {
    const saved = localStorage.getItem('soilcare_mandya_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('soilcare_mandya_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('soilcare_mandya_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [selectedReport, setSelectedReport] = useState<SoilReport | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronize appointments from Supabase on mount
  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchAppointmentsFromSupabase().then((remoteAppts) => {
        if (remoteAppts && remoteAppts.length > 0) {
          setAppointments((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const newFromRemote = remoteAppts.filter((a) => !existingIds.has(a.id));
            if (newFromRemote.length > 0) {
              return [...newFromRemote, ...prev];
            }
            return prev;
          });
        }
      });
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('soilcare_mandya_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('soilcare_mandya_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('soilcare_mandya_farms', JSON.stringify(farms));
  }, [farms]);

  useEffect(() => {
    localStorage.setItem('soilcare_mandya_centers', JSON.stringify(testingCenters));
  }, [testingCenters]);

  useEffect(() => {
    localStorage.setItem('soilcare_mandya_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('soilcare_mandya_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('soilcare_mandya_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('soilcare_mandya_announcements', JSON.stringify(announcements));
  }, [announcements]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    // Find matching demo user for the role
    const matchedUser = users.find((u) => u.role === role);
    if (matchedUser) {
      setCurrentUserId(matchedUser.id);
    }
    setActiveNav('dashboard');
    addToast('info', 'Role Switched', `Active view changed to ${role === 'farmer' ? 'Farmer' : role === 'lab_staff' ? 'Laboratory Officer' : 'Administrator'}`);
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      setCurrentRoleState(target.role);
      setActiveNav('dashboard');
      addToast('success', 'Profile Switched', `Logged in as ${target.name} (${target.role})`);
    }
  };

  const registerFarmer = (data: { name: string; phone: string; email: string; village: string; district: string; state: string }) => {
    const newId = 'usr-farmer-' + (users.length + 1);
    const newUser: User = {
      id: newId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      role: 'farmer',
      village: data.village,
      district: data.district,
      state: data.state,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newId);
    setCurrentRoleState('farmer');
    setActiveNav('dashboard');
    addToast('success', 'Farmer Profile Registered', `Welcome to SoilCare, ${data.name}!`);
  };

  const addFarm = (farmData: Omit<Farm, 'id' | 'farmerId'>) => {
    const newFarm: Farm = {
      ...farmData,
      id: 'farm-' + Date.now(),
      farmerId: currentUser.id,
    };
    setFarms((prev) => [newFarm, ...prev]);
    addToast('success', 'Farm Registered', `${farmData.name} has been added to your profile.`);
    return newFarm;
  };

  const updateFarm = (id: string, farmUpdate: Partial<Farm>) => {
    setFarms((prev) => prev.map((f) => (f.id === id ? { ...f, ...farmUpdate } : f)));
    addToast('success', 'Farm Updated', 'Farm details have been updated.');
  };

  const deleteFarm = (id: string) => {
    const target = farms.find((f) => f.id === id);
    setFarms((prev) => prev.filter((f) => f.id !== id));
    addToast('info', 'Farm Removed', `${target?.name || 'Farm'} was removed.`);
  };

  const updateCenterCapacity = (id: string, newCapacity: number) => {
    setTestingCenters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, maxDailyCapacity: newCapacity } : c))
    );
    addToast('success', 'Capacity Configured', `Testing slot capacity updated to ${newCapacity} samples/day.`);
  };

  const toggleCenterActive = (id: string) => {
    setTestingCenters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    addToast('info', 'Status Updated', 'Testing center availability updated.');
  };

  const bookAppointment = (booking: {
    farmId: string;
    centerId: string;
    appointmentDate: string;
    timeSlot: TimeSlot;
    sampleCount: number;
    currentCrop: string;
    intendedCrop: string;
    samplingDepthNotes: string;
  }) => {
    const farm = farms.find((f) => f.id === booking.farmId);
    const center = testingCenters.find((c) => c.id === booking.centerId);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const appointmentId = `ST-2026-${randomSuffix}`;

    const barcodes = Array.from({ length: booking.sampleCount }, (_, i) => {
      const code = String.fromCharCode(65 + i);
      return `SMP-${randomSuffix}-${code}`;
    });

    const newAppointment: Appointment = {
      id: appointmentId,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      farmId: booking.farmId,
      farmName: farm ? farm.name : 'Registered Farm',
      acreage: farm ? farm.acreage : 1.0,
      centerId: booking.centerId,
      centerName: center ? center.name : 'District Soil Lab',
      appointmentDate: booking.appointmentDate,
      timeSlot: booking.timeSlot,
      sampleCount: booking.sampleCount,
      currentCrop: booking.currentCrop,
      intendedCrop: booking.intendedCrop,
      samplingDepthNotes: booking.samplingDepthNotes,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sampleBarcodes: barcodes,
      instructionsAcknowledged: true,
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Send in-app notification
    sendNotification({
      userId: currentUser.id,
      role: 'farmer',
      title: 'Appointment Booked Successfully',
      message: `Your appointment ${appointmentId} at ${newAppointment.centerName} is confirmed for ${newAppointment.appointmentDate} (${newAppointment.timeSlot}).`,
      type: 'appointment',
      relatedId: appointmentId,
    });

    addToast(
      'success',
      'Appointment Confirmed!',
      `Booking ID: ${appointmentId}. Please bring dried soil sample bags on ${booking.appointmentDate}.`
    );

    // Automatically sync appointment to user's Supabase project (xogpmksbixplkmnsteds)
    if (isSupabaseConfigured) {
      saveAppointmentToSupabase(newAppointment).then((res) => {
        if (res.success) {
          addToast(
            'success',
            'Synced with Supabase',
            `Booking ${appointmentId} was recorded in your Supabase database (xogpmksbixplkmnsteds).`
          );
        } else {
          console.warn('Supabase sync info:', res.error);
        }
      });
    }

    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus, remarks?: string) => {
    setAppointments((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const updated = {
            ...app,
            status,
            updatedAt: new Date().toISOString(),
          };
          return updated;
        }
        return app;
      })
    );

    // Sync status change to Supabase
    if (isSupabaseConfigured) {
      updateSupabaseAppointmentStatus(id, status);
    }

    const app = appointments.find((a) => a.id === id);
    if (app) {
      sendNotification({
        userId: app.farmerId,
        role: 'farmer',
        title: `Appointment Status: ${status}`,
        message: remarks || `Your soil testing appointment ${id} status has been updated to "${status}".`,
        type: 'status',
        relatedId: id,
      });
    }

    addToast('success', 'Status Updated', `Appointment ${id} status moved to ${status}.`);
  };

  const rescheduleAppointment = (id: string, newDate: string, newSlot: TimeSlot) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              appointmentDate: newDate,
              timeSlot: newSlot,
              updatedAt: new Date().toISOString(),
            }
          : app
      )
    );

    sendNotification({
      userId: currentUser.id,
      role: 'farmer',
      title: 'Appointment Rescheduled',
      message: `Appointment ${id} has been rescheduled to ${newDate} at ${newSlot}.`,
      type: 'appointment',
      relatedId: id,
    });

    addToast('success', 'Appointment Rescheduled', `New slot confirmed for ${newDate} (${newSlot}).`);
  };

  const cancelAppointment = (id: string, reason: string) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: 'Cancelled' as AppointmentStatus,
              cancellationReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : app
      )
    );

    sendNotification({
      userId: currentUser.id,
      role: 'farmer',
      title: 'Appointment Cancelled',
      message: `Appointment ${id} has been cancelled. Reason: ${reason}`,
      type: 'appointment',
      relatedId: id,
    });

    addToast('info', 'Appointment Cancelled', `Appointment ${id} was cancelled.`);
  };

  const publishLabReport = (
    appointmentId: string,
    reportData: {
      overallAssessment: SoilReport['overallAssessment'];
      parameters: SoilReport['parameters'];
      fertilizerRecommendations: FertilizerRecommendation[];
      generalRecommendations: string[];
      cropSpecificRecommendations: string[];
      labRemarks: string;
    }
  ) => {
    const app = appointments.find((a) => a.id === appointmentId);
    const reportId = `SHC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const todayStr = new Date().toISOString().split('T')[0];

    // Compute health index based on optimal parameters
    const paramList = Object.values(reportData.parameters);
    const optimalCount = paramList.filter((p) => p.status === 'Optimal').length;
    const computedIndex = Math.min(95, Math.max(45, Math.round((optimalCount / paramList.length) * 100)));

    const newReport: SoilReport = {
      id: reportId,
      appointmentId,
      farmerId: app ? app.farmerId : currentUser.id,
      farmerName: app ? app.farmerName : 'Ramesh Patel',
      farmerPhone: app ? app.farmerPhone : '+91 98251 44321',
      farmName: app ? app.farmName : 'Field Plot',
      surveyNumber: 'SY-104/A',
      village: 'Kalyanpur',
      district: 'Anand',
      state: 'Gujarat',
      acreage: app ? app.acreage : 2.5,
      currentCrop: app ? app.currentCrop : 'Wheat',
      intendedCrop: app ? app.intendedCrop : 'Mustard',
      sampleCollectionDate: app ? app.appointmentDate : todayStr,
      sampleReceivedDate: app ? app.appointmentDate : todayStr,
      testingCompletedDate: todayStr,
      labId: currentUser.labId || 'lab-anand-01',
      labName: 'Krishi Vigyan Kendra Soil & Water Testing Lab',
      labOfficerName: currentUser.name,
      labOfficerDesignation: currentUser.designation || 'Soil Chemist & Laboratory Officer',
      status: 'Ready',
      downloadCount: 0,
      soilHealthIndex: computedIndex,
      overallAssessment: reportData.overallAssessment,
      parameters: reportData.parameters,
      fertilizerRecommendations: reportData.fertilizerRecommendations,
      generalRecommendations: reportData.generalRecommendations,
      cropSpecificRecommendations: reportData.cropSpecificRecommendations,
      labRemarks: reportData.labRemarks,
      verifiedBy: `${currentUser.name}, Authorized Officer`,
    };

    setReports((prev) => [newReport, ...prev]);

    // Update appointment status to Report Ready
    if (app) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId
            ? {
                ...a,
                status: 'Report Ready',
                reportId,
                updatedAt: new Date().toISOString(),
              }
            : a
        )
      );

      sendNotification({
        userId: app.farmerId,
        role: 'farmer',
        title: 'Soil Test Report Published!',
        message: `Your Soil Health Card ${reportId} for "${app.farmName}" has been finalized and is ready for download.`,
        type: 'report',
        relatedId: reportId,
      });
    }

    addToast('success', 'Report Published & Farmer Notified', `Report ID: ${reportId} is now available to the farmer.`);
    return newReport;
  };

  const incrementReportDownload = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              downloadCount: r.downloadCount + 1,
              status: r.status === 'Ready' ? 'Downloaded' : r.status,
            }
          : r
      )
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('info', 'Notifications Cleared', 'All notifications marked as read.');
  };

  const sendNotification = (item: Omit<NotificationItem, 'id' | 'date' | 'read'>) => {
    const newItem: NotificationItem = {
      ...item,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  const addAnnouncement = (announcementData: Omit<Announcement, 'id' | 'date'>) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: 'ann-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    addToast('success', 'Announcement Broadcasted', 'Notice has been published across the portal.');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    addToast('info', 'Announcement Removed', 'Notice was deleted.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        switchUser,
        allUsers: users,
        registerFarmer,

        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        supabaseProjectId: SUPABASE_PROJECT_ID,

        farms,
        addFarm,
        updateFarm,
        deleteFarm,

        testingCenters,
        updateCenterCapacity,
        toggleCenterActive,

        appointments,
        bookAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        cancelAppointment,

        reports,
        publishLabReport,
        incrementReportDownload,

        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        sendNotification,

        announcements,
        addAnnouncement,
        deleteAnnouncement,

        activeNav,
        setActiveNav,

        selectedReport,
        setSelectedReport,

        selectedAppointment,
        setSelectedAppointment,

        isGuideOpen,
        setIsGuideOpen,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
