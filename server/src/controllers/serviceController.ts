import { Request, Response } from 'express';
import {Service, ServiceDoctor, Category, User } from '../models/';
import { uploadImage } from '../middlwares/upload'; // Перевірте правильність шляху до middleware

// Створити сервіс (тільки адмін)
export const createService = [
  uploadImage, // Використовуємо middleware для завантаження файлів
  async (req: Request, res: Response) => {
    const { title, description, price, categoryId } = req.body; // Використовуємо categoryId, а не category
    const imagePath = req.file ? `images/${req.file.filename}` : null; // Отримуємо шлях до файлу, якщо він є

    try {
      const newService = await Service.create({
        title,
        description,
        price,
        categoryId, // Заміна category на categoryId
        imagePath, // Зберігаємо шлях до зображення
        isHidden: false,
      });
      res.status(201).json(newService);
    } catch (err) {
      console.error(err); // Логування помилки для кращого діагностування
      res.status(500).json({ message: 'Failed to create service.' });
    }
  }
];

// Отримати всі видимі сервіси, можна додати фільтрацію за категорією
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const includeHidden = req.query.includeHidden === 'true'; // отримуємо з рядка запиту
    const services = await Service.findAll({
      where: includeHidden ? {} : { isHidden: false },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні сервісів' });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const service = await Service.findByPk(id);

    if (!service) {
      res.status(404).json({ message: 'Сервіс не знайдено' });
      return;
    }

    res.json(service);
  } catch (error) {
    console.error('Помилка при отриманні сервісу:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};

export const getServicesForDoctor = async (req: Request, res: Response): Promise<void> => {
  const doctorId = Number(req.params.id);
  if (isNaN(doctorId)) {
    res.status(400).json({ message: 'Invalid doctorId' });
    return;
  }

  try {
    const doctor = await User.findByPk(doctorId, {
      include: {
        model: Service,
        as: 'services',          // важливо вказати псевдонім
        through: { attributes: [] },
      },
    });

    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    res.json(doctor.services);  // services з маленької літери, як у асоціації
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Редагувати сервіс (тільки адмін)
export const updateService = [
  uploadImage,
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const { title, description, price, categoryId, isHidden } = req.body;

    try {
      const service = await Service.findByPk(id);
      if (!service) {
        res.status(404).json({ message: 'Сервіс не знайдено.' });
        return;
      }

      const imagePath = req.file ? `images/${req.file.filename}` : service.imagePath;

      await service.update({
        title: title ?? service.title,
        description: description ?? service.description,
        price: price ?? service.price,
        categoryId: categoryId ?? service.categoryId,
        isHidden: isHidden ?? service.isHidden,
        imagePath,
      });

      res.json(service);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Не вдалося оновити сервіс.' });
    }
  }
];