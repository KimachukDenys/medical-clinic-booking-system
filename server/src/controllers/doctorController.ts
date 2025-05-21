import { Request, Response, NextFunction } from 'express';
import { DoctorService } from '../services/doctorService';

export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  assignDoctorToService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.doctorService.assignDoctorToService(+req.params.id, req.body.doctorId);
      res.status(200).json({ message: 'Доктора успішно додано до сервісу' });
    } catch (e) {
      next(e);
    }
  };

  removeDoctorFromService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.doctorService.removeDoctorFromService(+req.params.id, +req.params.doctorId);
      res.status(200).json({ message: 'Доктора успішно видалено із сервісу' });
    } catch (e) {
      next(e);
    }
  };

  getDoctorsForService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctors = await this.doctorService.getDoctorsForService(+req.params.id);
      res.status(200).json(doctors);
    } catch (e) {
      next(e);
    }
  };

  getAllDoctors = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const doctors = await this.doctorService.getAllDoctors();

      for (const doctor of doctors) {
        if (doctor.profile) {
          const rating = await doctor.profile.calculateRating();
          doctor.profile.setDataValue('rating', rating);
        }
      }

      res.status(200).json(doctors);
    } catch (e) {
      next(e);
    }
  };

  createDoctorProfile = async (req: Request & { user?: { id: number } }, res: Response, next: NextFunction) => {
    try {
      const profile = await this.doctorService.createDoctorProfile(req.user!.id, req.body);
      res.status(201).json(profile);
    } catch (e) {
      next(e);
    }
  };

  updateDoctorProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await this.doctorService.updateDoctorProfile(+req.params.userId, req.body);
      res.status(200).json(profile);
    } catch (e) {
      next(e);
    }
  };

  getDoctorProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctor = await this.doctorService.getDoctorProfile(+req.params.doctorId);
      res.status(200).json(doctor);
    } catch (e) {
      next(e);
    }
  };
}
