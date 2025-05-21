import { Review, Appointment, User, Service } from '../models';

export class ReviewService {

    async getUserReviews(userId: number) {
    return Review.findAll({
    where: { userId },
      include: [
        {
          model: Appointment,
          as: 'appointment', // використовуйте as, якщо ви вказали alias
          include: [
            { model: Service,},
            { model: User, as: 'doctor', attributes: ['firstName', 'lastName']}
          ]
        }
      ]
    });
  }

  async hasUserReviewedAppointment(appointmentId: number, userId: number): Promise<boolean> {
    const review = await Review.findOne({
      where: { appointmentId, userId },
    });
    return !!review;
  }
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

    const alreadyReviewed = await this.hasUserReviewedAppointment(data.appointmentId, data.userId);
    if (alreadyReviewed) {
      throw new Error('Validation:Ви вже залишили відгук на це бронювання!');
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
