import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../../api/userApi';
import { useParams, useNavigate } from 'react-router-dom';

type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  photoUrl?: string;
};

export default function EditUserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    photo: '',
  });

  useEffect(() => {
    getUserProfile(Number(id))
      .then(res => {
        const data = res.data;
        setUser(data);
        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          photo: data.photoUrl || '',
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('firstName', form.firstName);
    formData.append('lastName', form.lastName);
    formData.append('phone', form.phone);
    if (photoFile) {
      formData.append('image', photoFile);
    }

    try {
      await updateUserProfile(Number(id), formData);  // <-- передаємо FormData, а не form
      navigate(`/user/profile/${id}`);
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };


  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      {form.photo ? (
        <img
          src={form.photo.startsWith('http') ? form.photo : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${form.photo}`}
          alt={`${form.firstName} ${form.lastName}`}
          className="w-44 h-44  rounded-full border-4 border-primary object-cover shadow-md"
        />
      ) : (
        <div className="w-44 h-44 flex items-center justify-center bg-gray-200 rounded-full text-gray-500 text-2xl font-semibold">
           Немає фото
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Photo URL</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
