import React, { useState, useEffect, useCallback } from 'react';
import { getAllServices, getDoctorsForService, removeDoctorFromService } from '../../api/serviceApi';
import { useNavigate, Link } from 'react-router-dom';
import ServiceForm from '../../components/services/ServiceForm';

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
  }[];
}

const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);
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
            doctors: doctorsData.length > 0 ? doctorsData : [],
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
    if (token) getAllServicesWithDoctors();
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Керування Сервісами</h1>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      <h2 className="text-2xl font-semibold mb-4">Список Сервісів</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Фото</th>
              <th className="p-4">Назва</th>
              <th className="p-4">Ціна</th>
              <th className="p-4">Категорія</th>
              <th className="p-4">Статус</th>
              <th className="p-4">Лікарі</th>
              <th className="p-4">Дія</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <Link to={`/services/${service.id}`}>
                    <img
                      src={`http://localhost:5000/${service.imagePath}`}
                      alt={service.title}
                      className="w-32 h-24 object-cover rounded"
                    />
                  </Link>
                </td>
                <td className="p-4 font-medium">{service.title}</td>
                <td className="p-4 text-green-600">${service.price}</td>
                <td className="p-4">{service.category?.name || 'Без категорії'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-white text-sm ${service.isHidden ? 'bg-red-500' : 'bg-green-500'}`}>
                    {service.isHidden ? 'Приховано' : 'Видимо'}
                  </span>
                </td>
                <td className="p-4 space-y-2">
                  {service.doctors && service.doctors.length > 0 ? (
                    service.doctors.map(doctor => (
                      <div key={doctor.id} className="flex items-center justify-between">
                        <span>{doctor.firstName} {doctor.lastName}</span>
                        <button
                          onClick={() => handleRemoveDoctor(service.id, doctor.id)}
                          className="ml-2 text-red-500 hover:underline text-sm"
                        >
                          Видалити
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">Лікарів немає</p>
                  )}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => navigate(`/admin/services/edit/${service.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
                  >
                    Змінити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Створити новий сервіс</h2>
        {token ? (
          <ServiceForm token={token} />
        ) : (
          <p className="text-gray-600">Увійдіть, щоб створити сервіси.</p>
        )}
      </div>
    </div>
  );
};

export default AdminServicesPage;
