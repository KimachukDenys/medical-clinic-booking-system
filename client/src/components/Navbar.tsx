import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  id?: number;
  role: 'admin' | 'doctor' | 'patient' | null;
  onLogout: () => void;
  isAuthenticated: boolean;
  firstName?: string;
  lastName?: string;
}

const Navbar: React.FC<Props> = ({ id, role, onLogout, isAuthenticated, firstName, lastName }) => {
  return (
    <nav style={{ marginBottom: '1rem' }}>
      <Link to="/services">Послуги</Link> |{' '}
      <Link to="/doctors">Лікарі</Link>

      {role === 'doctor' && (
        <>
          {' '}| <Link to={`/doctors/${id}`}>Мій профіль</Link>
        </>
      )}

      {role === 'admin' && (
        <>
          {' '}| <Link to="/admin/services">Адмін: Послуги</Link>
          {' '}| <Link to="/admin/categories">Адмін: Категорії</Link>
        </>
      )}

      {isAuthenticated ? (
        <>
          {' '}| <Link to="/appointments/">Записи</Link>
          {' '}| <Link to={`/user/profile/${id}`}>{firstName} {lastName}</Link>
          {' '}| <button onClick={onLogout}>Вийти</button>
        </>
      ) : (
        <>
          {' '}| <Link to="/register">Реєстрація</Link>
          {' '}| <Link to="/login">Вхід</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
