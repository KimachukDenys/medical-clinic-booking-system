// src/api/appointmentApi.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/services/appointments';

interface AppointmentData {
  doctorId: number;
  serviceId: number;
  date: string;
};

export const createAppointment = async (
  data: AppointmentData,
  token: string
) => {
  const response = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // повертаємо лише дані
};

export const updateAppointment = async (id: number, updatedData: any, token: string) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`,updatedData, {
        headers: {Authorization: `Bearer ${token}`},
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Не вдалося оновити бронювання');
  }
};

export const getBookedSlots = async (doctorId: number, date: string, token: string) => {
  return axios.get(`${API_URL}/booked`, {
    params: { doctorId, date },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAllAppointments = (token: string | null) => {
  return axios.get(`${API_URL}/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAppointmentById = (id: number, token: string) => {
  return axios.get(`${API_URL}/details/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteAppointmentById = (id: number, token: string) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};