import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Appointment {
  id: number;
  date: string;
  status: string;
  Service: { title: string; description: string; price: number };
  doctor: { firstName: string; lastName: string };
  patient: { firstName: string; lastName: string };
}

const AppointmentDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Будь ласка, увійдіть у систему.');
      return;
    }

    axios.get(`http://localhost:5000/api/services/appointments/details/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setAppointment(res.data))
    .catch(err => {
      console.error(err);
      if (err.response?.status === 403) {
        setError('У вас немає доступу до цього бронювання.');
      } else {
        setError('Не вдалося отримати деталі.');
      }
    });
  }, [id, token]);

  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!appointment) return <p className="text-center mt-10">Завантаження...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold mb-6 text-primary">Деталі бронювання №{appointment.id}</h2>

      <div className="space-y-4 text-gray-700">
        <p><span className="font-semibold">Дата:</span> {new Date(appointment.date).toLocaleString()}</p>
        <p>
          <span className="font-semibold">Статус:</span>{' '}
          <span className={
            appointment.status === 'confirmed' ? 'text-green-600' :
            appointment.status === 'pending' ? 'text-yellow-600' :
            appointment.status === 'finished' ? 'text-blue-600' :
            appointment.status === 'cancelled' ? 'text-red-600' : ''
          }>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </p>
        <p><span className="font-semibold">Послуга:</span> {appointment.Service.title}</p>
        <p><span className="font-semibold">Опис:</span> {appointment.Service.description}</p>
        <p><span className="font-semibold">Ціна:</span> {appointment.Service.price} грн</p>
        <p><span className="font-semibold">Доктор:</span> {appointment.doctor.firstName} {appointment.doctor.lastName}</p>
        <p><span className="font-semibold">Пацієнт:</span> {appointment.patient.firstName} {appointment.patient.lastName}</p>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-8 px-6 py-3 bg-primary text-background font-bold rounded-lg hover:bg-blue-800 transition"
      >
        Назад
      </button>
    </div>
  );
};

export default AppointmentDetailsPage;
