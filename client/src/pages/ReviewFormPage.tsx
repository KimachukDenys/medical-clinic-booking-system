import React from 'react';
import { useParams } from 'react-router-dom';
import ReviewForm from '../components/review/ReviewForm';

interface ReviewFormPageProps {
  userId: number | null;
  token: string | null;
}

const ReviewFormPage: React.FC<ReviewFormPageProps> = ({ userId, token }) => {
  const { id } = useParams<{ id: string }>();

  if (!userId || !token) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-red-100 text-red-700 rounded shadow text-center font-semibold">
        Будь ласка, увійдіть, щоб залишити відгук.
      </div>
    );
  }

  if (!id) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-yellow-100 text-yellow-700 rounded shadow text-center font-medium">
        Невірний ідентифікатор бронювання.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">Залишити відгук</h2>
      <ReviewForm userId={userId} appointmentId={Number(id)} token={token} />
    </div>
  );
};

export default ReviewFormPage;
