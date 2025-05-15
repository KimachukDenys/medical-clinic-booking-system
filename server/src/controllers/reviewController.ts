import { Request, Response } from 'express';
import {Review, Appointment, User, Service} from '../models';

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointmentId, userId, rating, comment } = req.body;

    // Перевірити, що appointment існує
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    // Можна також перевірити, чи appointment "finished"
    if (appointment.status !== 'finished') {
      res.status(400).json({ error: 'Ви можете залишати відгуки, якщо ваш запис завершився!' });
      return;
    }

    const review = await Review.create({ appointmentId, userId, rating, comment });
    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviewId = Number(req.params.id);
    const { rating, comment } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    res.status(200).json(review);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviewId = Number(req.params.id);
    const review = await Review.findByPk(reviewId);

    if (!review) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    await review.destroy();
    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getDoctorReviews = async (req: Request, res: Response) => {
  try {
    const doctorId = Number(req.params.doctorId);
    const reviews = await Review.findAll({
      include: [
        {
          model: Appointment,
          where: { doctorId },
          attributes: ['serviceId'],
          include: [
            {
              model: Service,
              attributes: ['title'],
            },
          ],
        },
        {
          model: User,
          as: 'author',
          attributes: ['firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(reviews);
  } catch (error) {
    console.error('Get doctor reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getServiceReviews = async (req: Request, res: Response) => {
  try {
    const serviceId = Number(req.params.serviceId);

    const reviews = await Review.findAll({
      include: [
        {
          model: Appointment,
          where: { serviceId },
          attributes: ['doctorId'],
          include: [
            {
              model: User,
              as: 'doctor',
              attributes: ['firstName', 'lastName'],
            },
          ],
        },
        {
          model: User,
          as: 'author',
          attributes: ['firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(reviews);
  } catch (error) {
    console.error('Get doctor reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
