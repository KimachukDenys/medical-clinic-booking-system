import React, { useState, useEffect } from 'react';
import { getAllCategories, updateCategory, deleteCategory } from '../../api/categoryApi';
import CategoryForm from '../../components/categories/CategoryForm';
import EditCategoryForm from '../../components/categories/EditCategoryForm';

interface Category {
  id: number;
  name: string;
}

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);

    loadCategories();
  }, []);

  const loadCategories = () => {
    getAllCategories()
      .then(res => setCategories(res.data))
      .catch(() => setMessage('Не вдалося завантажити категорії.'));
  };

  const handleUpdate = (id: number, newName: string) => {
    if (!token) return;
    updateCategory(id, newName, token)
      .then(() => {
        setMessage('Категорію оновлено.');
        setEditingCategoryId(null);
        loadCategories();
      })
      .catch(() => setMessage('Помилка при оновленні.'));
  };

  const handleDelete = (id: number) => {
    if (!token) return;
    if (window.confirm('Ви впевнені, що хочете видалити цю категорію?')) {
      deleteCategory(id, token)
        .then(() => {
          setMessage('Категорію видалено.');
          loadCategories();
        })
        .catch(() => setMessage('Помилка при видаленні.'));
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-3xl 2xl:text-4xl font-bold text-primary text-center mb-8">
        Адмін-панель категорій
      </h1>

      {message && (
        <div className="text-center text-accent font-semibold mb-6">{message}</div>
      )}

      <h2 className="text-xl font-semibold text-primary mb-4">Створити нову категорію</h2>

      {token ? (
        <div className="bg-white shadow-md border border-primary rounded-lg p-4">
          <CategoryForm token={token} />
        </div>
      ) : (
        <p className="text-red-500 font-medium">Увійдіть у систему для створення категорій.</p>
      )}

      <h2 className="text-xl font-semibold text-primary mb-4">Список категорій</h2>

      <ul className="space-y-4 mb-8">
        {categories.map((category) => (
          <li
            key={category.id}
            className="bg-white shadow-md border border-primary rounded-lg px-4 py-3 flex flex-col md:flex-row md:items-center justify-between"
          >
            {editingCategoryId === category.id ? (
              <EditCategoryForm
                id={category.id}
                currentName={category.name}
                onSave={(newName) => handleUpdate(category.id, newName)}
                onCancel={() => setEditingCategoryId(null)}
              />
            ) : (
              <>
                <span className="text-lg text-primary font-medium">{category.name}</span>
                {token && (
                  <div className="mt-2 md:mt-0 flex gap-3">
                    <button
                      onClick={() => setEditingCategoryId(category.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Редагувати
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Видалити
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCategoriesPage;
