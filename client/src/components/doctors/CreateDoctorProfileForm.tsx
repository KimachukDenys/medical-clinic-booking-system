import React, { useState } from 'react';
import { createDoctorProfile } from '../../api/doctorApi';

const CreateDoctorProfileForm = () => {
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
    try {
        const token = localStorage.getItem('token');
        if (!token) {
        alert('Будь ласка, увійдіть в систему');
        return;
        }

        await createDoctorProfile(form, token);
        alert('Профіль створено успішно!');
    } catch (err) {
        console.error('Помилка створення профілю:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="education" placeholder="Освіта" onChange={handleChange} />
      <input name="experience" placeholder="Досвід" onChange={handleChange} />
      <textarea name="bio" placeholder="Про себе" onChange={handleChange} />
      <input name="photoUrl" placeholder="Фото URL (опціонально)" onChange={handleChange} />
      <button type="submit">Створити профіль</button>
    </form>
  );
};

export default CreateDoctorProfileForm;
