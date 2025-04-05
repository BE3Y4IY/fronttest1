import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Правильно

import { useUser } from '../UserContext'; // Импортируем хук контекста

import '../styles/navbar.scss';

const Navbar = () => {
  const { userName, setUserName } = useUser();

  // Функция для обновления имени пользователя
  const updateUserName = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Декодируем токен
        setUserName(decodedToken.userName);
      } catch (error) {
        console.error('Invalid or expired token');
        setUserName(null);
      }
    } else {
      setUserName(null);
    }
  };

  useEffect(() => {
    updateUserName();

    const handleStorageChange = () => {
      updateUserName();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setUserName]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserName(null); // Обновляем контекст после выхода
  };

  return (
    <nav className="navbar">
      <h1>Product Shop</h1>
      <div>
        {userName ? (
          <div>
            <span>Welcome, {userName}!</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Zarejestruj się</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
