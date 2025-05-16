import React, { useEffect, useState } from 'react';
import { getDoctorReviews, getServiceReviews, deleteReview } from '../../api/reviewApi';

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  Appointment: {
    Service?: { title: string };
    doctor?: { firstName: string; lastName: string };
  };
  author?: {
    firstName: string;
    lastName: string;
  };
};

type Props = {
  doctorId?: number;
  serviceId?: number;
  token?: string;
  showDelete?: boolean;
};

const ReviewList: React.FC<Props> = ({ doctorId, serviceId, token, showDelete = false }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = doctorId
        ? await getDoctorReviews(doctorId)
        : serviceId
        ? await getServiceReviews(serviceId)
        : [];
      setReviews(data);
      console.log(data);
    };
    fetch();
  }, [doctorId, serviceId]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    await deleteReview(id, token);
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <div>
      <h2>Відгуки:</h2>
      {reviews.length === 0 ? (
        <p>Відгуків немає</p>
      ) : (
        reviews.map(r => (
          <div key={r.id} className="border p-2 mb-2">
            <p><strong>Оцінка:</strong> {r.rating}</p>

            {doctorId && r.Appointment.Service && (
              <p><strong>Послуга:</strong> {r.Appointment.Service.title}</p>
            )}

            {serviceId && r.Appointment.doctor && (
              <p><strong>Лікар:</strong> {r.Appointment.doctor.firstName} {r.Appointment.doctor.lastName}</p>
            )}

            {r.author && (
              <p><strong>Автор:</strong> {r.author.firstName} {r.author.lastName}</p>
            )}

            <p><strong>Коментар:</strong> {r.comment}</p>

            <p><em>{new Date(r.createdAt).toLocaleString()}</em></p>
            
            {showDelete && token && (
              <button onClick={() => handleDelete(r.id)}>Видалити</button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
