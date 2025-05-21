import DoctorProfile from '../models/DoctorProfile';

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