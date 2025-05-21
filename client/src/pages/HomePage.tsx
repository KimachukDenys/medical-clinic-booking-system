import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllServices } from '../api/serviceApi';
import { getAllDoctors } from '../api/doctorApi';
import { Link } from 'react-router-dom';
import DoctorsListForm from '../components/doctors/DoctorsListForm';

interface Service {
  id: number;
  title: string;
  price: number;
  imagePath: string;
  description?: string;
}

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoUrl: string;
  profile?: {
    education: string;
    experience: string;
    bio: string;
    specialization: string;
    price: number;
    rating: number | null;
  };
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [errorDoctors, setErrorDoctors] = useState('');
  const [errorServices, setErrorServices] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await getAllServices();
        setServices(servicesRes.data.slice(0, 3));
        setLoadingServices(false);
      } catch (error) {
        setErrorServices('Помилка завантаження послуг');
        setLoadingServices(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        const doctorsRes = await getAllDoctors();
        setDoctors(doctorsRes.data.slice(0, 2));
        setLoadingDoctors(false);
      } catch (error) {
        setErrorDoctors('Помилка завантаження лікарів');
        setLoadingDoctors(false);
      }
    };

    fetchData();
    fetchDoctors();
  }, []);

  const handleBookNow = () => {
    navigate('/services');
  };

  return (
    <div className="px-6 py-10 max-w-screen-xl mx-auto">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          Ваша турбота — наше покликання
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Запишіться на прийом до досвідчених лікарів за декілька кліків.
        </p>
        <button
          onClick={handleBookNow}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl text-lg transition"
        >
          Записатись зараз
        </button>
      </section>

      {/* Popular Services */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Популярні послуги</h2>
        {loadingServices ? (
          <p>Завантаження послуг...</p>
        ) : errorServices ? (
          <p className="text-red-600">{errorServices}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.map(service => (
              <div
                key={service.id}
                className="bg-white shadow-md border-2 border-primary rounded-2xl p-4 hover:shadow-lg transition"
              >
                <Link to={`/services/${service.id}`} className="block text-center">
                  <img
                    src={`http://localhost:5000/${service.imagePath}`}
                    alt={service.title}
                    className="w-full h-[180px] object-cover rounded-xl mb-4 border-2 border-primary"
                  />
                  <h3 className="text-xl font-bold text-primary mb-2">{service.title}</h3>
                  {service.description && (
                    <p className="text-sm text-primary mb-3 line-clamp-3">{service.description}</p>
                  )}
                  <p className="text-primary font-semibold text-lg">Від: {service.price} грн</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Doctors */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Рекомендовані лікарі</h2>
        {loadingDoctors ? (
          <p>Завантаження лікарів...</p>
        ) : errorDoctors ? (
          <p className="text-red-600">{errorDoctors}</p>
        ) : (
          <DoctorsListForm doctors={doctors} />
        )}
      </section>
    </div>
  );
};

export default HomePage;
