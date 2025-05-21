import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Props {
  id?: number;
  role: 'admin' | 'doctor' | 'patient' | null;
  onLogout: () => void;
  isAuthenticated: boolean;
  firstName?: string;
  lastName?: string;
}

const Navbar: React.FC<Props> = ({ id, role, onLogout, isAuthenticated, firstName, lastName }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/'); // Перекидає на головну після виходу
  };

  return (
    <nav
      className="bg-primary text-background flex items-center justify-between"
      style={{ paddingLeft: '150px', paddingRight: '150px', height: '105px' }}
    >
      <div>
        <Link to="/" className="font-roboto text-[34px] text-background font-bold">
          Avicenna
        </Link>
      </div>
      <div
        className="space-x-7 font-medium text-lg flex tracking-wide"
        style={{ marginLeft: '-75px' }}
      >
        <Link to="/services" className="hover:underline">
          Послуги
        </Link>
        <Link to="/doctors" className="hover:underline">
          Лікарі
        </Link>

        {role === 'doctor' && (
          <Link to="/doctor/profile" className="hover:underline">
            Мій профіль
          </Link>
        )}

        {role === 'admin' && (
          <>
            <Link to="/admin/services" className="hover:underline">
              Адмін: Послуги
            </Link>
            <Link to="/admin/categories" className="hover:underline">
              Адмін: Категорії
            </Link>
          </>
        )}

        {isAuthenticated && (
          <Link to="/appointments" className="hover:underline">
            Записи
          </Link>
        )}
      </div>

      <div className="space-x-4 flex items-center">
        {isAuthenticated ? (
          <>
            <Link to={`/user/profile/${id}`} className="font-semibold hover:underline">
              {firstName} {lastName}
            </Link>
            <button
              onClick={handleLogoutClick}
              className="bg-primary border-[1px] border-[#00165F] drop-shadow-md hover:bg-blue-800 px-4 py-2 rounded-md font-semibold transition"
            >
              Вийти
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="bg-primary border-[1px] border-[#00165F] drop-shadow-md hover:bg-blue-800 px-4 py-2 rounded-md font-semibold transition"
          >
            Вхід та Реєстрація
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
