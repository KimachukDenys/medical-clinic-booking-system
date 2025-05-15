import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById, updateService, assignDoctorToService, removeDoctorFromService } from '../api/serviceApi';
import { getAllDoctors } from '../api/doctorApi';
import { getAllCategories } from '../api/categoryApi';

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

    // Завантажуємо інформацію про сервіс
    getServiceById(id)
      .then((data: Service) => {
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price.toString());
        setCategoryId(data.categoryId);
        setSelectedDoctors(data.doctors || []);
        setImagePath(data.imagePath || '');
        setIsHidden(data.isHidden);
      })
      .catch((error) => console.error('Error fetching service:', error));

    // Завантажуємо категорії та лікарів
    getAllCategories()
      .then((res) => setCategories(res.data))
      .catch((error) => console.error('Error fetching categories:', error));

    getAllDoctors()
      .then((res) => setDoctors(res.data))
      .catch((error) => console.error('Error fetching doctors:', error));
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  // Обробка вибору лікаря
  const handleDoctorSelect = (doctorId: number) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor && !selectedDoctors.some(d => d.id === doctor.id)) {
      setSelectedDoctors(prevDoctors => [...prevDoctors, doctor]);
    }
  };

  // Видалення лікаря з сервісу
  const handleDoctorRemove = async (doctorId: number) => {
    if (!id || !token) return;

    try {
      await removeDoctorFromService(Number(id), doctorId, token);
      setSelectedDoctors(prevDoctors => prevDoctors.filter(d => d.id !== doctorId));
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
      // Update the service first
      await updateService(id, formData, token);
      alert('Сервіс оновлено!');

      // Assign selected doctors to the service
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
    <div>
      <h1>Редагувати сервіс</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Назва"
          required
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Опис"
          required
        />
        <input
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Ціна"
          type="number"
          required
        />

        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          required
        >
          <option value="">Виберіть категорію</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <div>
          <label>Статус сервісу:</label>
          <div>
            <label>
              <input
                type="radio"
                name="isHidden"
                value="false"
                checked={!isHidden}
                onChange={() => setIsHidden(false)}
              />
              Видимий
            </label>
            <label>
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

        {/* Display the current service image */}
        {imagePath && (
          <div>
            <h3>Зображення сервісу:</h3>
            <img src={`http://localhost:5000/${imagePath}`} alt="Service" style={{ width: '200px', height: 'auto' }} />
          </div>
        )}

        <input type="file" onChange={handleImageChange} />

        {/* Display current doctors attached to the service */}
        <div>
          <h3>Лікарі, прив'язані до сервісу:</h3>
          {selectedDoctors.length > 0 ? (
            selectedDoctors.map(doctor => (
              <div key={doctor.id}>
                <p>{doctor.firstName} {doctor.lastName}</p>
                <button type="button" onClick={() => handleDoctorRemove(doctor.id)}>
                  Видалити
                </button>
              </div>
            ))
          ) : (
            <p>Лікарів немає</p>
          )}
        </div>


        <div>
          <h3>Виберіть лікаря</h3>
          <select onChange={(e) => handleDoctorSelect(Number(e.target.value))} defaultValue="">
            <option value="">Виберіть лікаря</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.firstName} {doctor.lastName}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Оновити</button>
      </form>
    </div>
  );
};


export default EditServicePage;