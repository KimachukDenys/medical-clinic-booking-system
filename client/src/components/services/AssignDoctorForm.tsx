// components/services/AssignDoctorForm.tsx
import React, { useEffect, useState } from 'react';
import { assignDoctorToService } from '../../api/serviceApi';
import { getAllDoctors } from '../../api/doctorApi';

interface Props {
  serviceId: number;
  token: string;
  onClose: () => void;
}

interface Doctor {
  id: number;
  name: string;
  email: string;
}

const AssignDoctorForm: React.FC<Props> = ({ serviceId, token, onClose }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');

  useEffect(() => {
    getAllDoctors()
      .then(res => setDoctors(res.data))
      .catch(() => alert('Не вдалося завантажити список докторів'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    try {
      await assignDoctorToService(serviceId, Number(selectedDoctor), token);
      alert('Доктора додано до сервісу!');
      onClose();
    } catch {
      alert('Помилка при додаванні доктора.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}>
        <option value="">Оберіть доктора</option>
        {doctors.map(doc => (
          <option key={doc.id} value={doc.id}>
            {doc.name} ({doc.email})
          </option>
        ))}
      </select>
      <button type="submit">Додати</button>
      <button type="button" onClick={onClose}>Скасувати</button>
    </form>
  );
};

export default AssignDoctorForm;
