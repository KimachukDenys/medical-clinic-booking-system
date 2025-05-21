import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

// Отримати профіль користувача за його ID
export const getUserProfile = (userId: number) => {
  const token = localStorage.getItem('token');
    
  return axios.get(`${API_URL}/profile/${userId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserProfile = (userId: number, data: FormData) => {
  const token = localStorage.getItem('token');
  return axios.put(`${API_URL}/profile/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
