import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoctorProfile } from '../api/doctorApi';
import EditDoctorProfileForm from '../components/doctors/EditDoctorProfileForm';
import BookAppointmentPage from './BookAppointmentPage';
import Modal from '../components/Modal';
import ReviewList from '../components/review/ReviewList';

const DoctorProfilePage = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadDoctorProfile = async () => {
      if (!doctorId || isNaN(Number(doctorId))) {
        console.error('Invalid doctorId:', doctorId);
        return;
      }

      try {
        const { data } = await getDoctorProfile(Number(doctorId));
        setDoctor(data);

        // Перевірка чи авторизований користувач — це власник профілю
        const tokenPayload = JSON.parse(atob(localStorage.getItem('token')!.split('.')[1]));
        if (tokenPayload.id === Number(doctorId)) {
          setIsOwnProfile(true);
        }
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
      }
    };

    loadDoctorProfile();
  }, [doctorId]);

  if (!doctor) return <div>Loading...</div>;

  return (
    <div>
      <h2>Dr. {doctor.firstName} {doctor.lastName}</h2>
      <p>Email: {doctor.email}</p>
      <p>Phone: {doctor.phone}</p>
      <p>Education: {doctor.profile?.education}</p>
      <p>Experience: {doctor.profile?.experience}</p>
      <p>Bio: {doctor.profile?.bio}</p>
      <div>
      {doctor.photoUrl && <img src={doctor.photoUrl} alt="Doctor" width={200} />}
      </div>
      
      {isOwnProfile && (
        <>
          <EditDoctorProfileForm userId={Number(doctorId)} />
        </>
      )}
      {/* Кнопка для бронювання */}
      <button onClick={() => setShowModal(true)}>
        Забронювати
      </button>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <BookAppointmentPage doctorId={Number(doctorId)} />
        </Modal>
      )}

      <div>    
        <ReviewList serviceId={Number(doctorId)} />
      </div>
    </div>
  );
};

export default DoctorProfilePage;
