import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BookAppointmentPage from '../appointment/BookAppointmentPage';
import Modal from '../../components/Modal';
import ReviewList from '../../components/review/ReviewList';

const ServiceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/services/${id}`)
      .then(res => setService(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!service) return <p className="text-center mt-20 text-primary">Завантаження...</p>;

  return (
    <div className="max-w-[900px] mx-auto p-6 bg-white rounded-xl shadow-lg border border-primary mt-10">
      {/* Зображення */}
      <div className="overflow-hidden rounded-xl shadow-md mb-6">
        <img
          src={`http://localhost:5000/${service.imagePath}`}
          alt={service.title}
          className="w-full h-max-[300px] object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Заголовок */}
      <h1 className="text-primary text-3xl 2xl:text-4xl font-bold mb-4">
        {service.title}
      </h1>

      {/* Опис */}
      <p className="text-primary text-base 2xl:text-lg leading-relaxed mb-6 whitespace-pre-line">
        {service.description}
      </p>

      {/* Ціна */}
      <h3 className="text-primary font-semibold text-xl mb-6">
        Ціна: <span className="text-accent">{service.price} грн</span>
      </h3>

      {/* Кнопка бронювання */}
      <div className="flex justify-center mb-10">
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-blue-800 text-background font-roboto font-bold text-lg 2xl:text-xl rounded-lg px-8 py-3 transition w-full max-w-[250px]"
        >
          Забронювати
        </button>
      </div>

      {/* Модалка бронювання */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <BookAppointmentPage serviceId={Number(id)} />
        </Modal>
      )}

      {/* Відгуки */}
      <div>
        <ReviewList serviceId={Number(id)} />
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
