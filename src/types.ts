export interface Patient {
  id: string;
  name: string;
  mrn: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diagnosis: string;
  admissionDate: string;
  dischargeDate?: string;
  status: 'Active' | 'Discharged';
  specialty: Specialty;
  assignedDoctor?: string;
}

export type Specialty =
  | 'Hematology'
  | 'Rheumatology'
  | 'Pulmonology'
  | 'Infectious Diseases'
  | 'General Internal Medicine'
  | 'Neurology'
  | 'Endocrinology';

export interface MedicalNote {
  id: string;
  patientId: string;
  date: string;
  note: string;
  user: string;
}

export interface DailyReport {
  date: string;
  specialties: {
    [key in Specialty]: {
      activePatients: Patient[];
      dischargedPatients: Patient[];
    };
  };
}