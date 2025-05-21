// src/components/categories/EditCategoryForm.tsx
import React, { useState } from 'react';

interface Props {
  id: number;
  currentName: string;
  onSave: (newName: string) => void;
  onCancel: () => void;
}

const EditCategoryForm: React.FC<Props> = ({ id, currentName, onSave, onCancel }) => {
  const [name, setName] = useState(currentName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-2"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Назва категорії"
        className="border-2 border-primary text-primary rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent w-full sm:w-auto"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-primary text-background font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Зберегти
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-errorColor text-background font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Скасувати
        </button>
      </div>
    </form>
  );
};

export default EditCategoryForm;
