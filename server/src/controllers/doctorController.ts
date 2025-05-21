import { Request, Response } from 'express';
import { DoctorService } from '../services/doctorService';
import { UserWithProfile } from '../types/doctor';

export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  /* ---- лікарі ⇄ сервіси ---- */

  assignDoctorToService = async (req: Request, res: Response) => {
    try {
      await this.doctorService.assignDoctorToService(+req.params.id, req.body.doctorId);
      res.status(200).json({ message: 'Доктора успішно додано до сервісу' });
    } catch (e: any) {
      this.handleError(e, res);
    }
  };

  removeDoctorFromService = async (req: Request, res: Response) => {
    try {
      await this.doctorService.removeDoctorFromService(+req.params.id, +req.params.doctorId);
      res.status(200).json({ message: 'Доктора успішно видалено із сервісу' });
    } catch (e: any) {
      this.handleError(e, res);
    }
  };

  getDoctorsForService = async (req: Request, res: Response) => {
    try {
      const doctors = await this.doctorService.getDoctorsForService(+req.params.id);
      res.status(200).json(doctors);
    } catch (e: any) {
      this.handleError(e, res);
    }
  };

  /* ---- довідник лікарів ---- */

  getAllDoctors = async (_req: Request, res: Response) => {
    const doctors = await this.doctorService.getAllDoctors();

    // doctors — User[], профіль доктора — doctor.profile (DoctorProfile | null)
    for (const doctor of doctors) {
      if (doctor.profile) {
        const rating = await doctor.profile.calculateRating();
        doctor.profile.setDataValue('rating', rating);
      }
    }
    // Віддаємо як є, Sequelize коректно серіалізує асоціації
    res.status(200).json(doctors);
  };

  /* ---- профіль лікаря ---- */

  createDoctorProfile = async (req: Request & { user?: { id: number } }, res: Response) => {
    try {
      const profile = await this.doctorService.createDoctorProfile(req.user!.id, req.body);
      res.status(201).json(profile);
    } catch (e: any) {
      this.handleError(e, res);
    }
  };

  /** оновлення — підтримує education, experience, bio, specialization, price, photoUrl */
  updateDoctorProfile = async (req: Request, res: Response) => {
    try {
      const profile = await this.doctorService.updateDoctorProfile(+req.params.userId, req.body);
      res.status(200).json(profile);
    } catch (e: any) {
      this.handleError(e, res);
    }
  };

  getDoctorProfile = async (req: Request, res: Response) => {
    try {
      const doctor = await this.doctorService.getDoctorProfile(+req.params.doctorId);
      res.status(200).json(doctor);
    } catch (e: any) {
      this.handleError(e, res);
    }
  };

  /* ---- утиліта ---- */

  private handleError(err: Error, res: Response) {
    const [kind, detail] = err.message.split(':');

    switch (kind) {
      case 'Validation':
        return res.status(400).json({ message: detail });
      case 'NotFound':
        return res.status(404).json({ message: detail });
      case 'Conflict':
        return res.status(409).json({ message: detail });
      default:
        console.error(err);
        return res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
  }
}
