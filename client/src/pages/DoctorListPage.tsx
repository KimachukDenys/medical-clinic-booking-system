import React, { useEffect, useState } from 'react';
import { getAllDoctors } from '../api/doctorApi';
import { Link } from 'react-router-dom';

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoUrl: string;
  profile: {
    education: string;
    experience: string;
    bio: string;
    specialization: string;
    price: number;
    rating: number | null;
  };
}

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getAllDoctors();
        setDoctors(response.data);
        setLoading(false);
        console.log(response.data);
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
    <div className="doctors-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Доктори</h1>
      <div className="doctors-list">
        {doctors.map((doctor) => (
          <div 
            key={doctor.id} 
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: '0' }}>
                  {doctor.firstName} {doctor.lastName}
                </h2>
                <p style={{ margin: '5px 0', color: '#666' }}>
                  {doctor.profile.education}
                </p>
              </div>
              <img 
                src={doctor.photoUrl} 
                alt={`${doctor.firstName} ${doctor.lastName}`} 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} 
              />
            </div>

            <p style={{ margin: '15px 0' }}>
              {doctor.profile.bio}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: '0', fontWeight: 'bold' }}>
                Від: {doctor.profile.price} грн 
              </p>
              <p style={{ margin: '0', fontWeight: 'bold' }}>
                Від: {doctor.profile.rating}  
              </p>
              <Link 
                to={`/doctors/${doctor.id}`} 
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Записатися
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;