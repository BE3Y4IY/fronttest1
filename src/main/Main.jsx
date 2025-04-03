import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import { Link } from 'react-router-dom';
import '../styles/main.scss';  // Корректно


const Main = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(response => setProducts(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div className="main-container">
      <nav className="navbar">
        <Link to="/add-product" className="navbar-link">Add Product</Link>
      </nav>
      <div className="product-list">
        <h2>Product List</h2>
        <ProductList products={products} />
      </div>
    </div>
  );
};

export default Main;
