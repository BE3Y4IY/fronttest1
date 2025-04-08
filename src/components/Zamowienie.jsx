import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import axios from 'axios';
import '../styles/zamowienie.scss'; // Стили для страницы оформления заказа

const Zamowienie = () => {
  const { userId } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState({
    address: '',
    paymentMethod: 'card'
  });

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

  // Получение информации о пользователе (включая адрес)
  const fetchUserAddress = async () => {
    if (!userId) {
      setError('Пользователь не авторизован');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/user-info/${userId}`);
      if (response.data && response.data.address) {
        setOrderDetails((prevDetails) => ({
          ...prevDetails,
          address: response.data.address // Подставляем адрес из базы данных
        }));
      }
    } catch (err) {
      console.error('Ошибка при получении адреса:', err);
      setError('Не удалось получить адрес доставки');
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchUserAddress();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/order', {
        userId,
        cartItems,
        orderDetails
      });
      alert('Заказ успешно оформлен!');
    } catch (err) {
      console.error('Ошибка при оформлении заказа:', err);
      setError('Не удалось оформить заказ');
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="zamowienie-container">
      <h2>Оформление заказа</h2>

      {loading && <p>Загрузка...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && cartItems.length === 0 ? (
        <p>В корзине нет товаров для оформления.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="order-summary">
            <h3>Товары в заказе:</h3>
            {cartItems.map(item => (
              <div key={item.product_id}>
                <p>{item.name} - {item.price} zl x {item.quantity}</p>
              </div>
            ))}
            <p><strong>Общая сумма: {totalPrice} zl</strong></p>
          </div>

          <div className="order-details">
            <label htmlFor="address">Адрес доставки:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={orderDetails.address}
              onChange={handleChange}
              required
            />
            <label>Способ оплаты:</label>
            <select
              name="paymentMethod"
              value={orderDetails.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="card">Картой</option>
              <option value="cash">Наличными</option>
            </select>
          </div>

          <button type="submit">Подтвердить заказ</button>
        </form>
      )}
    </div>
  );
};

export default Zamowienie;
