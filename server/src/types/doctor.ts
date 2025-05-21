// src/types/doctor.ts
import DoctorProfile from '../models/DoctorProfile';
// імпорт інтерфейсу UserAttributes

export interface UserWithProfile{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoUrl: string | null;
  role: string;
  profile: DoctorProfile | null;
}