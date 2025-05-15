import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createAppointment, getBookedSlots } from '../api/appointmentApi';
import AppointmentForm from '../components/services/AppointmentForm';
import { getDoctorsForService } from '../api/serviceApi';

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
}

const BookAppointmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // serviceId from URL
  const [doctorId, setDoctorId] = useState('');
  const [appointmentData, setAppointmentData] = useState({ date: '', time: '' });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  // Завантажити лікарів для вибраного сервісу
  useEffect(() => {
    if (!token || !id) return;

    getDoctorsForService(Number(id), token)
      .then((res) => {
        setDoctors(res.data);
        if (res.data.length === 0) {
          setMessage('Немає доступних лікарів для цієї послуги.');
        }
      })
      .catch(() => {
        setMessage('Не вдалося завантажити лікарів для цієї послуги.');
      });
  }, [token, id]);

  // Завантажити зайняті слоти
  useEffect(() => {
    if (doctorId && appointmentData.date && token) {
      getBookedSlots(Number(doctorId), appointmentData.date, token)
        .then((res) => {
          setBookedSlots(res.data);
        })
        .catch(() => setBookedSlots([]));
    } else {
      setBookedSlots([]);
    }
  }, [doctorId, appointmentData.date, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage('Будь ласка, увійдіть для запису.');
      return;
    }

    const { date, time } = appointmentData;
    if (!date || !time || !doctorId) {
      setMessage('Оберіть лікаря, дату та час.');
      return;
    }

    try {
      const datetime = `${date}T${time}:00`;
      await createAppointment(
        {
          doctorId: Number(doctorId),
          serviceId: Number(id),
          date: datetime,
        },
        token
      );
      setMessage('Запис успішно створено!');
      setDoctorId('');
      setAppointmentData({ date: '', time: '' });
    } catch (err) {
      setMessage('Помилка при створенні запису.');
    }
  };

  return (
    <div>
      <h1>Запис на прийом</h1>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Лікар:</label>
          <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
            <option value="">Оберіть лікаря</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.firstName} {doctor.lastName}
              </option>
            ))}
          </select>
        </div>

        <AppointmentForm
          value={appointmentData}
          onChange={setAppointmentData}
          doctorId={Number(doctorId)}
          token={token || ''}         
        />

        <button type="submit">Записатись</button>
      </form>
    </div>
  );
};

export default BookAppointmentPage;
