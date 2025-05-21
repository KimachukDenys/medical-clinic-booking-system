import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/reviewService';

export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  getUserReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = +req.params.userId;
      const reviews = await this.reviewService.getUserReviews(userId);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  };

  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { appointmentId, rating, comment, userId } = req.body;
      const review = await this.reviewService.createReview({ appointmentId, userId, rating, comment });
      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = +req.params.id;
      const { rating, comment } = req.body;
      const review = await this.reviewService.updateReview(id, { rating, comment });
      res.status(200).json(review);
    } catch (error) {
      next(error);
    }
  };

  deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = +req.params.id;
      await this.reviewService.deleteReview(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getDoctorReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctorId = +req.params.doctorId;
      const reviews = await this.reviewService.getDoctorReviews(doctorId);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  };

  getServiceReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serviceId = +req.params.serviceId;
      const reviews = await this.reviewService.getServiceReviews(serviceId);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  };
}