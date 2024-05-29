// KEEP THESE UP TO DATE WITH BACKEND TYPES
declare interface Appointment {
  patient: Patient;
  practitioner: string | Practitioner;
  _id?: string;
  date: Date;
  status: 'in-progress' | 'complete' | 'cancelled' | 'scheduled';
  type: string;
  reason: string;
  synopsis: string;
  measurements: Measurement[];
  socialHistory: SocialHistory[];
}

declare interface Patient {
  _id?: string;
  name: string;
  initials: string;
  age: number;
  email: string;
  birthDate: Date;
  gender: string;
  measurements?: Measurement[];
  appointments?: Appointment[] | Mongoose.Schema.Types.ObjectId[] | string[];
  notes: Note[];
  prescriptions: Prescription[];
  allergies: Allergy[];
  activeTreatments: Treatment[];
  medicalHistory: Operation[];
  familyHistory: Condition[];
}

declare interface Practitioner {
  _id?: string;
  name: string;
  initials: string;
  username: string;
  password: string;
  patients: Patient[];
  appointments: Appointment[];
}

declare interface Condition {
  condition: string;
  relative: string;
}
declare interface Operation {
  operation: string;
  reason: string;
  date: string;
}
declare interface Treatment {
  treatment: string;
  reason: string;
  start: string;
  end: string;
}
declare interface Allergy {
  allergen: string;
  severity: string;
  reaction: string;
}

declare interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  reason: string;
  start: string;
  end: string;
}

declare interface Note {
  author: string;
  date: string;
  content: string;
  summary?: string;
}

declare interface Measurement {
  value: number;
  type: string;
}

declare interface SocialHistory {
  type: string;
  value: string;
}
