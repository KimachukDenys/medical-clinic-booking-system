import React from 'react';
import Login from '../../components/auth/LoginForm';
import Register from '../../components/auth/RegisterForm';

interface UserInfo {
  id: number;
  role: 'admin' | 'doctor' | 'patient' | null;
  firstName: string;
  lastName: string;
}

interface AuthPageProps {
  setToken: (token: string | null) => void;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}

const AuthPage: React.FC<AuthPageProps> = ({ setToken, setUserInfo }) => {

  const parseJwt = (token: string): UserInfo | null => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  // Функція для оновлення стану після логіну
  const handleLoginSuccess = (token: string) => {
    setToken(token);
    localStorage.setItem('token', token);
    const userInfo = parseJwt(token);
    if (userInfo) setUserInfo(userInfo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-4xl w-full bg-secondary shadow-md rounded-lg flex flex-col md:flex-row overflow-hidden">
        {/* Login */}
        <div className="md:w-1/2 p-8 border-r border-gray-200">
          <Login setToken={handleLoginSuccess} />
        </div>

        {/* Register */}
        <div className="md:w-1/2 p-8">
          <Register />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
