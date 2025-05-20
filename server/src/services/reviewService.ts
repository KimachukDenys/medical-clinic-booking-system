import { Review, Appointment, User, Service } from '../models';

export class ReviewService {
  async createReview(data: {
    appointmentId: number;
    userId: number;
    rating: number;
    comment: string;
  }) {
    const appointment = await Appointment.findByPk(data.appointmentId);
    if (!appointment) throw new Error('NotFound:Appointment not found');
    if (appointment.status !== 'finished') {
      throw new Error('Validation:Ви можете залишати відгуки, якщо ваш запис завершився!');
    }

    return await Review.create(data);
  }

  async updateReview(id: number, data: { rating?: number; comment?: string }) {
    const review = await Review.findByPk(id);
    if (!review) throw new Error('NotFound:Review not found');

    review.rating = data.rating ?? review.rating;
    review.comment = data.comment ?? review.comment;
    return await review.save();
  }

  async deleteReview(id: number) {
    const review = await Review.findByPk(id);
    if (!review) throw new Error('NotFound:Review not found');
    await review.destroy();
  }

  async getDoctorReviews(doctorId: number) {
    return await Review.findAll({
      include: [
        {
          model: Appointment,
          as: 'appointment',
          where: { doctorId },
          attributes: ['serviceId'],
          include: [{ model: Service, attributes: ['title'] }],
        },
        {
          model: User,
          as: 'author',
          attributes: ['firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async getServiceReviews(serviceId: number) {
    return await Review.findAll({
      include: [
        {
          model: Appointment,
          as: 'appointment',
          where: { serviceId },
          attributes: ['doctorId'],
          include: [{ model: User, as: 'doctor', attributes: ['firstName', 'lastName'] }],
        },
        {
          model: User,
          as: 'author',
          attributes: ['firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }
}
