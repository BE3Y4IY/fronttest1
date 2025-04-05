import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext'; // Импортируем хук для работы с пользователем
import '../styles/main.scss'; // Подключаем стили

const Main = () => {
  const { userName, userId } = useUser(); // Получаем имя пользователя из контекста
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]); // Массив для товаров в корзине

  // Загружаем продукты с бэкенда
  useEffect(() => {
    axios.get('http://localhost:5000/cake')  // Убедитесь, что ваш сервер работает на этом адресе
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Ошибка при загрузке товаров');
        setLoading(false);
      });
  }, []);

  // Загружаем корзину после добавления товара
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/cart/${userId}`)
        .then(response => {
          setCart(response.data); // Обновляем корзину с сервера
        })
        .catch(error => console.log(error));
    }
  }, [userId]);

  // Обработчик для добавления товара в корзину
  const addToCart = async (product) => {
    if (!userId) {
      alert('Пожалуйста, войдите в систему, чтобы добавить товар в корзину');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Получаем токен пользователя
      const response = await axios.post(
        'http://localhost:5000/cart', 
        { productId: product.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCart([...cart, response.data.product]); // Обновляем корзину локально
        alert('Товар добавлен в корзину');
      }
    } catch (error) {
      console.error('Ошибка при добавлении товара в корзину', error);
    }
  };

  return (
    <div className="main">
      <h1>Привет, {userName ? userName : 'гость'}!</h1> {/* Приветствие с именем пользователя */}
      
      {loading && <p>Загрузка...</p>}
      {error && <p>{error}</p>}

      <ProductList 
        products={products} 
        addToCart={addToCart} // Передаем обработчик добавления в корзину
      />

      <Link to="/cart">
        <button className="go-to-cart">Перейти в корзину</button>
      </Link>
    </div>
  );
};

export default Main;
