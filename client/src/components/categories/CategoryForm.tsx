// src/components/categories/CategoryForm.tsx
import { useState } from 'react';
import { createCategory } from '../../api/categoryApi';

const CategoryForm = ({ token }: { token: string }) => {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory({ name }, token);
      alert('Категорію створено!');
      setName(''); // Очищаємо форму після успішного створення
    } catch (error) {
      alert('Помилка при створенні категорії');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Назва категорії"
      />
      <button type="submit">Створити категорію</button>
    </form>
  );
};

export default CategoryForm;
