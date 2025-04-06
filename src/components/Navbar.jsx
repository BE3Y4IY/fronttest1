import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaShoppingCart } from 'react-icons/fa'; // Иконка корзины
import { useUser } from '../UserContext'; // Импортируем хук контекста

import '../styles/navbar.scss';

const Navbar = () => {
  const { userName, userId, setUserName, setUserId } = useUser(); // Должен работать, если контекст настроен верно
  const [cartItemCount, setCartItemCount] = useState(0); // Для отображения количества товаров в корзине

  // Функция для обновления имени пользователя и id
  const updateUserName = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.userName);
        setUserId(decodedToken.userId);  // Обновляем userId
      } catch (error) {
        console.error('Invalid or expired token');
        setUserName(null);
        setUserId(null);  // Если токен неправильный, сбрасываем userId
      }
    } else {
      setUserName(null);
      setUserId(null);  // Если токен отсутствует, сбрасываем userId
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
  }, [setUserName, setUserId]);

  // Проверка корзины, если имя пользователя изменилось
  useEffect(() => {
    if (userName) {
      const savedCart = JSON.parse(localStorage.getItem(`cart_${userName}`)) || [];
      setCartItemCount(savedCart.length); // Обновляем количество товаров в корзине
    } else {
      setCartItemCount(0); // Если нет пользователя, корзина пуста
    }
  }, [userName]); // Этот эффект будет срабатывать каждый раз, когда меняется userName

  // Функция для выхода из системы
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserName(null);
    setUserId(null);  // При выходе из системы очищаем и userId
  };

  return (
    <nav className="navbar">
      {/* Оборачиваем название сайта в Link для перехода на главную */}
      <Link to="/" className="navbar-logo">
        <h1>Product Shop</h1>
      </Link>
      <div className="navbar-links">
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
        <Link to="/korzina" className="navbar-link">
          <FaShoppingCart size={24} /> ({cartItemCount})
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
