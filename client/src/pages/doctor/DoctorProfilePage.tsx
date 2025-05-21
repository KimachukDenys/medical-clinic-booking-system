import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getDoctorProfile,
} from '../../api/doctorApi';
import EditDoctorProfileForm from '../../components/doctors/EditDoctorProfileForm';
import BookAppointmentPage from '../appointment/BookAppointmentPage';
import Modal from '../../components/Modal';
import ReviewList from '../../components/review/ReviewList';
import { parseJwt } from '../../utils/jwt';

const DoctorProfilePage: React.FC = () => {
  /* id із URL (публічний маршрут) */
  const { doctorId: urlId } = useParams<{ doctorId?: string }>();

  /* id із JWT (власник) */
  const tokenPayload = parseJwt(localStorage.getItem('token') || '');
  const myId = tokenPayload?.id as number | undefined;

  /* id, який завантажуємо */
  const idToLoad = urlId ? Number(urlId) : myId;

  const [doctor, setDoctor] = useState<any | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  /* --- завантаження профілю --- */
  useEffect(() => {
    console.log('useEffect triggered, idToLoad:', idToLoad);
    if (!idToLoad || isNaN(idToLoad)) {
      console.log('Invalid idToLoad:', idToLoad);
      return;
    }

    const load = async () => {
      try {
        console.log('Fetching doctor profile for id:', idToLoad);
        const { data } = await getDoctorProfile(idToLoad);
        console.log('Data received:', data);

        const owner = !!myId && myId === idToLoad;
        setIsOwnProfile(owner);

        const profileIsMissing =
          !data.profile ||
          (typeof data.profile === 'object' && Object.keys(data.profile).length === 0);

        if (owner && profileIsMissing) {
          console.log('Profile missing, redirecting to create');
          navigate('/doctor/profile/create', { replace: true });
          return;
        }

        setDoctor(data);
      } catch (err) {
        console.error('Error in load:', err);
        if (!!myId && myId === idToLoad) {
          navigate('/doctor/profile/create', { replace: true });
        }
      }
    };
    load();
  }, [idToLoad, myId, navigate]);


  if (!doctor) return <div>Loading...</div>;

  /* ---------- рендер ---------- */
  return (
    <div className="max-w-[900px] mx-auto p-6 bg-white rounded-xl shadow-lg border border-primary">
      <h1 className="text-primary text-center text-3xl 2xl:text-4xl font-bold mb-8">
        Профіль лікаря
      </h1>

      {/* картка лікаря */}
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-shrink-0">
          {doctor.photoUrl ? (
            <img
              src={doctor.photoUrl.startsWith('http') ? doctor.photoUrl : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${doctor.photoUrl}`}
              alt={`${doctor.firstName} ${doctor.lastName}`}
              className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-primary object-cover shadow-md"
            />
          ) : (
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl font-semibold">
              Немає фото
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4 text-primary font-inter">
          <h2 className="text-2xl 2xl:text-3xl font-semibold">
            Dr.&nbsp;{doctor.firstName} {doctor.lastName}
          </h2>
          <p><span className="font-semibold">Email:</span> {doctor.email}</p>
          <p><span className="font-semibold">Телефон:</span> {doctor.phone}</p>
          <p><span className="font-semibold">Освіта:</span> {doctor.profile?.education}</p>
          <p><span className="font-semibold">Спеціалізація:</span> {doctor.profile?.specialization}</p>
          <p><span className="font-semibold">Досвід:</span> {doctor.profile?.experience}</p>
          <p className="italic">{doctor.profile?.bio}</p>
          <p><span className="font-semibold">Від:</span> {doctor.profile?.price} грн</p>
        </div>
      </div>

      {/* бронювання */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-blue-800 text-background font-bold rounded-lg px-8 py-3 transition"
        >
          Забронювати
        </button>
      </div>

      {/* кнопка редагування */}
      {isOwnProfile && !isEditing && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded transition"
          >
            Редагувати профіль
          </button>
        </div>
      )}

      {/* форма редагування */}
      {isOwnProfile && isEditing && idToLoad !== undefined && (
        <div className="mt-10 border-t border-primary pt-6">
          <EditDoctorProfileForm
            userId={idToLoad}
            onCancel={() => setIsEditing(false)}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      )}

      {/* модалка бронювання */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <BookAppointmentPage doctorId={idToLoad} />
        </Modal>
      )}

      {/* відгуки */}
      <div className="mt-12">
        <ReviewList serviceId={idToLoad} />
      </div>
    </div>
  );
};

export default DoctorProfilePage;
