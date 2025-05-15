// src/pages/DoctorsPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profile: {
    education: string;
    experience: string;
    bio: string;
    photoUrl: string;
  };
}

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/doctors');
        setDoctors(response.data);
        setLoading(false);
      } catch (err) {
        setError('Не вдалося завантажити лікарів');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Доктори</h1>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor.id}>
            <Link to={`/doctors/${doctor.id}`}>
              {doctor.firstName} {doctor.lastName}
            </Link>
            <p>Email: {doctor.email}</p>
            <p>Телефон: {doctor.phone}</p>
            <img src={doctor.profile.photoUrl} alt={`${doctor.firstName} ${doctor.lastName}`} width={100} />
            <p>{doctor.profile.bio}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorsPage;
