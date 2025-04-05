import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Создание контекста
const UserContext = createContext();

// Провайдер для контекста
export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Декодируем токен
        setUserName(decodedToken.userName); // Устанавливаем имя пользователя
      } catch (error) {
        console.error('Invalid or expired token');
        setUserName(null); // Если токен некорректный или истек, сбрасываем имя пользователя
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

// Хук для использования контекста
export const useUser = () => {
  return useContext(UserContext);
};
