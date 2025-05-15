import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointmentById, updateAppointment } from '../../api/appointmentApi';


interface Appointment {
  id: number;
  date: string;
  doctor: { firstName: string; lastName: string };
  patient: { firstName: string; lastName: string };
  Service: { title: string };
  status: 'pending' | 'confirmed' | 'finished' | 'cancelled';
}

const UpdateAppointmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Appointment['status']>('pending');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setMessage('Будь ласка, увійдіть у систему.');
      return;
    }

    if (id) {
      getAppointmentById(Number(id), token)
        .then(res => {
          setAppointment(res.data);
          setStatus(res.data.status);
        })
        .catch(err => {
          console.error(err);
          setMessage('Не вдалося завантажити бронювання.');
        });
    }
  }, [id, token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment || !token) return;

    updateAppointment(appointment.id, { status }, token)
      .then(() => {
        setMessage('Бронювання оновлено успішно.');
        navigate('/appointments');
      })
      .catch(err => {
        console.error(err);
        setMessage('Помилка при оновленні.');
      });
  };

  if (message) {
    return <p>{message}</p>;
  }

  if (!appointment) {
    return <p>Завантаження...</p>;
  }

  return (
    <div>
      <h2>Редагування бронювання #{appointment.id}</h2>
      <p><strong>Послуга:</strong> {appointment.Service.title}</p>
      <p><strong>Лікар:</strong> {appointment.doctor.firstName} {appointment.doctor.lastName}</p>
      <p><strong>Пацієнт:</strong> {appointment.patient.firstName} {appointment.patient.lastName}</p>
      <p><strong>Дата:</strong> {new Date(appointment.date).toLocaleString()}</p>

      <form onSubmit={handleSubmit}>
        <label>
          Статус:
          <select value={status} onChange={(e) => setStatus(e.target.value as Appointment['status'])}>
            <option value="pending">Очікує</option>
            <option value="confirmed">Підтверджено</option>
            <option value="finished">Завершено</option>
            <option value="cancelled">Скасовано</option>
          </select>
        </label>
        <br />
        <button type="submit">Зберегти</button>
      </form>
    </div>
  );
};

export default UpdateAppointmentForm;
