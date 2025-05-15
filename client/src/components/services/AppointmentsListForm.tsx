import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAppointments, deleteAppointmentById } from '../../api/appointmentApi';

interface Appointment {
  id: number;
  date: string;
  doctor: { firstName: string; lastName: string };
  patient: { firstName: string; lastName: string };
  Service: { title: string };
  status: 'pending' | 'confirmed' | 'finished' | 'cancelled'; // Додаємо поле статусу
}

const AppointmentsListForm: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage('Будь ласка, увійдіть у систему.');
      return;
    }

    getAllAppointments(token)
      .then(res => {
        setAppointments(res.data);
      })
      .catch(err => {
        console.error(err);
        setMessage('Не вдалося отримати список бронювань.');
      });
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/appointment/update/${id}`);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(`Ви дійсно хочете видалити бронювання №${id}?`);
    if (!confirmDelete) return;

    if (!token) {
      setMessage('Увійдіть у систему');
      return;
    }

    deleteAppointmentById(id, token)
      .then(() => {
        setAppointments(prev => prev.filter(appt => appt.id !== id));
        setMessage(`Бронювання №${id} видалено`);
      })
      .catch(err => {
        console.error(err);
        setMessage('Помилка при видаленні');
      });
  };

  return (
    <div>
      <h2>Список бронювань</h2>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Послуга</th>
            <th>Лікар</th>
            <th>Пацієнт</th>
            <th>Дата</th>
            <th>Статус</th> 
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appt => (
            <tr key={appt.id}>
              <td>{appt.id}</td>
              <td>{appt.Service.title}</td>
              <td>{appt.doctor.firstName} {appt.doctor.lastName}</td>
              <td>{appt.patient.firstName} {appt.patient.lastName}</td>
              <td>{new Date(appt.date).toLocaleString()}</td>
              <td>{appt.status}</td> 
              <td>
                <button onClick={() => handleEdit(appt.id)}>Редагувати</button>
                <button onClick={() => navigate(`/appointment/details/${appt.id}`)}>Деталі</button>
                <button onClick={() => handleDelete(appt.id)}>Видалити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsListForm;
