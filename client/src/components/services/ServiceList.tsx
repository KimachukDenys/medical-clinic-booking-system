import React, { useEffect, useState } from 'react';
import { getAllServices } from '../../api/serviceApi';
import { Link } from 'react-router-dom';

interface Service {
  id: number;
  title: string;
  price: number;
  imagePath: string;
  description?: string;
}

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getAllServices();
        setServices(res.data);
      } catch (err) {
        setError('Не вдалося завантажити послуги');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div className="text-center py-10">Завантаження...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="max-w-[1650px] lg:max-w-[1300px] mx-auto px-4 py-8">
      <h1 className="text-primary text-center text-3xl 2xl:text-4xl font-bold mb-10">Послуги</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 justify-items-center">
        {services.map((service) => (
          <div
            key={service.id}
            className="w-full max-w-[360px] bg-white rounded-xl border-2 border-primary shadow-xl p-5 flex flex-col justify-between"
          >
            <Link to={`/services/${service.id}`} className="flex flex-col items-center text-center hover:no-underline">
              <img
                src={`http://localhost:5000/${service.imagePath}`}
                alt={service.title}
                className="w-full h-[180px] object-cover rounded-lg border-2 border-primary mb-4"
              />
              <h2 className="text-xl font-bold text-primary mb-2">{service.title}</h2>
              {service.description && (
                <p className="text-sm text-primary mb-4 line-clamp-3">{service.description}</p>
              )}
              <p className="text-primary font-semibold text-lg">Від: {service.price} грн</p>
            </Link>
            <Link
              to={`/services/${service.id}`}
              className="mt-4 bg-primary text-background font-roboto font-bold text-lg rounded-lg py-3 text-center hover:bg-blue-800 transition"
            >
              Детальніше
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
