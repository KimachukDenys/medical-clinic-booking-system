import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reviews';

export const createReview = async (data: {
  appointmentId: number;
  userId: number;
  rating: number;
  comment: string;
}, token: string) => {
  const res = await axios.post(`${API_URL}/create`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateReview = async (id: number, data: {
  userId: number;
  rating: number;
  comment: string;
}, token: string) => {
  const res = await axios.put(`${API_URL}/update/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteReview = async (id: number, token: string) => {
  await axios.delete(`${API_URL}/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getDoctorReviews = async (doctorId: number) => {
  const res = await axios.get(`${API_URL}/doctor/${doctorId}`);
  return res.data;
};

export const getServiceReviews = async (serviceId: number) => {
  const res = await axios.get(`${API_URL}/service/${serviceId}`);
  return res.data;
};
