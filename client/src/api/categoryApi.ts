// src/api/categoryApi.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/categories';

export const createCategory = (data: { name: string }, token: string) =>
  axios.post(`${API_URL}/create`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllCategories = () => axios.get(API_URL);

export const updateCategory = (id: number, name: string, token: string) =>
  axios.put(`${API_URL}/${id}`, { name }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteCategory = (id: number, token: string) =>
  axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
