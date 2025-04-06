import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Используем Link для маршрутизации
import { jwtDecode } from 'jwt-decode';
import { FaShoppingCart } from 'react-icons/fa'; // Иконка корзины
import { useUser } from '../UserContext'; // Импортируем хук контекста
import axios from 'axios'; // Для получения данных о корзине

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

  // Получение количества товаров в корзине для текущего пользователя
  const fetchCartItemCount = async () => {
    if (userId) {
      try {
        const response = await axios.get(`http://localhost:5000/cart/${userId}`);
        const totalItemCount = response.data.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(totalItemCount); // Обновляем количество товаров в корзине
      } catch (error) {
        console.error('Ошибка при получении корзины:', error);
        setCartItemCount(0); // В случае ошибки, корзина пуста
      }
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

  // Запрашиваем количество товаров в корзине после авторизации или обновления userId
  useEffect(() => {
    if (userId) {
      fetchCartItemCount();
    }
  }, [userId]); // Этот эффект будет срабатывать при изменении userId

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
            {/* Добавляем ссылку на страницу добавления товара */}
            <Link to="/add-product" className="navbar-link">Add Product</Link> {/* Ссылка на страницу добавления товара */}
          </div>
        ) : (
          <div>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Zarejestruj się</Link>
          </div>
        )}
        <Link to="/korzina" className="navbar-link">
          <FaShoppingCart size={24} /> ({cartItemCount}) {/* Показываем количество товаров */}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
