import { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService';

export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  createReview = async (req: Request, res: Response) => {
    try {
      const { appointmentId, rating, comment, userId } = req.body;
      const review = await this.reviewService.createReview({ appointmentId, userId, rating, comment });
      res.status(201).json(review);
    } catch (e: any) {
      this.handleError(e, res);
    }
  };

  updateReview = async (req: Request, res: Response) => {
    try {
      const id = +req.params.id;
      const { rating, comment } = req.body;
      const review = await this.reviewService.updateReview(id, { rating, comment });
      res.status(200).json(review);
    } catch (e: any) {
      this.handleError(e, res);
    }
  };

  deleteReview = async (req: Request, res: Response) => {
    try {
      const id = +req.params.id;
      await this.reviewService.deleteReview(id);
      res.status(204).send();
    } catch (e: any) {
      this.handleError(e, res);
    }
  };

  getDoctorReviews = async (req: Request, res: Response) => {
    try {
      const doctorId = +req.params.doctorId;
      const reviews = await this.reviewService.getDoctorReviews(doctorId);
      res.json(reviews);
    } catch (e: any) {
      this.handleError(e, res);
    }
  };

  getServiceReviews = async (req: Request, res: Response) => {
    try {
      const serviceId = +req.params.serviceId;
      const reviews = await this.reviewService.getServiceReviews(serviceId);
      res.json(reviews);
    } catch (e: any) {
      this.handleError(e, res);
    }
  };

  private handleError(err: Error, res: Response) {
    const [kind, detail] = err.message.split(':');
    switch (kind) {
      case 'Validation':
        return res.status(400).json({ message: detail });
      case 'NotFound':
        return res.status(404).json({ message: detail });
      default:
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
  }
}
