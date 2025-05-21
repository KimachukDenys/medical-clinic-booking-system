import React, { useCallback, useEffect, useState } from 'react';
import {
  getUserReviews,
  updateReview,
  deleteReview,
} from '../../api/reviewApi';

interface Review {
  id: number;
  rating: number;
  comment: string;
  appointment: {
    id: number;
    date: string;
    Service?: { title: string };
    doctor?: {firstName: string, lastName: string,}
  };
}

interface Props {
  userId: number;
  token: string;
}

const UserReviewsForm: React.FC<Props> = ({ userId, token }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [msg, setMsg] = useState('');

  // Очистка повідомлення через 3 сек
  useEffect(() => {
    if (!msg) return;
    const timer = setTimeout(() => setMsg(''), 3000);
    return () => clearTimeout(timer);
  }, [msg]);

  // Стабільне завантаження відгуків
  const load = useCallback(async () => {
    try {
      const data = await getUserReviews(userId, token);
      setReviews(data);
    } catch {
      setMsg('Не вдалося завантажити відгуки.');
    }
  }, [userId, token]);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (r: Review) => {
    setEditingId(r.id);
    setForm({ rating: r.rating, comment: r.comment ?? '' });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await updateReview(editingId, { userId, ...form }, token);
      setMsg('Відгук оновлено');
      setEditingId(null);
      load();
    } catch {
      setMsg('Помилка при оновленні');
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Видалити відгук?')) return;
    try {
      await deleteReview(id, token);
      setMsg('Відгук видалено');
      load();
    } catch {
      setMsg('Помилка при видаленні');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold text-primary text-center">Мої відгуки</h2>

      {msg && <p className="text-center text-green-600">{msg}</p>}
      {reviews.length === 0 && !msg && (
        <p className="text-center">Ви ще не залишали відгуків.</p>
      )}

      {reviews.map(r => (
        <div
          key={r.id}
          className="border border-primary rounded-md p-4 space-y-2 relative"
        >
          <p className="font-semibold">
            Послуга:&nbsp;
            {r.appointment.Service?.title ?? '—'} | Дата запису:&nbsp;
            {new Date(r.appointment.date).toLocaleDateString()}
          </p>
          <p>
            Лікар: {r.appointment.doctor?.firstName} {r.appointment.doctor?.lastName}
          </p>

          {editingId === r.id ? (
            <>
              <label className="block">
                <span className="text-sm">Оцінка:</span>
                <select
                  value={form.rating}
                  onChange={e =>
                    setForm({ ...form, rating: Number(e.target.value) })
                  }
                  className="border rounded w-full p-2 mt-1"
                >
                  {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm">Коментар:</span>
                <textarea
                  rows={3}
                  value={form.comment}
                  onChange={e =>
                    setForm({ ...form, comment: e.target.value })
                  }
                  className="border rounded w-full p-2 mt-1 resize-y"
                />
              </label>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={saveEdit}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800"
                >
                  Зберегти
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
                >
                  Скасувати
                </button>
              </div>
            </>
          ) : (
            <>
              <p>Оцінка: {r.rating}</p>
              <p>{r.comment}</p>

              <div className="absolute top-2 right-2 space-x-2">
                <button
                  onClick={() => startEdit(r)}
                  className="text-blue-600 hover:underline"
                >
                  Редагувати
                </button>
                <button
                  onClick={() => remove(r.id)}
                  className="text-red-600 hover:underline"
                >
                  Видалити
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserReviewsForm;
