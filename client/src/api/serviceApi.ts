// File: src/api/serviceApi.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/services';

export const getAllServices = (params = {}) => {
  return axios.get(`${API_URL}`, { params });
};

// Функція для отримання даних сервісу за ID
export const getServiceById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; // Повертаємо дані сервісу
  } catch (error) {
    console.error('Error fetching service:', error);
    throw new Error('Не вдалося отримати сервіс');
  }
};

export const getDoctorsForService = async (serviceId: number, token: string | null) => {
  return axios.get(`${API_URL}/${serviceId}/doctors`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getServicesForDoctor = async (doctorId: number, token: string | null) => {
  return axios.get(`${API_URL}/${doctorId}/services`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createService = (data: FormData, token: string) => {
  return axios.post(`${API_URL}/create`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Вказуємо тип контенту для файлів
    },
  });
};

export const updateService = (id: string, formData: FormData, token: string) => {
  return axios.put(`${API_URL}/update/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const assignDoctorToService = (serviceId: number, doctorId: number, token: string) => {
  return axios.post(
    `${API_URL}/${serviceId}/add/doctors`,
    { doctorId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const removeDoctorFromService = async (serviceId: number, doctorId: number, token: string) => {
  return axios.delete(`${API_URL}/${serviceId}/remove/doctors/${doctorId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
