import { Op } from 'sequelize';
import { User, Service, DoctorProfile } from '../models';
import { UserWithProfile } from '../types/doctor';

type ProfileCreateData = {
  education?: string;
  experience?: string;
  bio?: string;
  specialization?: string;
  price?: number;
};

type ProfileUpdateData = ProfileCreateData & { photoUrl?: string };

export class DoctorService {
  /* ---------- лікарі ⇄ сервіси ---------- */

  async assignDoctorToService(serviceId: number, doctorId: number) {
    const service = await Service.findByPk(serviceId);
    if (!service) throw new Error('NotFound:Service');

    const doctor = await User.findByPk(doctorId);
    if (!doctor || doctor.role !== 'doctor') throw new Error('Validation:Doctor');

    await service.addDoctor(doctor);
  }

  async removeDoctorFromService(serviceId: number, doctorId: number) {
    const service = await Service.findByPk(serviceId);
    if (!service) throw new Error('NotFound:Service');

    const doctor = await User.findByPk(doctorId);
    if (!doctor || doctor.role !== 'doctor') throw new Error('Validation:Doctor');

    await service.removeDoctor(doctor);
  }

  async getDoctorsForService(serviceId: number) {
    const service = await Service.findByPk(serviceId, {
      include: [
        {
          model: User,
          as: 'doctors',
          where: { role: 'doctor' },
          required: false,
        },
      ],
    });
    if (!service) throw new Error('NotFound:Service');
    return service.doctors ?? [];
  }


  async getAllDoctors() {
    return User.findAll({
      where: { role: 'doctor' },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'photoUrl'],
      include: [{ model: DoctorProfile, as: 'profile' }],
    }) as unknown as UserWithProfile[];
  }


  async createDoctorProfile(userId: number, data: ProfileCreateData) {
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'doctor') throw new Error('NotFound:Doctor');

    const exists = await DoctorProfile.findOne({ where: { userId } });
    if (exists) throw new Error('Conflict:Profile');

    return DoctorProfile.create({ userId, ...data });
  }

  async updateDoctorProfile(userId: number, data: ProfileUpdateData) {
    const profile = await DoctorProfile.findOne({ where: { userId } });
    if (!profile) throw new Error('NotFound:Profile');

    Object.assign(profile, {
      education: data.education ?? profile.education,
      experience: data.experience ?? profile.experience,
      bio: data.bio ?? profile.bio,
      specialization: data.specialization ?? profile.specialization,
      price: data.price ?? profile.price,
    });
    await profile.save();
    return profile;
  }

  async getDoctorProfile(doctorId: number) {
    if (isNaN(doctorId)) throw new Error('Validation:doctorId');

    const user = await User.findOne({
      where: { id: doctorId, role: 'doctor' },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'photoUrl'],
      include: [
        { model: DoctorProfile, as: 'profile' },
        { model: Service, as: 'services', through: { attributes: [] } },
      ],
    });
    if (!user) throw new Error('NotFound:Doctor');
    return user;
  }
}
