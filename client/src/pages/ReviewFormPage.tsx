import React from 'react';
import { useParams } from 'react-router-dom';
import ReviewForm from '../components/review/ReviewForm'; // Компонент з формою

interface ReviewFormPageProps {
  userId: number | null;
}

const ReviewFormPage: React.FC<ReviewFormPageProps> = ({ userId }) =>  {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h2>Залишити відгук</h2>
      <ReviewForm id={Number(userId)} appointmentId={Number(id)} />
    </div>
  );
};

export default ReviewFormPage;
