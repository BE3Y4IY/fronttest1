// src/main/Main.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import { Link } from 'react-router-dom';
import '../styles/main.scss'; // Подключаем стили

const Main = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Загружаем продукты с бэкенда
  useEffect(() => {
    axios.get('http://localhost:5000/cake')  // Убедись, что сервер на этом порту
      .then(response => {
        setProducts(response.data); // Сохраняем полученные данные
        setLoading(false);           // Прекращаем загрузку
      })
      .catch(error => {
        setError('Не удалось загрузить продукты');
        setLoading(false);           // Прекращаем загрузку даже в случае ошибки
        console.log(error);          // Логируем ошибку
      });
  }, []);

  return (
    <div className="main-container">
      <nav className="navbar">
        <Link to="/add-product" className="navbar-link">Добавить продукт</Link>
      </nav>
      <div className="product-list">
        <h2>Список продуктов</h2>
        {loading && <p>Загрузка...</p>}
        {error && <p>{error}</p>}
        <ProductList products={products} /> {/* Передаем данные в компонент ProductList */}
      </div>
    </div>
  );
};

export default Main;
