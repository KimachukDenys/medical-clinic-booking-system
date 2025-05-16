import React, { useState } from 'react';
import { createReview } from '../../api/reviewApi';

interface Props {
  id?: number;
  appointmentId: number;
}

const ReviewForm: React.FC<Props> = ({ id, appointmentId }) => {
  const userId = id || 0; // Використовуємо id, якщо він переданий, інакше 0
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage('Будь ласка, увійдіть');
      return;
    }

    try {
      await createReview({ rating, comment, appointmentId, userId }, token);
      setMessage('Відгук успішно надіслано!');
    } catch (err) {
      console.error(err);
      setMessage('Помилка при надсиланні відгуку');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Оцінка:
        <input type="number" min="1" max="5" value={rating} onChange={e => setRating(Number(e.target.value))} />
      </label>
      <br />
      <label>
        Коментар:
        <textarea value={comment} onChange={e => setComment(e.target.value)} />
      </label>
      <br />
      <button type="submit">Надіслати відгук</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ReviewForm;
