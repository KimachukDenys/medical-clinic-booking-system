import { Op } from 'sequelize';
import { Appointment, User, Service } from '../models';

type AppointmentStatus = 'pending' | 'confirmed' | 'finished' | 'cancelled';
const allowedStatuses: AppointmentStatus[] = ['pending', 'confirmed', 'finished', 'cancelled'];

export class AppointmentService {
  async createAppointment(patientId: number, doctorId: number, serviceId: number, date: Date) {
    return Appointment.create({
      patientId,
      doctorId,
      serviceId,
      date,
      status: 'pending' as AppointmentStatus,  // Явне приведення типу
    });
  }

  async updateAppointment(
    id: number,
    user: { id: number; role: string },
    updates: { date?: Date; status?: string }
  ) {
    const appointment = await Appointment.findByPk(id, {
      include: [
        { model: User, as: 'doctor' },
        { model: User, as: 'patient' }
      ]
    });

    if (!appointment) {
      throw new Error('NotFound');
    }

    if (user.role === 'admin') {
      if (updates.date) appointment.date = updates.date;
      if (updates.status && allowedStatuses.includes(updates.status as AppointmentStatus)) {
        appointment.status = updates.status as AppointmentStatus;
      }
    } else if (user.role === 'doctor' && user.id === appointment.doctorId) {
      if (updates.status && allowedStatuses.includes(updates.status as AppointmentStatus)) {
        appointment.status = updates.status as AppointmentStatus;
      } else if (updates.status) {
        throw new Error('Forbidden');
      }
    } else if (user.role === 'patient' && user.id === appointment.patientId) {
      if (updates.date) appointment.date = updates.date;
    } else {
      throw new Error('Forbidden');
    }

    await appointment.save();
    return appointment;
  }

  async getAllAppointments(user: { id: number; role: string }) {
    const where: any = {};
    if (user.role === 'doctor') {
      where.doctorId = user.id;
    } else if (user.role === 'patient') {
      where.patientId = user.id;
    }

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: User, as: 'doctor', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'patient', attributes: ['firstName', 'lastName'] },
        { model: Service }
      ]
    });

    const now = new Date();

    for (const appointment of appointments) {
      const appointmentDate = new Date(appointment.date);
      let newStatus: AppointmentStatus | null = null;

      if (appointmentDate < now && appointment.status !== 'finished') {
        newStatus = 'finished';
      } else if (
        appointmentDate.toDateString() === now.toDateString() &&
        appointment.status === 'pending'
      ) {
        newStatus = 'confirmed';
      }

      if (newStatus) {
        appointment.status = newStatus;
        await appointment.save();
      }
    }

    return appointments;
  }

  async getAppointmentById(id: number, user: { id: number; role: string }) {
    const appointment = await Appointment.findByPk(id, {
      include: [
        { model: User, as: 'doctor', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'patient', attributes: ['firstName', 'lastName'] },
        { model: Service },
      ],
    });

    if (!appointment) {
      throw new Error('NotFound');
    }

    if (user.role === 'doctor' && appointment.doctorId !== user.id) {
      throw new Error('Forbidden');
    }
    if (user.role === 'patient' && appointment.patientId !== user.id) {
      throw new Error('Forbidden');
    }

    return appointment;
  }

  async getBookedTimes(doctorId: number, dateStr: string, serviceId?: number) {
    const start = new Date(dateStr);
    const end = new Date(dateStr);
    end.setHours(23, 59, 59, 999);

    const where: any = {
      doctorId,
      date: { [Op.between]: [start, end] },
    };
    if (serviceId) {
      where.serviceId = serviceId;
    }

    const appointments = await Appointment.findAll({ where });

    return appointments.map(a => new Date(a.date).toTimeString().slice(0, 5));
  }

  async deleteAppointment(id: number, user: { id: number; role: string }) {
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      throw new Error('NotFound');
    }

    if (
      user.role !== 'admin' &&
      appointment.patientId !== user.id &&
      appointment.doctorId !== user.id
    ) {
      throw new Error('Forbidden');
    }

    await appointment.destroy();
  }
}
