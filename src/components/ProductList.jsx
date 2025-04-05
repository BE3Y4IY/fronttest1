import React, { useState } from 'react';
import Modal from './Modal'; // Импортируем модальное окно
import '../styles/productList.scss'; // Подключаем стили

const ProductList = ({ products }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

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
            <p>{product.price} руб.</p>

            {/* Кнопка для показа подробностей */}
            <button onClick={() => openModal(product)}>Подробнее</button>
          </div>
        ))
      )}

      {/* Если модальное окно открыто, показываем его */}
      {isModalOpen && selectedProduct && (
        <Modal product={selectedProduct} closeModal={closeModal} />
      )}
    </div>
  );
};

export default ProductList;
