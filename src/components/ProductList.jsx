import React from 'react';
import '../styles/productList.scss';

const ProductList = ({ products }) => {
  return (
    <div className="product-cards">
      {products.length === 0 ? (
        <p>Нет продуктов для отображения</p>
      ) : (
        products.map(product => (
          <div key={product.id} className="product-card">
            {product.image_url ? (
              <img src={`http://localhost:5000${product.image_url}`} alt={product.name} />
            ) : (
              <p>No image available</p>
            )}
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <span>{product.price} руб.</span>
            <button>Подробнее</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
