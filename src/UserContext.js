// src/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Для декодирования JWT

// Создаём контекст
const UserContext = createContext();

// Хук для использования контекста
export const useUser = () => useContext(UserContext);

// Компонент провайдер
export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);

  // Эта функция будет вызываться для обновления информации о пользователе
  const updateUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.userName);
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error('Invalid or expired token');
        setUserName(null);
        setUserId(null);
      }
    } else {
      setUserName(null);
      setUserId(null);
    }
  };

  // Используем useEffect для первоначальной загрузки данных
  useEffect(() => {
    updateUserFromToken();
  }, []); // Запустится только один раз при монтировании

  return (
    <UserContext.Provider value={{ userName, userId, setUserName, setUserId, updateUserFromToken }}>
      {children}
    </UserContext.Provider>
  );
};
