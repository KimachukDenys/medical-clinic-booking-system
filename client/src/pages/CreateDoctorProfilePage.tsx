import React from 'react';
import CreateDoctorProfileForm from '../components/doctors/CreateDoctorProfileForm'; // або ../pages, якщо там лежить

const CreateDoctorProfilePage = () => {
  return (
    <div>
      <h2>Створення профілю лікаря</h2>
      <CreateDoctorProfileForm />
    </div>
  );
};

export default CreateDoctorProfilePage;
