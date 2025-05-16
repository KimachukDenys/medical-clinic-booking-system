import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BookAppointmentPage from './BookAppointmentPage';
import Modal from '../components/Modal';
import ReviewList from '../components/review/ReviewList';

const ServiceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/services/${id}`)
      .then(res => setService(res.data))
      .catch(err => console.error(err));
      console.log('service ID', id);
  }, [id]);

  if (!service) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <img
        src={`http://localhost:5000/${service.imagePath}`}
        alt={service.title}
        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
      />
      <h1>{service.title}</h1>
      <p>{service.description}</p>
      <h3>Ціна: ${service.price}</h3>

      {/* Кнопка для бронювання */}
      <button onClick={() => setShowModal(true)}>
        Забронювати
      </button>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <BookAppointmentPage serviceId={Number(id)} />
        </Modal>
      )}

      <div>    
        <ReviewList serviceId={Number(id)} />
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
