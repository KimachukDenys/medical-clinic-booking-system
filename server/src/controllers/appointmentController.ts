import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointmentService';

export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  createAppointment = async (req: Request & { user?: any }, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: user not found' });
      return;
    }

    try {
      const { doctorId, serviceId, date } = req.body;
      const newAppointment = await this.appointmentService.createAppointment(
        req.user.id,
        doctorId,
        serviceId,
        new Date(date)
      );
      res.status(201).json(newAppointment);
    } catch {
      res.status(500).json({ message: 'Failed to create appointment.' });
    }
  };

  updateAppointment = async (req: Request & { user?: { id: number; role: string } }, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const { date, status } = req.body;

      const updated = await this.appointmentService.updateAppointment(id, req.user!, {
        date: date ? new Date(date) : undefined,
        status,
      });

      res.status(200).json({ message: 'Бронювання успішно оновлено.', updated });
    } catch (error: any) {
      if (error.message === 'NotFound'){
        res.status(404).json({ message: 'Бронювання не знайдено.' });
        return;
      };

      if (error.message === 'Forbidden'){
        res.status(403).json({ message: 'Немає прав для зміни бронювання.' });
        return;
      };

      res.status(500).json({ message: 'Не вдалося оновити бронювання.' });
    }
  };

  getAllAppointments = async (req: Request & { user?: { id: number; role: string } }, res: Response) => {
    try {
      const appointments = await this.appointmentService.getAllAppointments(req.user!);
      res.status(200).json(appointments);
    } catch {
      res.status(500).json({ message: 'Не вдалося отримати бронювання.' });
    }
  };

  getAppointmentById = async (req: Request & { user?: { id: number; role: string } }, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const appointment = await this.appointmentService.getAppointmentById(id, req.user!);
      res.json(appointment);
    } catch (error: any) {
      if (error.message === 'NotFound'){
        res.status(404).json({ message: 'Бронювання не знайдено' });
        return;
      };

      if (error.message === 'Forbidden') {
        res.status(403).json({ message: 'Доступ заборонено' });
        return;
      };

      res.status(500).json({ message: 'Серверна помилка' });
    }
  };

  getBookedTimes = async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = parseInt(String(req.query.doctorId), 10);
      const dateStr = String(req.query.date);
      const serviceId = req.query.serviceId ? parseInt(String(req.query.serviceId), 10) : undefined;

      if (isNaN(doctorId) || !dateStr) {
        res.status(400).json({ message: 'Missing or invalid doctorId or date parameter' });
        return;
      }

      const times = await this.appointmentService.getBookedTimes(doctorId, dateStr, serviceId);
      res.json(times);
    } catch {
      res.status(500).json({ message: 'Error fetching booked times' });
    }
  };

  deleteAppointment = async (req: Request & { user?: { id: number; role: string } }, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.appointmentService.deleteAppointment(id, req.user!);
      res.json({ message: 'Бронювання успішно видалено' });
    } catch (error: any) {
      if (error.message === 'NotFound'){
        res.status(404).json({ message: 'Бронювання не знайдено' });
        return;
      };
        
      if (error.message === 'Forbidden'){
        res.status(403).json({ message: 'У вас немає прав для видалення' });
        return;
      };
      
      res.status(500).json({ message: 'Серверна помилка' });
    }
  };
};