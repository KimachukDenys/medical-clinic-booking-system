import { useState, useEffect } from 'react';
import { getAllDoctors } from '../../api/doctorApi'; // Ваш API для отримання лікарів
import { createService } from '../../api/serviceApi';

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
  const [categoryId, setCategoryId] = useState<number | string>(''); // Для вибору категорії
  const [image, setImage] = useState<File | null>(null); // Для зображення
  const [categories, setCategories] = useState<Category[]>([]); // Для отримання списку категорій
  const [doctors, setDoctors] = useState<User[]>([]); // Для списку доступних лікарів
  const [selectedDoctors, setSelectedDoctors] = useState<User[]>([]); // Для вибраних лікарів

  useEffect(() => {
    // Отримуємо список категорій з API
    fetch('http://localhost:5000/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));

    // Отримуємо список лікарів з вашого API
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
    // Перевірка, чи лікар вже доданий
    if (!selectedDoctors.some(d => d.id === doctor.id)) {
      setSelectedDoctors(prevDoctors => [...prevDoctors, doctor]);
    }
  };

  const handleDoctorRemove = (doctorId: number) => {
    setSelectedDoctors(prevDoctors => prevDoctors.filter(doctor => doctor.id !== doctorId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (image) {
      // Створюємо форму для відправки файлу
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('categoryId', categoryId ? categoryId.toString() : '');
      formData.append('image', image);

      // Додаємо лікарів до форми
      selectedDoctors.forEach(doctor => {
        formData.append('doctors[]', doctor.id.toString());
      });

      try {
        await createService(formData, token);
        alert('Сервіс створено!');
      } catch (error) {
        alert('Помилка при створенні сервісу');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Назва"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Опис"
      />
      <input
        value={price}
        onChange={e => setPrice(e.target.value)}
        placeholder="Ціна"
        type="number"
      />

      {/* Вибір категорії */}
      <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
        <option value="">Виберіть категорію</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Поле для завантаження зображення */}
      <input type="file" onChange={handleImageChange} />

      {/* Вибір лікарів */}
      <div>
        <h3>Виберіть лікарів</h3>
        <select onChange={(e) => handleDoctorSelect(doctors.find(doctor => doctor.id === Number(e.target.value))!)} defaultValue="">
          <option value="">Виберіть лікаря</option>
          {doctors.map(doctor => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.firstName} {doctor.lastName}
            </option>
          ))}
        </select>

        {/* Список вибраних лікарів */}
        <div>
          <h4>Вибрані лікарі:</h4>
          <ul>
            {selectedDoctors.map(doctor => (
              <li key={doctor.id}>
                {doctor.firstName} {doctor.lastName}
                <button type="button" onClick={() => handleDoctorRemove(doctor.id)}>Видалити</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button type="submit">Створити</button>
    </form>
  );
};

export default ServiceForm;
