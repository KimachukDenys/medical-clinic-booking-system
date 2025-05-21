// src/pages/user/UserProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserProfile } from '../../api/userApi';
import AppointmentsListForm from '../../components/services/AppointmentsListForm';
import UserReviewsForm from '../../components/review/UserReviewsForm';
import { parseJwt } from '../../utils/jwt';          

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showReviews, setShowReviews] = useState(false);   
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!id || isNaN(+id)) return;

      try {
        const { data } = await getUserProfile(+id);
        setUser(data);

        if (token) {
          const payload = parseJwt(token);
          setIsOwnProfile(payload?.id === +id);
        }
      } catch (e) {
        console.error('Error fetching user profile:', e);
      }
    };
    loadUserProfile();
  }, [id, token]);

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  /* ------ UI ------ */
  return (
    <div className="space-y-10">
      {/* === картка профілю === */}
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
        <div className="flex items-center space-x-6 mb-6">
          {user.photoUrl ? (
            <img
              src={
                user.photoUrl.startsWith('http')
                  ? user.photoUrl
                  : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${user.photoUrl}`
              }
              alt={`${user.firstName} ${user.lastName}`}
              className="w-44 h-44 rounded-full border-4 border-primary object-cover shadow-md"
            />
          ) : (
            <div className="w-44 h-44 flex items-center justify-center bg-gray-200 rounded-full text-gray-500 text-2xl font-semibold">
              Немає фото
            </div>
          )}

          <h2 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h2>
        </div>

        <div className="space-y-2 text-gray-700">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Телефон:</strong> {user.phone}</p>
        </div>

        {isOwnProfile && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link
              to={`/user/profile/edit/${user.id}`}
              className="flex-1 bg-blue-600 text-white py-2 text-center rounded hover:bg-blue-700 transition"
            >
              Змінити профіль
            </Link>

            {/* кнопка-перемикач для відгуків */}
            <button
              onClick={() => setShowReviews(prev => !prev)}
              className="flex-1 border border-primary text-primary py-2 rounded hover:bg-primary hover:text-white transition"
            >
              {showReviews ? 'Сховати відгуки' : 'Переглянути відгуки'}
            </button>
          </div>
        )}
      </div>

      {/* === секція з відгуками (тільки власник і після кліку) === */}
      {showReviews && isOwnProfile && (
        <UserReviewsForm userId={user.id} token={token!} />
      )}

      {/* === список записів користувача (видно всім) === */}
      <div className="max-w-4xl mx-auto">
        <AppointmentsListForm />
      </div>
    </div>
  );
};

export default UserProfilePage;
