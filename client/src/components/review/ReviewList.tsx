import React, { useEffect, useState } from 'react';
import { getDoctorReviews, getServiceReviews, deleteReview } from '../../api/reviewApi';

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  appointment: {
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
      <h2 className="text-primary text-center text-3xl 2xl:text-4xl font-bold mb-10">Відгуки:</h2>
      {reviews.length === 0 ? (
        <p>Відгуків немає</p>
      ) : (
        reviews.map(r => (
          <div key={r.id} className="lg:max-w-[1100px] 2xl:max-w-[1600px] h-auto m-auto ">

            <div className="bg-primary text-background rounded-xl p-4 lg:p-5 mt-4">
              <div className="flex justify-between items-center">
                <div className="font-roboto font-bold text-base lg:text-lg xl:text-xl tracking-[1px]">
                  {r.author && (
                    <p>{r.author.firstName} {r.author.lastName}</p>
                  )}
                </div>
                  {doctorId && r.appointment.Service && (
                  <p><strong>Послуга:</strong> {r.appointment.Service.title}</p>
                )}

                {serviceId && r.appointment.doctor && (
                  <p><strong>Лікар:</strong> {r.appointment.doctor.firstName} {r.appointment.doctor.lastName}</p>
                )}
                  <p><em>{new Date(r.createdAt).toLocaleString()}</em></p>
                <div className="mt-3 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-accent text-[20px] lg:text-[22px] xl:lg:text-[22px]  2xl:text-[25px] ${i < (r.rating || 0) ? '' : 'opacity-30'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className='bg-background rounded-xl min-h-[100px] p-3 lg:p-4 mt-4'>
                <p className="font-playfair italic font-light text-[10px] md:text-sm 2xl:text-base mt-2 text-primary">
                  <strong>Коментар:</strong> {r.comment}              
                </p>
              </div>
              {showDelete && token && (
                <button className='mt-5 bg-errorColor w-full lg:w-[150px] 2xl:w-[225px] h-[50px] lg:h-[50px] 2xl:h-[60px] hover:bg-red-600 transition text-background font-roboto font-bold text-[20px] 2xl:text-[28px] rounded-lg flex items-center justify-center'
                 onClick={() => handleDelete(r.id)}>Видалити</button>
              )}
            </div>
          </div>
          // <div key={r.id} className="border p-2 mb-2">
          //   <p><strong>Оцінка:</strong> {r.rating}</p>

          //   {doctorId && r.appointment.Service && (
          //     <p><strong>Послуга:</strong> {r.appointment.Service.title}</p>
          //   )}

          //   {serviceId && r.appointment.doctor && (
          //     <p><strong>Лікар:</strong> {r.appointment.doctor.firstName} {r.appointment.doctor.lastName}</p>
          //   )}

          //   {r.author && (
          //     <p><strong>Автор:</strong> {r.author.firstName} {r.author.lastName}</p>
          //   )}

          //   <p><strong>Коментар:</strong> {r.comment}</p>

          //   <p><em>{new Date(r.createdAt).toLocaleString()}</em></p>
            
          //   {showDelete && token && (
          //     <button onClick={() => handleDelete(r.id)}>Видалити</button>
          //   )}
          // </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
