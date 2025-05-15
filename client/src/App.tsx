import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/auth/RegisterForm';
import Login from './components/auth/LoginForm';
import ServicesPage from './pages/ServicesPage';
import AdminServicesPage from './pages/AdminServicesPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import DoctorListPage from './pages/DoctorListPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import CreateDoctorProfilePage from './pages/CreateDoctorProfilePage';
import EditServicePage from './pages/EditServicePage';
import AppointmentsPage from './pages/AppointmentsPage';
import UpdateAppointmentForm from './components/services/UpdateAppointmentForm'; 
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    id: number;
    role: 'admin' | 'doctor' | 'patient' | null;
    firstName: string;
    lastName: string;
  } | null>(null);

  function parseJwt(token: string) {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) throw new Error("Invalid token format");

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Помилка розшифровки токена:', e);
      return null;
    }
  }

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
      }
    } else {
      console.warn('Невалідний токен:', storedToken);
      localStorage.removeItem('token');
    }
  }, []);



  console.log(userInfo)
  const handleLogout = () => {
    setToken(null);
    setUserInfo(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div>
        <h1>Медична Клініка</h1>
        {!token && (
          <>
            <Register />
            <Login setToken={setToken} />
          </>
        )}
        <Navbar
          id={userInfo?.id}
          role={userInfo?.role ?? null}
          firstName={userInfo?.firstName}
          lastName={userInfo?.lastName}
          onLogout={handleLogout}
          isAuthenticated={!!token}
        />


        <Routes>
          <Route path="/services" element={<ServicesPage />} />

          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          <Route path="/doctors" element={<DoctorListPage />} />
          <Route path="/doctors/:doctorId" element={<DoctorProfilePage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointment/update/:id" element={<UpdateAppointmentForm />} />
          <Route path="/appointment/details/:id" element={<AppointmentDetailsPage />} />

          {userInfo?.role === 'doctor' && (
            <Route path="/doctor/profile/create" element={<CreateDoctorProfilePage />} />
          )}

          {userInfo?.role === 'admin' && (
            <>
              <Route path="/admin/services" element={<AdminServicesPage />} />
              <Route path="/admin/services/edit/:id" element={<EditServicePage />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
