import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../api/userApi'; // Створи цей запит
// import EditUserProfileForm from '../components/users/EditUserProfileForm'; // Компонент редагування профілю

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!id || isNaN(Number(id))) {
        console.error('Invalid id:', id);
        return;
      }

      try {
        const { data } = await getUserProfile(Number(id));
        setUser(data);

        // Перевірка чи поточний користувач — власник профілю
        const token = localStorage.getItem('token');
        if (token) {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          if (tokenPayload.id === Number(id)) {
            setIsOwnProfile(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    loadUserProfile();
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user.firstName} {user.lastName}</h2>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      {user.photoUrl && <img src={user.photoUrl} alt="User" width={200} />}

      {isOwnProfile && (
        <>
          <h3>Редагувати профіль</h3>
          {/* <EditUserProfileForm id={Number(id)} /> */}
        </>
      )}
    </div>
  );
};

export default UserProfilePage;
