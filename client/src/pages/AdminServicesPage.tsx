import React, { useState, useEffect, useCallback } from 'react';
import { getAllServices, getDoctorsForService, removeDoctorFromService } from '../api/serviceApi';
import { useNavigate, Link } from 'react-router-dom';
import ServiceForm from '../components/services/ServiceForm';
// import AssignDoctorForm from '../components/services/AssignDoctorForm';

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  imagePath: string;
  isHidden: boolean;
  category: {
    id: number;
    name: string;
  };
  doctors?: {
    id: number;
    firstName: string;
    lastName: string;
  }[]; // додано поля для firstName та lastName лікаря
}

const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);
  // const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const navigate = useNavigate();

  const getAllServicesWithDoctors = useCallback(async () => {
    if (!token) return;

    try {
      const response = await getAllServices({ includeHidden: true });
      const servicesWithDoctors = await Promise.all(
        response.data.map(async (service: Service) => {
          let doctorsData = service.doctors || [];

          if (doctorsData.length === 0) {
            const doctorsResponse = await getDoctorsForService(service.id, token);
            doctorsData = doctorsResponse.data || [];
          }

          return {
            ...service,
            doctors: doctorsData.length > 0 ? doctorsData : null,
          };
        })
      );
      setServices(servicesWithDoctors);
    } catch (error) {
      setMessage('Не вдалося завантажити сервіси та лікарів.');
    }
  }, [token]);



  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      getAllServicesWithDoctors();
    }
  }, [token, getAllServicesWithDoctors]);

  const handleRemoveDoctor = async (serviceId: number, doctorId: number) => {
    if (!token) return;

    try {
      await removeDoctorFromService(serviceId, doctorId, token);
      setServices(prev =>
        prev.map(service =>
          service.id === serviceId
            ? { ...service, doctors: service.doctors?.filter(d => d.id !== doctorId) || [] }
            : service
        )
      );
      alert('Доктора видалено!');
    } catch (error) {
      alert('Помилка при видаленні доктора');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: 'auto' }}>
      <h1>Керування Сервісами</h1>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      <h3>Список Сервісів</h3>
      <table border={1} cellPadding={8} style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Фото</th>
            <th>Назва</th>
            <th>Ціна</th>
            <th>Категорія</th>
            <th>Статус</th>
            <th>Лікарі</th>
            <th>Дія</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.id}>
              <td>
                <Link to={`/services/${service.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img
                  src={`http://localhost:5000/${service.imagePath}`}
                  alt={service.title}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                />
                </Link>
              </td>
              <td>{service.title}</td>
              <td>${service.price}</td>
              <td>{service.category?.name || 'Без категорії'}</td>
              <td>{service.isHidden ? 'Приховано' : 'Видимо'}</td>
              <td>
                {/* Відображаємо лікарів або повідомлення, що лікарів немає */}
                {service.doctors ? (
                  service.doctors.length > 0 ? (
                    service.doctors.map(doctor => (
                      <div key={doctor.id}>
                        <p>{doctor.firstName} {doctor.lastName}</p>
                        <button onClick={() => handleRemoveDoctor(service.id, doctor.id)}>
                          Видалити доктора
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Лікарів немає</p>
                  )
                ) : (
                  <p>Лікарів немає</p>
                )}
              </td>
              <td>
                <button onClick={() => navigate(`/admin/services/edit/${service.id}`)}>
                  Змінити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* {selectedServiceId && token && (
        <div style={{ marginTop: '20px' }}>
          <h4>Прив’язати доктора до сервісу ID {selectedServiceId}</h4>
          <AssignDoctorForm
            serviceId={selectedServiceId}
            token={token}
            onClose={() => setSelectedServiceId(null)}
          />
        </div>
      )} */}

      <h3>Створити новий сервіс</h3>
      {token ? (
        <ServiceForm token={token} />
      ) : (
        <p>Увійдіть, щоб створити сервіси.</p>
      )}
    </div>
  );
};

export default AdminServicesPage;
