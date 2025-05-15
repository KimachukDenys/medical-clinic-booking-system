// src/pages/AdminCategoriesPage.tsx
import React, { useState, useEffect } from 'react';
import { getAllCategories } from '../api/categoryApi';
import CategoryForm from '../components/categories/CategoryForm';

interface Category {
  id: number;
  name: string;
}

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    getAllCategories()
      .then(response => setCategories(response.data))
      .catch(() => setMessage('Failed to load categories.'));
  }, []);

  return (
    <div>
      <h1>Admin Categories Page</h1>

      {/* Виведення повідомлення про помилки */}
      {message && <p>{message}</p>}

      <h3>Categories List</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {category.name}
          </li>
        ))}
      </ul>

      <h3>Create a New Category</h3>
      {token ? (
        <CategoryForm token={token} />
      ) : (
        <p>Please log in to create categories.</p>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
