import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAppointments, deleteAppointmentById } from '../../api/appointmentApi';

interface Appointment {
  id: number;
  date: string;
  doctor: { firstName: string; lastName: string };
  patient: { firstName: string; lastName: string };
  Service: { title: string };
  status: 'pending' | 'confirmed' | 'finished' | 'cancelled';
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
      .then(res => setAppointments(res.data))
      .catch(err => {
        console.error(err);
        setMessage('Не вдалося отримати список бронювань.');
      });
  }, [token]);

  const handleEdit = (id: number) => navigate(`/appointment/update/${id}`);
  const handleDelete = (id: number) => {
    if (!window.confirm(`Ви дійсно хочете видалити бронювання №${id}?`)) return;
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
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-primary mb-6">Список бронювань</h2>

      {message && (
        <p className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">{message}</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-primary text-background">
            <tr>
              {['ID', 'Послуга', 'Лікар', 'Пацієнт', 'Дата', 'Статус', 'Дії'].map((title) => (
                <th
                  key={title}
                  className="px-4 py-3 border border-gray-400 text-left text-sm font-semibold"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments.map(appt => (
              <tr key={appt.id} className="hover:bg-gray-100 transition-colors">
                <td className="border border-gray-300 px-3 py-2">{appt.id}</td>
                <td className="border border-gray-300 px-3 py-2 max-w-xs truncate" title={appt.Service.title}>
                  {appt.Service.title}
                </td>
                <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">
                  {appt.doctor.firstName} {appt.doctor.lastName}
                </td>
                <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">
                  {appt.patient.firstName} {appt.patient.lastName}
                </td>
                <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">
                  {new Date(appt.date).toLocaleString()}
                </td>
                <td className={`border border-gray-300 px-3 py-2 font-semibold
                  ${
                    appt.status === 'confirmed' ? 'text-green-600' :
                    appt.status === 'pending' ? 'text-yellow-600' :
                    appt.status === 'finished' ? 'text-blue-600' :
                    appt.status === 'cancelled' ? 'text-red-600' : ''
                  }
                `}>
                  {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                </td>
                <td className="border border-gray-300 px-3 py-2 space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(appt.id)}
                    className="bg-accent text-white px-2 py-1 rounded hover:bg-yellow-700 transition"
                  >
                    Редагувати
                  </button>
                  <button
                    onClick={() => navigate(`/appointment/details/${appt.id}`)}
                    className="bg-secondary text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Деталі
                  </button>
                  <button
                    onClick={() => handleDelete(appt.id)}
                    className="bg-errorColor text-white px-2 py-1 rounded hover:bg-red-700 transition"
                  >
                    Видалити
                  </button>
                  {appt.status === 'finished' && (
                    <button
                      onClick={() => navigate(`/review/${appt.id}`)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                    >
                      Залишити відгук
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsListForm;
