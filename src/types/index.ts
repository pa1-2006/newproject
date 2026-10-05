export type UserRole = 'farmer' | 'lab_staff' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatar?: string;
  village?: string;
  district?: string;
  state?: string;
  labId?: string;
  designation?: string;
  department?: string;
}

export type SoilType =
  | 'Black Clay (Regur)'
  | 'Alluvial Loam'
  | 'Red Sandy Loam'
  | 'Laterite Soil'
  | 'Silty Clay Loam'
  | 'Sandy Loam';

export interface Farm {
  id: string;
  farmerId: string;
  name: string;
  surveyNumber: string;
  village: string;
  district: string;
  state: string;
  acreage: number;
  soilType: SoilType;
  currentCrop: string;
  irrigationSource: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TestingCenter {
  id: string;
  name: string;
  code: string;
  address: string;
  district: string;
  state: string;
  phone: string;
  operatingHours: string;
  services: string[];
  distanceKm: number;
  maxDailyCapacity: number;
  active: boolean;
}

export type AppointmentStatus =
  | 'Booked'
  | 'Confirmed'
  | 'Sample Submitted'
  | 'Testing in Progress'
  | 'Report Ready'
  | 'Completed'
  | 'Cancelled';

export type TimeSlot =
  | '09:00 AM - 11:00 AM'
  | '11:00 AM - 01:00 PM'
  | '02:00 PM - 04:00 PM'
  | '04:00 PM - 06:00 PM';

export interface Appointment {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmId: string;
  farmName: string;
  acreage: number;
  centerId: string;
  centerName: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: TimeSlot;
  sampleCount: number;
  currentCrop: string;
  intendedCrop: string;
  samplingDepthNotes: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  sampleBarcodes: string[];
  reportId?: string;
  cancellationReason?: string;
  instructionsAcknowledged: boolean;
}

export type NutrientLevel = 'Low' | 'Medium' | 'High' | 'Optimal';

export interface SoilParameter {
  name: string;
  chemicalSymbol: string;
  value: number;
  unit: string;
  status: NutrientLevel;
  optimalRange: string;
  method: string;
  description: string;
}

export interface FertilizerRecommendation {
  fertilizer: string;
  nutrientTarget: string;
  basalDose: string;
  topDressing: string;
  applicationGuidance: string;
}

export interface SoilReport {
  id: string;
  appointmentId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmName: string;
  surveyNumber: string;
  village: string;
  district: string;
  state: string;
  acreage: number;
  currentCrop: string;
  intendedCrop: string;
  sampleCollectionDate: string;
  sampleReceivedDate: string;
  testingCompletedDate: string;
  labId: string;
  labName: string;
  labOfficerName: string;
  labOfficerDesignation: string;
  status: 'Pending' | 'Ready' | 'Downloaded';
  downloadCount: number;
  soilHealthIndex: number; // 0 - 100
  overallAssessment: 'Highly Fertile' | 'Moderately Fertile' | 'Deficient in Micronutrients' | 'High Salinity Risk';
  parameters: {
    pH: SoilParameter;
    ec: SoilParameter;
    organicCarbon: SoilParameter;
    nitrogen: SoilParameter;
    phosphorus: SoilParameter;
    potassium: SoilParameter;
    sulphur: SoilParameter;
    zinc: SoilParameter;
    iron: SoilParameter;
    manganese: SoilParameter;
    copper: SoilParameter;
    boron: SoilParameter;
  };
  fertilizerRecommendations: FertilizerRecommendation[];
  generalRecommendations: string[];
  cropSpecificRecommendations: string[];
  labRemarks: string;
  verifiedBy: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  role: UserRole | 'all';
  title: string;
  message: string;
  date: string;
  type: 'appointment' | 'status' | 'report' | 'announcement';
  read: boolean;
  relatedId?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'farmers' | 'labs';
  date: string;
  priority: 'normal' | 'urgent';
  author: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
