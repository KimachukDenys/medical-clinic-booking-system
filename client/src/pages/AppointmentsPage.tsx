// src/pages/AppointmentsPage.tsx
import React from 'react';
import AppointmentsListForm from '../components/services/AppointmentsListForm';

const AppointmentsPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Бронювання</h1>
      <AppointmentsListForm />
    </div>
  );
};

export default AppointmentsPage;
