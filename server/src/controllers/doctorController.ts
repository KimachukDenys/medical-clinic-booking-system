import { Request, Response } from 'express';
import { User, Service, DoctorProfile } from '../models';

export const assignDoctorToService = async (req: Request, res: Response): Promise<void> => {
  const serviceId = Number(req.params.id);
  const { doctorId } = req.body;

  try {
    const service = await Service.findByPk(serviceId);
    if (!service) {
      res.status(404).json({ message: 'Сервіс не знайдено' });
      return;
    }

    const doctor = await User.findByPk(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      res.status(400).json({ message: 'Невірний доктор' });
      return;
    }

    await service.addDoctor(doctor); // Додавання лікаря до сервісу через асоціацію

    res.status(200).json({ message: 'Доктора успішно додано до сервісу' });
  } catch (error) {
    console.error('Помилка при додаванні доктора до сервісу:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};

export const remoteDoctorFromService = async (req: Request, res: Response): Promise<void> => {
  const serviceId = Number(req.params.id);
  const doctorId  = Number(req.params.doctorId);

  try {
    const service = await Service.findByPk(serviceId);
    if (!service) {
      res.status(404).json({ message: 'Сервіс не знайдено' });
      return;
    }

    const doctor = await User.findByPk(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      res.status(400).json({ message: 'Невірний доктор' });
      return;
    }

    await service.removeDoctor(doctor); // Додавання лікаря до сервісу через асоціацію

    res.status(200).json({ message: 'Доктора успішно додано до сервісу' });
  } catch (error) {
    console.error('Помилка при додаванні доктора до сервісу:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};

export const getDoctorsForService = async (req: Request, res: Response): Promise<void> => {
  const serviceId = Number(req.params.id);

  try {
    // Знайти сервіс разом з лікарями
    const service = await Service.findByPk(serviceId, {
      include: [{
        model: User,
        as: 'doctors',  // Використовуємо новий псевдонім
        where: { role: 'doctor' },  // Тільки лікарі
        required: false
      }]
    });

    if (!service) {
      res.status(404).json({ message: 'Сервіс не знайдено' });
      return;
    }

    // Якщо лікарі відсутні, повертаємо порожній масив
    const doctors = service.doctors || [];

    res.status(200).json(doctors); // Повертаємо лікарів або порожній масив
  } catch (error) {
    console.error('Помилка при отриманні лікарів для сервісу:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};

export const getAllDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await User.findAll({
      where: { role: 'doctor' },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
      include: [
        {
          model: DoctorProfile,
          as: 'profile',
        },
      ],
    });

    if (!doctors) {
      res.status(404).json({ message: 'Доктори не знайдені' });
      return;
    }

    res.json(doctors);
  } catch (error) {
    console.error('Помилка при отриманні лікарів:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};

export const createDoctorProfile = async (
  req: Request & { user?: { id: number; role: string } },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: 'User not authenticated' });
      return;
    }

    const { education, experience, bio } = req.body;

    const user = await User.findByPk(userId);
    if (!user || user.role !== 'doctor') {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }

    const existingProfile = await DoctorProfile.findOne({ where: { userId } });
    if (existingProfile) {
      res.status(400).json({ error: 'Profile already exists' });
      return;
    }

    const profile = await DoctorProfile.create({ userId, education, experience, bio });

    res.status(201).json(profile);
  } catch (err) {
    console.error('Create Profile Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const updateDoctorProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { education, experience, bio } = req.body;

    const profile = await DoctorProfile.findOne({ where: { userId } });
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    profile.education = education ?? profile.education;
    profile.experience = experience ?? profile.experience;
    profile.bio = bio ?? profile.bio;

    await profile.save();

    res.status(200).json(profile);
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const getDoctorProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorId = Number(req.params.doctorId);
    if (isNaN(doctorId)) {
      res.status(400).json({ error: 'Invalid doctorId parameter' });
      return;
    }

    const user = await User.findOne({
      where: { id: doctorId, role: 'doctor' },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'photoUrl'],
      include: [
        {
          model: DoctorProfile,
          as: 'profile',
        },
        {
          model: Service,
          as: 'services',
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Get Doctor by ID Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};