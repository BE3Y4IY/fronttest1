import React, { createContext, useContext, useState } from 'react';

// Создаём контекст
const UserContext = createContext();

// Хук для использования контекста
export const useUser = () => useContext(UserContext);

// Компонент провайдер
export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);

  // Возвращаем провайдер с состоянием
  return (
    <UserContext.Provider value={{ userName, userId, setUserName, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
