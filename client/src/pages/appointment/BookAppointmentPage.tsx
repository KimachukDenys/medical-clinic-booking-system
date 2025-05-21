import React, { useState, useEffect } from 'react';
import { createAppointment } from '../../api/appointmentApi';
import AppointmentForm from '../../components/services/AppointmentForm';
import { getDoctorsForService, getServicesForDoctor } from '../../api/serviceApi';

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
}

interface Service {
  id: number;
  title: string;
}

interface BookAppointmentPageProps {
  serviceId?: number;
  doctorId?: number;
}

const BookAppointmentPage: React.FC<BookAppointmentPageProps> = ({ serviceId, doctorId }) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointmentData, setAppointmentData] = useState({ date: '', time: '' });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    if (serviceId) {
      getDoctorsForService(serviceId, token)
        .then(res => {
          setDoctors(res.data);
          if (res.data.length === 0) setMessage('Немає доступних лікарів для цієї послуги.');
        })
        .catch(() => setMessage('Не вдалося завантажити лікарів для цієї послуги.'));
      setSelectedServiceId(serviceId.toString());
    } else if (doctorId) {
      getServicesForDoctor(doctorId, token)
        .then(res => {
          setServices(res.data);
          if (res.data.length === 0) setMessage('Немає доступних послуг для цього лікаря.');
        })
        .catch(() => setMessage('Не вдалося завантажити послуги для цього лікаря.'));
      setSelectedDoctorId(doctorId.toString());
    }
  }, [token, serviceId, doctorId]);

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
    <div className="max-w-[1200px] mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">Запис на прийом</h1>

      {message && (
        <div className="mb-4 p-3 text-center rounded-md bg-green-100 text-green-700 font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Вибір послуги, якщо не на сторінці сервісу */}
        {!serviceId && (
          <div className="flex flex-col">
            <label htmlFor="service" className="mb-2 font-semibold text-primary">Послуга:</label>
            <select
              id="service"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Оберіть послугу</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>{service.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* Вибір лікаря, якщо не на сторінці доктора */}
        {!doctorId && (
          <div className="flex flex-col">
            <label htmlFor="doctor" className="mb-2 font-semibold text-primary">Лікар:</label>
            <select
              id="doctor"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Оберіть лікаря</option>
              {doctors.map(doctor => (
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

        <button
          type="submit"
          className="bg-primary text-background font-bold py-3 rounded-lg hover:bg-blue-800 transition"
        >
          Записатись
        </button>
      </form>
    </div>
  );
};

export default BookAppointmentPage;
