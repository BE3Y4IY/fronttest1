import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import axios from 'axios';
import '../styles/korzina.scss'; // Стили подключим отдельно

const Korzina = () => {
  const { userId } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setError('Пользователь не авторизован');
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/cart/${userId}`)
      .then(response => {
        setCartItems(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Ошибка при загрузке корзины');
        setLoading(false);
      });
  }, [userId]);

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;

    axios.put(`http://localhost:5000/cart/${userId}/${productId}`, { quantity: newQty })
      .then(() => {
        setCartItems(prev =>
          prev.map(item =>
            item.product_id === productId ? { ...item, quantity: newQty } : item
          )
        );
      })
      .catch(() => alert('Ошибка при обновлении количества'));
  };

  const removeFromCart = (productId) => {
    axios.delete(`http://localhost:5000/cart/${userId}/${productId}`)
      .then(() => {
        setCartItems(prev => prev.filter(item => item.product_id !== productId));
      })
      .catch(() => alert('Ошибка при удалении товара'));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="korzina-wrapper">
      <h2>🛒 Ваша корзина</h2>

      {loading && <p>Загрузка...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && cartItems.length === 0 ? (
        <p>В корзине нет товаров.</p>
      ) : (
        <div className="cart-grid">
          {cartItems.map(item => (
            <div key={item.product_id} className="cart-card">
              <div className="cart-info">
                <h4>{item.name}</h4>
                <p>{item.price} ₽</p>
                <div className="qty-controls">
                  <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>-</button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.product_id, parseInt(e.target.value) || 1)
                    }
                    min={1}
                  />
                  <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(item.product_id)}>Удалить</button>
            </div>
          ))}
        </div>
      )}

      {!loading && cartItems.length > 0 && (
        <div className="total-block">
          <h3>Общая сумма: {totalPrice} ₽</h3>
          <button className="checkout-btn">Оформить заказ</button>
        </div>
      )}
    </div>
  );
};

export default Korzina;
