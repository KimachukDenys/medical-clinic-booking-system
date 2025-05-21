import React, { useEffect, useState } from 'react';
import { getAllDoctors } from '../../api/doctorApi';
import DoctorsListForm from '../../components/doctors/DoctorsListForm';

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoUrl: string;
  profile?: {
    education: string;
    experience: string;
    bio: string;
    specialization: string;
    price: number;
    rating: number | null;
  };
}

const DoctorsListPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getAllDoctors();
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
    <div className="max-w-[1650px] lg:max-w-[1300px] mx-auto px-4 py-8">
      <h1 className="text-primary text-center text-3xl 2xl:text-4xl font-bold mb-10">Лікарі</h1>
      <DoctorsListForm doctors={doctors} />
    </div>
  );
};

export default DoctorsListPage;
