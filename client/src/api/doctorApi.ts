// src/api/doctorApi.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

// Отримати профіль лікаря за його ID
export const getDoctorProfile = async (doctorId: number) => {
  try {
    const response = await axios.get(`${API_URL}doctor/profile/${doctorId}`);
    return response;
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    throw error;
  }
};

// Створити профіль лікаря

export const createDoctorProfile = async (
  profileData: {
    education: string;
    experience: string;
    bio: string;
    photoUrl?: string;
  },
  token: string
) => {
  return axios.post(`${API_URL}doctor/profile/create`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Оновити профіль лікаря
export const updateDoctorProfile = (
  userId: number,
  profileData: {
    education?: string;
    experience?: string;
    bio?: string;
    photoUrl?: string;
  },
  token: string
) => {
  return axios.put(`${API_URL}doctor/profile/edit/${userId}`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Отримати список всіх лікарів
export const getAllDoctors = () => {
  return axios.get(`${API_URL}doctors`);
};
