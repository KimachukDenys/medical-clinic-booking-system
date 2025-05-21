import { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/serviceService';
import { uploadImage } from '../middlwares/upload';

export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  createService = [
    uploadImage,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { title, description, price, categoryId } = req.body;
        const imagePath = req.file ? `images/${req.file.filename}` : null;
        const newService = await this.serviceService.createService({ title, description, price, categoryId, imagePath });
        res.status(201).json(newService);
      } catch (err) {
        next(err);
      }
    }
  ];

  getAllServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const includeHidden = req.query.includeHidden === 'true';
      const services = await this.serviceService.getAllServices(includeHidden);
      res.status(200).json(services);
    } catch (error) {
      next(error);
    }
  };

  getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid service id' });
      return;
    }
    try {
      const service = await this.serviceService.getServiceById(id);
      if (!service) {
        res.status(404).json({ message: 'Сервіс не знайдено' });
        return;
      }
      res.json(service);
    } catch (error) {
      next(error);
    }
  };

  getServicesForDoctor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const doctorId = Number(req.params.id);
    if (isNaN(doctorId)) {
      res.status(400).json({ message: 'Invalid doctorId' });
      return;
    }
    try {
      const services = await this.serviceService.getServicesForDoctor(doctorId);
      if (!services) {
        res.status(404).json({ message: 'Doctor not found or has no services' });
        return;
      }
      res.json(services);
    } catch (error) {
      next(error);
    }
  };

  updateService = [
    uploadImage,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid service id' });
        return;
      }

      const { title, description, price, categoryId, isHidden } = req.body;
      try {
        const imagePath = req.file ? `images/${req.file.filename}` : undefined;

        const updatedService = await this.serviceService.updateService(id, {
          title,
          description,
          price,
          categoryId,
          isHidden,
          imagePath,
        });

        if (!updatedService) {
          res.status(404).json({ message: 'Сервіс не знайдено.' });
          return;
        }

        res.json(updatedService);
      } catch (err) {
        next(err);
      }
    }
  ];
}
