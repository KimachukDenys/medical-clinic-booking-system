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
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!appointment) return <p>Завантаження...</p>;

  return (
    <div>
      <h2>Деталі бронювання №{appointment.id}</h2>
      <p><strong>Дата:</strong> {new Date(appointment.date).toLocaleString()}</p>
      <p><strong>Статус:</strong> {appointment.status}</p>
      <p><strong>Послуга:</strong> {appointment.Service.title}</p>
      <p><strong>Опис:</strong> {appointment.Service.description}</p>
      <p><strong>Ціна:</strong> {appointment.Service.price} грн</p>
      <p><strong>Доктор:</strong> {appointment.doctor.firstName} {appointment.doctor.lastName}</p>
      <p><strong>Пацієнт:</strong> {appointment.patient.firstName} {appointment.patient.lastName}</p>
      <button onClick={() => navigate(-1)}>Назад</button>
    </div>
  );
};

export default AppointmentDetailsPage;
