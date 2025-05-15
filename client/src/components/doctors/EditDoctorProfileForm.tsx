import React, { useState } from 'react';
import { updateDoctorProfile } from '../../api/doctorApi';

const EditDoctorProfileForm = ({ userId }: { userId: number }) => {
  const [form, setForm] = useState({
    education: '',
    experience: '',
    bio: '',
    photoUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Користувач не авторизований.');
      return;
    }

    try {
      await updateDoctorProfile(userId, form, token);
      alert('Профіль оновлено!');
    } catch (err) {
      console.error('Помилка оновлення:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="education" placeholder="Освіта" onChange={handleChange} />
      <input name="experience" placeholder="Досвід" onChange={handleChange} />
      <textarea name="bio" placeholder="Про себе" onChange={handleChange} />
      <input name="photoUrl" placeholder="Фото URL" onChange={handleChange} />
      <button type="submit">Оновити профіль</button>
    </form>
  );
};

export default EditDoctorProfileForm;
