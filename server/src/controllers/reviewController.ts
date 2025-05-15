import { Request, Response } from 'express';
import Review from '../models/Review';
import Appointment from '../models/Appointment';

export const createReview = async (req: Request, res: Response) => {
  try {
    const { appointmentId, rating, comment } = req.body;

    // Перевірити, що appointment існує
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Можна також перевірити, чи appointment "finished"
    if (appointment.status !== 'finished') {
      return res.status(400).json({ error: 'You can only review finished appointments' });
    }

    const review = await Review.create({ appointmentId, rating, comment });
    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const reviewId = Number(req.params.id);
    const { rating, comment } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
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

// controllers/reviewController.ts
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewId = Number(req.params.id);
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
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
      include: {
        model: Appointment,
        where: { doctorId },
        attributes: [],
      },
    });

    res.json(reviews);
  } catch (error) {
    console.error('Get doctor reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
