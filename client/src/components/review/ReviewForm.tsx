import React, {  useState } from 'react';
import { createReview  } from '../../api/reviewApi';

interface ReviewFormProps {
  appointmentId: number;
  userId: number;
  token: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ appointmentId, userId, token }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alreadyReviewed) return;

    try {
      await createReview({ appointmentId, userId, rating, comment }, token);
      setMessage('Дякуємо за ваш відгук!');
      setAlreadyReviewed(true);
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Сталася помилка при додаванні відгуку.');
    }
  };

  if (alreadyReviewed) {
    return (
      <div className="p-4 bg-green-100 text-green-800 rounded">
        Ви вже залишили відгук на це бронювання. Дякуємо!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4">
      <div>
        <label className="block font-semibold mb-1">Рейтинг:</label>
        <select
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          className="w-full border rounded p-2"
        >
          {[5,4,3,2,1].map(num => (
            <option key={num} value={num}>{num} зірок</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Коментар:</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={4}
          className="w-full border rounded p-2"
          required
          minLength={5}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Залишити відгук
      </button>

      {message && (
        <p className="mt-2 text-center text-red-600">{message}</p>
      )}
    </form>
  );
};

export default ReviewForm;
