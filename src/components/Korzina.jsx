import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import axios from 'axios';
import '../styles/korzina.scss'; // Стили отдельно для красоты

const Korzina = () => {
  const { userId } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Получение корзины
  const fetchCartItems = async () => {
    if (!userId) {
      setError('Пользователь не авторизован');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/cart/${userId}`);
      setCartItems(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке корзины:', err);
      setError('Не удалось загрузить корзину');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [userId]);

  // Удаление товара
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${userId}/${productId}`);
      setCartItems(cartItems.filter(item => item.product_id !== productId));
    } catch (err) {
      console.error('Ошибка при удалении товара:', err);
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

  // Считаем общее количество товаров
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

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
                <p>{item.price} ₽</p>
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
          <h3>Общая сумма: {totalPrice} ₽</h3>
          <h4>Общее количество товаров: {totalItems}</h4> {/* Отображаем количество товаров */}
          <button className="checkout-btn">Оформить заказ</button>
        </div>
      )}
    </div>
  );
};

export default Korzina;