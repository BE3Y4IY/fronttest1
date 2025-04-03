import React, { useState } from 'react';
import axios from 'axios';
import '../styles/addproduct.scss';  // Корректно

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = { name, price };

    axios.post('http://localhost:5000/products', newProduct)
      .then(response => {
        alert('Product added successfully');
        setName('');
        setPrice('');
      })
      .catch(error => {
        console.log(error);
        alert('Error adding product');
      });
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
