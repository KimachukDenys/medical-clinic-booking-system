import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createAppointment, getBookedSlots } from '../api/appointmentApi';
import AppointmentForm from '../components/services/AppointmentForm';
import { getDoctorsForService, getServicesForDoctor } from '../api/serviceApi';


interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
}

interface BookAppointmentPageProps {
  serviceId?: number;
  doctorId?: number;
}

const BookAppointmentPage: React.FC<BookAppointmentPageProps> = ({ serviceId, doctorId }) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<{id: number; title: string}[]>([]);
  const [appointmentData, setAppointmentData] = useState({ date: '', time: '' });
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    if (serviceId) {
      // Якщо ми на сторінці сервісу — завантажуємо докторів цього сервісу
      getDoctorsForService(serviceId, token)
        .then(res => {
          setDoctors(res.data);
          if (res.data.length === 0) setMessage('Немає доступних лікарів для цієї послуги.');
        })
        .catch(() => setMessage('Не вдалося завантажити лікарів для цієї послуги.'));
      
      setSelectedServiceId(serviceId.toString());
    } else if (doctorId) {
      // Якщо ми на сторінці доктора — завантажуємо сервіси цього доктора
      getServicesForDoctor(doctorId, token)
        .then((res: any) => {
          setServices(res.data);
          if (res.data.length === 0) setMessage('Немає доступних послуг для цього лікаря.');
        })
        .catch(() => setMessage('Не вдалося завантажити послуги для цього лікаря.'));
      
      setSelectedDoctorId(doctorId.toString());
    }
  }, [token, serviceId, doctorId]);

  // Загрузка зайнятих слотів — залежить від лікаря і дати
  useEffect(() => {
    if (selectedDoctorId && appointmentData.date && token) {
      getBookedSlots(Number(selectedDoctorId), appointmentData.date, token)
        .then(res => setBookedSlots(res.data))
        .catch(() => setBookedSlots([]));
    } else {
      setBookedSlots([]);
    }
  }, [selectedDoctorId, appointmentData.date, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage('Будь ласка, увійдіть для запису.');
      return;
    }

    if (!selectedDoctorId || !selectedServiceId || !appointmentData.date || !appointmentData.time) {
      setMessage('Оберіть лікаря, послугу, дату та час.');
      return;
    }

    try {
      const datetime = `${appointmentData.date}T${appointmentData.time}:00`;
      await createAppointment(
        {
          doctorId: Number(selectedDoctorId),
          serviceId: Number(selectedServiceId),
          date: datetime,
        },
        token
      );
      setMessage('Запис успішно створено!');
      setSelectedDoctorId('');
      setSelectedServiceId('');
      setAppointmentData({ date: '', time: '' });
    } catch {
      setMessage('Помилка при створенні запису.');
    }
  };

  return (
    <div>
      <h1>Запис на прийом</h1>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* Якщо ми на сторінці сервісу - не показуємо вибір сервісу */}
        {!serviceId && (
          <div>
            <label>Послуга:</label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              required
            >
              <option value="">Оберіть послугу</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Якщо ми на сторінці доктора - не показуємо вибір лікаря */}
        {!doctorId && (
          <div>
            <label>Лікар:</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              required
            >
              <option value="">Оберіть лікаря</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        <AppointmentForm
          value={appointmentData}
          onChange={setAppointmentData}
          doctorId={Number(selectedDoctorId)}
          token={token || ''}
        />

        <button type="submit">Записатись</button>
      </form>
    </div>
  );
};


export default BookAppointmentPage;
