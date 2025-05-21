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
        setTimeout(() => navigate('/appointments'), 1500);
      })
      .catch(err => {
        console.error(err);
        setMessage('Помилка при оновленні.');
      });
  };

  if (message && !appointment) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-red-100 text-red-700 rounded shadow text-center font-semibold">
        {message}
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-gray-100 rounded shadow text-center font-medium text-gray-600">
        Завантаження...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">Редагування бронювання #{appointment.id}</h2>
      
      <div className="mb-6 space-y-3 text-gray-700">
        <p><span className="font-semibold">Послуга:</span> {appointment.Service.title}</p>
        <p><span className="font-semibold">Лікар:</span> {appointment.doctor.firstName} {appointment.doctor.lastName}</p>
        <p><span className="font-semibold">Пацієнт:</span> {appointment.patient.firstName} {appointment.patient.lastName}</p>
        <p><span className="font-semibold">Дата:</span> {new Date(appointment.date).toLocaleString()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="text-gray-700 font-semibold mb-2 block">Статус:</span>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as Appointment['status'])}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          >
            <option value="pending">Очікує</option>
            <option value="confirmed">Підтверджено</option>
            <option value="finished">Завершено</option>
            <option value="cancelled">Скасовано</option>
          </select>
        </label>

        <button
          type="submit"
          className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-blue-800 transition-shadow shadow-md hover:shadow-lg"
        >
          Зберегти
        </button>
      </form>

      {message && appointment && (
        <p className="mt-4 text-center text-green-600 font-semibold">{message}</p>
      )}
    </div>
  );
};

export default UpdateAppointmentForm;
