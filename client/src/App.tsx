import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/user/AuthPage';
import ServicesPage from './pages/service/ServicesPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import ServiceDetailsPage from './pages/service/ServiceDetailsPage';
import DoctorListPage from './pages/doctor/DoctorListPage';
import DoctorProfilePage from './pages/doctor/DoctorProfilePage';
import CreateDoctorProfilePage from './pages/doctor/CreateDoctorProfilePage';
import EditServicePage from './pages/service/EditServicePage';
import AppointmentsPage from './pages/appointment/AppointmentsPage';
import UpdateAppointmentForm from './components/services/UpdateAppointmentForm'; 
import AppointmentDetailsPage from './pages/appointment/AppointmentDetailsPage';
import UserProfilePage from './pages/user/UserProfilePage';
import EditUserProfilePage from './pages/user/EditUserProfilePage';
import ReviewFormPage from './pages/ReviewFormPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { parseJwt } from './utils/jwt';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    id: number;
    role: 'admin' | 'doctor' | 'patient' | null;
    firstName: string;
    lastName: string;
  } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken && storedToken.split('.').length === 3) {
      setToken(storedToken);
      const payload = parseJwt(storedToken);
      if (payload) {
        setUserInfo({
          id: payload.id,
          role: payload.role,
          firstName: payload.firstName,
          lastName: payload.lastName,
        });
      } else {
        localStorage.removeItem('token');
      }
    } else {
      localStorage.removeItem('token');
      setToken(null);
      setUserInfo(null);
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    setUserInfo(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div>
        <Navbar
          id={userInfo?.id}
          role={userInfo?.role ?? null}
          firstName={userInfo?.firstName}
          lastName={userInfo?.lastName}
          onLogout={handleLogout}
          isAuthenticated={!!token}
        />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage setToken={setToken} setUserInfo={setUserInfo} />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          <Route path="/doctors" element={<DoctorListPage />} />
          <Route path="/doctors/:doctorId" element={<DoctorProfilePage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointment/update/:id" element={<UpdateAppointmentForm />} />
          <Route path="/appointment/details/:id" element={<AppointmentDetailsPage />} />
          <Route path="/user/profile/:id" element={<UserProfilePage />} />
          <Route path="/user/profile/edit/:id" element={<EditUserProfilePage />} />
          <Route path="/review/:id" element={<ReviewFormPage userId={userInfo?.id ?? null} token={localStorage.getItem('token')} />} />
          {/* Роут для створення профілю лікаря, якщо авторизований як doctor */}
          {userInfo?.role === 'doctor' && (
            <Route path="/doctor/profile/create" element={<CreateDoctorProfilePage />} />
          )}


          <Route path="/doctor/profile" element={<DoctorProfilePage />} />


          {/* Адмін-панель, якщо роль admin */}
          {userInfo?.role === 'admin' && (
            <>
              <Route path="/admin/services" element={<AdminServicesPage />} />
              <Route path="/admin/services/edit/:id" element={<EditServicePage />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            </>
          )}
        </Routes>

        <Footer role={userInfo?.role ?? null} isAuthenticated={!!token} />
      </div>
    </Router>
  );
};

export default App;
