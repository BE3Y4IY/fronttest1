import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Правильно

import { useUser } from '../UserContext'; // Импортируем хук контекста

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUserName } = useUser(); // Получаем setUserName из контекста

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem('token', token);

        // Декодируем токен и обновляем контекст
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.userName); // Обновляем состояние с именем пользователя

        navigate('/'); // Перенаправляем на главную страницу
      } else {
        setError('Ошибка при входе');
      }
    } catch (err) {
      setError('Произошла ошибка при входе');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
