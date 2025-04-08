import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/korzina.scss';

const Korzina = () => {
  const { userId: contextUserId } = useUser();
  const [userId, setUserId] = useState(contextUserId || localStorage.getItem('userId'));
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUserIdLoaded, setIsUserIdLoaded] = useState(false);  // Состояние для проверки, что userId загрузился
  const navigate = useNavigate();

  // Когда userId изменяется, обновляем состояние
  useEffect(() => {
    console.log('userId из контекста:', contextUserId);
    console.log('userId из localStorage:', localStorage.getItem('userId'));
    console.log('Итоговый userId:', userId);

    if (userId) {
      setIsUserIdLoaded(true);
    }
  }, [userId, contextUserId]);

  // Дожидаемся загрузки userId перед запросом на сервер
  useEffect(() => {
    if (isUserIdLoaded) {
      fetchCartItems();
    }
  }, [isUserIdLoaded]);

  // Получение корзины
  const fetchCartItems = async () => {
    if (!userId) {
      setError('Пользователь не авторизован');
      setLoading(false);
      return;
    }

    console.log('Запрос на корзину для userId:', userId);

    try {
      const response = await axios.get(`http://localhost:5000/cart/${userId}`);
      console.log('Ответ от сервера с товарами в корзине:', response.data);
      setCartItems(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке корзины:', err);
      setError('Не удалось загрузить корзину');
      setLoading(false);
    }
  };

  // Удаление товара
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${userId}/${productId}`);
      setCartItems(cartItems.filter(item => item.product_id !== productId));
    } catch (err) {
      console.error('Ошибка при удалении товара:', err);
      setError('Не удалось удалить товар');
    }
  };

  // Изменение количества
  const updateQuantity = (productId, delta) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    navigate('/zamowienie');
  };

  return (
    <div className="korzina-container">
      <h2>🛒 Ваша корзина</h2>
      {loading && <p>Загрузка...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && cartItems.length === 0 ? (
        <p>В корзине нет товаров.</p>
      ) : (
        <div className="cart-list">
          {cartItems.map(item => (
            <div key={item.product_id} className="cart-card">
              <img
                src={item.image_url ? `http://localhost:5000${item.image_url}` : '/placeholder.jpg'}
                alt={item.name}
                className="product-image"
              />
              <div className="cart-info">
                <h3>{item.name}</h3>
                <p>{item.price} zl</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.product_id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product_id, 1)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.product_id)}>Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && cartItems.length > 0 && (
        <div className="cart-summary">
          <h3>Общая сумма: {totalPrice} zl</h3>
          <h4>Общее количество товаров: {totalItems}</h4>
          <button className="checkout-btn" onClick={handleCheckout}>Оформить заказ</button>
        </div>
      )}
    </div>
  );
};

export default Korzina;
