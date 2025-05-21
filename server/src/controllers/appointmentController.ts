import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from '../services/appointmentService';

export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  createAppointment = async (req: Request & { user?: any }, res: Response, next: NextFunction): Promise<void> => {
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
    } catch (error) {
      next(error);
    }
  };

  updateAppointment = async (
    req: Request & { user?: { id: number; role: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const { date, status } = req.body;

      const updated = await this.appointmentService.updateAppointment(id, req.user!, {
        date: date ? new Date(date) : undefined,
        status,
      });

      res.status(200).json({ message: 'Бронювання успішно оновлено.', updated });
    } catch (error) {
      next(error);
    }
  };

  getAllAppointments = async (
    req: Request & { user?: { id: number; role: string } },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const appointments = await this.appointmentService.getAllAppointments(req.user!);
      res.status(200).json(appointments);
    } catch (error) {
      next(error);
    }
  };

  getAppointmentById = async (
    req: Request & { user?: { id: number; role: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const appointment = await this.appointmentService.getAppointmentById(id, req.user!);
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  };

  getBookedTimes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    } catch (error) {
      next(error);
    }
  };

  deleteAppointment = async (
    req: Request & { user?: { id: number; role: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.appointmentService.deleteAppointment(id, req.user!);
      res.json({ message: 'Бронювання успішно видалено' });
    } catch (error) {
      next(error);
    }
  };
}
