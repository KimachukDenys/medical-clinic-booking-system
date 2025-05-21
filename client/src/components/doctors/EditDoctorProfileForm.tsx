import React, { useState, useEffect } from 'react'; 
import { updateDoctorProfile, getDoctorProfile } from '../../api/doctorApi';

type Props = {
  userId: number;
  onCancel: () => void;
  onSuccess: () => void;
};

const EditDoctorProfileForm: React.FC<Props> = ({ userId, onCancel, onSuccess }) => {
  const [form, setForm] = useState({
    education: '',
    experience: '',
    bio: '',
    specialization: '',
    price: '',
  });

  const [loading, setLoading] = useState(false);

  // Підвантажуємо початкові дані профілю при монтуванні
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getDoctorProfile(userId);
        setForm({
          education: data.profile?.education || '',
          experience: data.profile?.experience || '',
          bio: data.profile?.bio || '',
          specialization: data.profile?.specialization || '',
          price: data.profile?.price?.toString() || '',
        });
      } catch (error) {
        console.error('Помилка завантаження профілю:', error);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Користувач не авторизований.');
      setLoading(false);
      return;
    }

    try {
      await updateDoctorProfile(
        userId,
        {
          education: form.education || undefined,
          experience: form.experience || undefined,
          bio: form.bio || undefined,
          specialization: form.specialization || undefined,
          price: form.price ? Number(form.price) : undefined,
        },
        token
      );
      alert('Профіль оновлено!');
      onSuccess();  // Закриваємо форму
    } catch (err) {
      console.error('Помилка оновлення:', err);
      alert('Помилка оновлення профілю');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
      <div>
        <label className="block mb-1 font-semibold text-primary" htmlFor="education">Освіта</label>
        <input
          id="education"
          name="education"
          placeholder="Освіта"
          value={form.education}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-primary" htmlFor="experience">Досвід</label>
        <input
          id="experience"
          name="experience"
          placeholder="Досвід"
          value={form.experience}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-primary" htmlFor="bio">Про себе</label>
        <textarea
          id="bio"
          name="bio"
          placeholder="Про себе"
          value={form.bio}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-primary" htmlFor="specialization">Спеціалізація</label>
        <input
          id="specialization"
          name="specialization"
          placeholder="Спеціалізація"
          value={form.specialization}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-primary" htmlFor="price">Ціна (грн)</label>
        <input
          id="price"
          name="price"
          placeholder="Ціна"
          value={form.price}
          onChange={handleChange}
          type="number"
          min={0}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded transition"
        >
          Відмінити
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded transition"
        >
          {loading ? 'Оновлення...' : 'Оновити профіль'}
        </button>
      </div>
    </form>
  );
};

export default EditDoctorProfileForm;
