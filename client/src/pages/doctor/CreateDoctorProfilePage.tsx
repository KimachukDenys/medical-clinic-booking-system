import React, { useState } from 'react';
import { createDoctorProfile } from '../../api/doctorApi';

const CreateDoctorProfilePage = () => {
  const [form, setForm] = useState({
    education: '',
    experience: '',
    bio: '',
    specialization: '',
    price: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Будь ласка, увійдіть в систему');
      return;
    }

    try {
      await createDoctorProfile(
        {
          education: form.education,
          experience: form.experience,
          bio: form.bio,
          specialization: form.specialization,
          price: Number(form.price),
        },
        token
      );
      alert('Профіль створено успішно!');
    } catch (err) {
      console.error('Помилка створення профілю:', err);
      alert('Помилка створення профілю');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-primary mb-6 text-center">
        Створення профілю лікаря
      </h2>

      <label className="block mb-4">
        <span className="text-gray-700 font-medium">Освіта</span>
        <input
          name="education"
          placeholder="Наприклад, Національний медичний університет"
          value={form.education}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-700 font-medium">Досвід</span>
        <input
          name="experience"
          placeholder="Наприклад, 5 років у терапії"
          value={form.experience}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-700 font-medium">Про себе</span>
        <textarea
          name="bio"
          placeholder="Короткий опис"
          value={form.bio}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-700 font-medium">Спеціалізація</span>
        <input
          name="specialization"
          placeholder="Наприклад, Кардіолог"
          value={form.specialization}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>

      <label className="block mb-6">
        <span className="text-gray-700 font-medium">Ціна (грн)</span>
        <input
          name="price"
          placeholder="Вкажіть ціну консультації"
          value={form.price}
          onChange={handleChange}
          type="number"
          min={0}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>

      <button
        type="submit"
        className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors"
      >
        Створити профіль
      </button>
    </form>
  );
};

export default CreateDoctorProfilePage;
