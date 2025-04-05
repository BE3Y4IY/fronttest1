import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './main/Main';
import AddProduct from './components/AddProduct';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import { UserProvider } from './UserContext'; // Импортируем UserProvider

const App = () => {
  return (
    <UserProvider> {/* Оборачиваем приложение в UserProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
