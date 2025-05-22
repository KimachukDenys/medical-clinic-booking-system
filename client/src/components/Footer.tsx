import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  role: 'admin' | 'doctor' | 'patient' | null;
  isAuthenticated: boolean;
}

const Footer: React.FC<Props> = ({ role, isAuthenticated }) => {
  return (
    <footer
      className="bg-primary text-background mt-10"
      style={{ paddingLeft: '150px', paddingRight: '150px', paddingTop: '40px', paddingBottom: '40px' }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-roboto text-[28px] font-bold">Avicenna</h2>
          <p className="text-sm mt-2 max-w-[250px]">
            Турбота про ваше здоров'я — наш пріоритет.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold text-lg mb-1">Навігація</h3>
          <Link to="/services" className="block hover:underline">
            Послуги
          </Link>
          <Link to="/doctors" className="block hover:underline">
            Лікарі
          </Link>
          {isAuthenticated && (
            <Link to="/appointments" className="block hover:underline">
              Записи
            </Link>
          )}
          {role === 'doctor' && (
            <Link to="/doctor/profile" className="block hover:underline">
              Мій профіль
            </Link>
          )}
          {role === 'admin' && (
            <>
              <Link to="/admin/services" className="block hover:underline">
                Адмін: Послуги
              </Link>
              <Link to="/admin/categories" className="block hover:underline">
                Адмін: Категорії
              </Link>
            </>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold text-lg mb-1">Контакти</h3>
          <p>Телефон: +380 99 123 45 67</p>
          <p>Email: info@avicenna.ua</p>
          <p>Адреса: вул. Прикладна, 10, Київ</p>
        </div>
      </div>

      <div className="border-t border-background/20 mt-10 pt-4 text-sm text-center opacity-70">
        © {new Date().getFullYear()} Avicenna. Усі права захищені.
      </div>
    </footer>
  );
};

export default Footer;
