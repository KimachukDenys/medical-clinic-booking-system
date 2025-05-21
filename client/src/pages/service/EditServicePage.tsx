import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getServiceById,
  updateService,
  assignDoctorToService,
  removeDoctorFromService,
  getDoctorsForService
} from '../../api/serviceApi';
import { getAllDoctors } from '../../api/doctorApi';
import { getAllCategories } from '../../api/categoryApi';

interface Category {
  id: number;
  name: string;
}

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  imagePath: string;
  isHidden: boolean;
  categoryId: number;
  doctors?: Doctor[];
}

const EditServicePage = () => {
  const token = localStorage.getItem('token') || '';
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctors, setSelectedDoctors] = useState<Doctor[]>([]);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (!id) return;

    getServiceById(id)
      .then((data: Service) => {
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price.toString());
        setCategoryId(data.categoryId);
        setImagePath(data.imagePath || '');
        setIsHidden(data.isHidden);
      })
      .catch((error) => console.error('Error fetching service:', error));

    getAllCategories()
      .then((res) => setCategories(res.data))
      .catch((error) => console.error('Error fetching categories:', error));

    getAllDoctors()
      .then((res) => setDoctors(res.data))
      .catch((error) => console.error('Error fetching doctors:', error));

    // ⬇️ Запит лікарів для сервісу
    const token = localStorage.getItem('token');
    if (token) {
      getDoctorsForService(Number(id), token)
        .then(res => setSelectedDoctors(res.data))
        .catch(err => console.error('Error fetching doctors for service:', err));
    }
  }, [id]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleDoctorSelect = (doctorId: number) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor && !selectedDoctors.some(d => d.id === doctor.id)) {
      setSelectedDoctors(prev => [...prev, doctor]);
    }
  };

  const handleDoctorRemove = async (doctorId: number) => {
    if (!id || !token) return;

    try {
      await removeDoctorFromService(Number(id), doctorId, token);
      setSelectedDoctors(prev => prev.filter(d => d.id !== doctorId));
      alert('Доктора видалено!');
    } catch (error) {
      alert('Помилка при видаленні доктора');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('categoryId', categoryId.toString());
    formData.append('isHidden', isHidden.toString());

    if (image) {
      formData.append('image', image);
    }

    selectedDoctors.forEach(doctor => {
      formData.append('doctors[]', doctor.id.toString());
    });

    try {
      await updateService(id, formData, token);
      alert('Сервіс оновлено!');

      for (const doctor of selectedDoctors) {
        await assignDoctorToService(Number(id), doctor.id, token);
      }

      navigate('/admin/services');
    } catch (error) {
      alert('Помилка при оновленні сервісу або додаванні лікарів');
      console.error('Update error:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-2xl font-semibold mb-6 text-center">Редагувати сервіс</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Назва"
          required
        />
        <textarea
          className="w-full border p-2 rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Опис"
          required
        />
        <input
          className="w-full border p-2 rounded"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Ціна"
          type="number"
          required
        />

        <select
          className="w-full border p-2 rounded"
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          required
        >
          <option value="">Виберіть категорію</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>

        <div>
          <label className="block font-medium mb-1">Статус сервісу:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isHidden"
                value="false"
                checked={!isHidden}
                onChange={() => setIsHidden(false)}
              />
              Видимий
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isHidden"
                value="true"
                checked={isHidden}
                onChange={() => setIsHidden(true)}
              />
              Прихований
            </label>
          </div>
        </div>

        {imagePath && (
          <div>
            <h3 className="font-medium mb-2">Зображення сервісу:</h3>
            <img src={`http://localhost:5000/${imagePath}`} alt="Service" className="w-48 h-auto mb-2 rounded border" />
          </div>
        )}
        <input type="file" onChange={handleImageChange} className="w-full" />

        <div>
          <h3 className="font-medium mb-2">Лікарі, прив'язані до сервісу:</h3>
          {selectedDoctors.length > 0 ? (
            selectedDoctors.map(doctor => (
              <div key={doctor.id} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
                <span>{doctor.firstName} {doctor.lastName}</span>
                <button
                  type="button"
                  onClick={() => handleDoctorRemove(doctor.id)}
                  className="text-red-500 hover:underline"
                >
                  Видалити
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Лікарів немає</p>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-2">Додати лікаря</h3>
          <select
            onChange={(e) => handleDoctorSelect(Number(e.target.value))}
            defaultValue=""
            className="w-full border p-2 rounded"
          >
            <option value="">Виберіть лікаря</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.firstName} {doctor.lastName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Оновити
        </button>
      </form>
    </div>
  );
};

export default EditServicePage;
