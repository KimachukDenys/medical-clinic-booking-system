import { useState, useEffect } from 'react';
import { getAllDoctors } from '../../api/doctorApi';
import { createService, assignDoctorToService } from '../../api/serviceApi';
import {getAllCategories } from '../../api/categoryApi'

interface Category {
  id: number;
  name: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

const ServiceForm = ({ token }: { token: string }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | string>('');
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [selectedDoctors, setSelectedDoctors] = useState<User[]>([]);

  useEffect(() => {
    getAllCategories()
      .then(responce => setCategories(responce.data))
      .catch(error => console.error('Error fetching categories:', error));

    getAllDoctors()
      .then(response => setDoctors(response.data))
      .catch(error => console.error('Error fetching doctors:', error));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleDoctorSelect = (doctor: User) => {
    if (!selectedDoctors.some(d => d.id === doctor.id)) {
      setSelectedDoctors(prevDoctors => [...prevDoctors, doctor]);
    }
  };

  const handleDoctorRemove = (doctorId: number) => {
    setSelectedDoctors(prevDoctors => prevDoctors.filter(doctor => doctor.id !== doctorId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert('Будь ласка, завантажте зображення.');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('categoryId', categoryId.toString());
    formData.append('image', image);

    try {
      const response = await createService(formData, token);
      const serviceId = response.data?.id;

      if (!serviceId) throw new Error('Не вдалося отримати ID сервісу.');

      // Призначити кожного лікаря до сервісу
      for (const doctor of selectedDoctors) {
        await assignDoctorToService(serviceId, doctor.id, token);
      }

      alert('Сервіс створено!');
      // reset form optionally
    } catch (error) {
      alert('Помилка при створенні сервісу');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">Додати новий сервіс</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Назва</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Назва"
          className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Опис</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Опис"
          rows={3}
          className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ціна</label>
        <input
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Ціна"
          type="number"
          className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Категорія</label>
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none"
        >
          <option value="">Виберіть категорію</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Зображення</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Лікарі</label>
        <select
          onChange={(e) => {
            const doctor = doctors.find(d => d.id === Number(e.target.value));
            if (doctor) handleDoctorSelect(doctor);
          }}
          defaultValue=""
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="">Виберіть лікаря</option>
          {doctors.map(doctor => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.firstName} {doctor.lastName}
            </option>
          ))}
        </select>

        {selectedDoctors.length > 0 && (
          <ul className="mt-3 space-y-2">
            {selectedDoctors.map(doctor => (
              <li key={doctor.id} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md">
                <span>{doctor.firstName} {doctor.lastName}</span>
                <button
                  type="button"
                  onClick={() => handleDoctorRemove(doctor.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Видалити
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
      >
        Створити сервіс
      </button>
    </form>
  );
};

export default ServiceForm;
