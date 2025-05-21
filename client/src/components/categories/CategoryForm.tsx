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
    <form 
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-2"
    >
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Назва категорії"
        className="border-2 border-primary text-primary rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent w-full sm:w-auto"
      />
      <button type="submit"
        className="bg-primary text-background font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Створити категорію
      </button>
    </form>
  );
};

export default CategoryForm;
