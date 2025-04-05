import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Правильный импорт

import '../styles/navbar.scss';

const Navbar = () => {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Берем токен из localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Декодируем токен
        setUserName(decodedToken.userName); // Получаем имя пользователя из токена (если оно там есть)
      } catch (error) {
        console.error('Token is invalid or expired');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Удаляем токен при выходе
    setUserName(null); // Сброс имени пользователя
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
