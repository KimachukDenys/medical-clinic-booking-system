import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Appointment, User, Service } from '../models';

// Створити бронювання (доктор або пацієнт)
export const createAppointment = async (
  req: Request & { user?: any }, 
  res: Response
): Promise<void> => {
  
  const { doctorId, serviceId, date } = req.body;

  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized: user not found' });
    return;
  }

  try {
    const newAppointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      serviceId,
      date,
      status: 'pending',
    });

    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create appointment.' });
  }
};

// Оновити бронювання (доктор або адмін)
export const updateAppointment = async (
  req: Request & { user?: { id: number; role: string } }, 
  res: Response
):  Promise<void> => {
  try {
    const { id } = req.params;
    const { date, status } = req.body;
    
    const appointment = await Appointment.findByPk(id, {
      include: [
        { model: User, as: 'doctor' },
        { model: User, as: 'patient' }
      ]
    });

    if (!appointment) {
      res.status(404).json({ message: 'Бронювання не знайдено.' });
      return;
    }

    // Перевірка прав доступу
    if (req.user?.role === 'admin') {
      // Адмін може змінювати будь-які поля
      if (date) appointment.date = date;
      if (status) appointment.status = status;
    } else if (req.user?.role === 'doctor' && req.user.id === appointment.doctorId) {
      // Лікар може змінювати статус
      if (status && ['pending', 'confirmed', 'finished', 'cancelled'].includes(status)) {
        appointment.status = status;
      }
    } else if (req.user?.role === 'patient' && req.user.id === appointment.patientId) {
      // Пацієнт може змінювати тільки дату
      if (date) appointment.date = date;
    } else {
      res.status(403).json({ message: 'Немає прав для зміни бронювання.' });
      return;
    }

    await appointment.save();

    res.status(200).json({ message: 'Бронювання успішно оновлено.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не вдалося оновити бронювання.' });
  }
};

// Отримати всі бронювання (для лікаря або пацієнта)
export const getAllAppointments = async (
  req: Request & { user?: { id: number; role: string } },
  res: Response
): Promise<void> => {
  try {
    const where: any = {};

    // Ролі: admin бачить усе, інші — лише свої
    if (req.user?.role === 'doctor') {
      where.doctorId = req.user.id;
    } else if (req.user?.role === 'patient') {
      where.patientId = req.user.id;
    }

    // Отримати всі бронювання з потрібними зв'язками
    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: User, as: 'doctor', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'patient', attributes: ['firstName', 'lastName'] },
        { model: Service }
      ]
    });

    // Поточна дата
    const now = new Date();

    for (const appointment of appointments) {
      const appointmentDate = new Date(appointment.date);
      let newStatus: 'pending' | 'confirmed' | 'finished' | 'cancelled' | null = null;

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
        await appointment.save(); // оновити в БД
      }
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не вдалося отримати бронювання.' });
  }
};

export const getAppointmentById = async (
  req: Request & { user?: { id: number; role: string } },
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    // Отримуємо бронювання з усіма потрібними зв'язками
    const appointment = await Appointment.findByPk(id, {
      include: [
        { model: User, as: 'doctor', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'patient', attributes: ['firstName', 'lastName'] },
        { model: Service },
      ],
    });

    if (!appointment) {
      res.status(404).json({ message: 'Бронювання не знайдено' });
      return;
    }

    // Якщо не адміністратор, перевіряємо доступ
    if (req.user?.role === 'doctor' && appointment.doctorId !== req.user.id) {
      res.status(403).json({ message: 'Доступ заборонено' });
      return;
    }
    if (req.user?.role === 'patient' && appointment.patientId !== req.user.id) {
      res.status(403).json({ message: 'Доступ заборонено' });
      return;
    }

    res.json(appointment);
  } catch (error) {
    console.error('Помилка при отриманні бронювання:', error);
    res.status(500).json({ message: 'Серверна помилка' });
  }
};

// Отримати зайняті часи для лікаря на певну дату
export const getBookedTimes = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorId = parseInt(String(req.query.doctorId), 10);
    const dateStr = String(req.query.date);
    const serviceId = parseInt(String(req.query.serviceId), 10);  // Retrieve serviceId if needed

    console.log('doctorId:', req.query.doctorId);
    console.log('date:', req.query.date);
    console.log('serviceId:', req.query.serviceId);
    if (isNaN(doctorId) || !dateStr) {
      res.status(400).json({ message: 'Missing or invalid doctorId or date parameter' });
      return;
    }

    const start = new Date(dateStr);
    const end = new Date(dateStr);
    end.setHours(23, 59, 59, 999);

    console.log('Fetching appointments for doctorId:', doctorId, 'on date:', dateStr);

    const appointments = await Appointment.findAll({
      where: {
        doctorId,
        date: {
          [Op.between]: [start, end],
        },
        ...(serviceId ? { serviceId } : {})  // Only add serviceId to the query if it's provided
      },
    });

    console.log('Found appointments:', appointments);

    const times = appointments.map(a => new Date(a.date).toTimeString().slice(0, 5));
    res.json(times);
  } catch (error) {
    console.error('Error fetching booked times:', error);
    res.status(500).json({ message: 'Error fetching booked times', error });
  }
};

export const deleteAppointment = async (
  req: Request & { user?: { id: number; role: string } },
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      res.status(404).json({ message: 'Бронювання не знайдено' });
      return;
    }

    // Лише адмін, або той, кому належить бронювання
    if (
      req.user?.role !== 'admin' &&
      appointment.patientId !== req.user?.id &&
      appointment.doctorId !== req.user?.id
    ) {
      res.status(403).json({ message: 'У вас немає прав для видалення' });
      return;
    }

    await appointment.destroy();
    res.json({ message: 'Бронювання успішно видалено' });
  } catch (error) {
    console.error('Помилка при видаленні бронювання:', error);
    res.status(500).json({ message: 'Серверна помилка' });
  }
};