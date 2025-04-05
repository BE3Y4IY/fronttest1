import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';  // Для получения информации о текущем пользователе
import axios from 'axios';  // Для отправки запросов на сервер

const Korzina = () => {
  const { userName, userId } = useUser();  // Получаем id и имя пользователя из контекста
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);  // Для состояния загрузки
  const [error, setError] = useState(''); // Для состояния ошибки

  // Функция для получения корзины
  const fetchCartItems = () => {
    if (!userId) {
      console.log('Нет userId');
      setError('Пользователь не авторизован');
      setLoading(false);
      return;
    }

    // Запрашиваем товары из корзины для текущего пользователя
    axios.get(`http://localhost:5000/cart/${userId}`)
      .then(response => {
        console.log('Ответ от сервера:', response.data);
        setCartItems(response.data);
        setLoading(false);  // Обновляем состояние загрузки
      })
      .catch(error => {
        console.log('Ошибка при запросе корзины:', error);
        setError('Не удалось загрузить товары из корзины');
        setLoading(false);  // Обновляем состояние загрузки даже при ошибке
      });
  };

  // useEffect для загрузки корзины, если пользователь авторизован
  useEffect(() => {
    fetchCartItems();
  }, [userId]);  // Зависит от userId, если он меняется, выполняется снова

  // Функция для удаления товара из корзины
  const removeFromCart = (productId) => {
    axios.delete(`http://localhost:5000/cart/${userId}/${productId}`)
      .then(() => {
        // Удаляем товар из корзины локально
        setCartItems(cartItems.filter(item => item.product_id !== productId));
      })
      .catch(error => console.log('Ошибка при удалении товара:', error));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // При изменении состояния userId или userName, всегда проверяем и обновляем корзину
  useEffect(() => {
    if (userId) {
      // Если есть userId, снова подгружаем корзину
      fetchCartItems();
    }
  }, [userId]);

  return (
    <div className="korzina-container">
      <h2>Ваша корзина</h2>
      {loading && <p>Загрузка...</p>}
      {error && <p>{error}</p>}  {/* Показать ошибку, если есть */}

      {cartItems.length === 0 && !loading ? (
        <p>В корзине нет товаров.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map(item => (
              <li key={item.product_id}>
                <span>{item.name}</span>
                <span>{item.price} ₽</span>
                <span>Количество: {item.quantity}</span>
                <button onClick={() => removeFromCart(item.product_id)}>Удалить</button>
              </li>
            ))}
          </ul>
          <div>
            <h3>Общая сумма: {totalPrice} ₽</h3>
            <button>Оформить заказ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Korzina;
