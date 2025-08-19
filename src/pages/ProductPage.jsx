import React, { useState, useCallback, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 5;
  const navigate = useNavigate();

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const getProducts = useCallback(async () => {
    try {
      const productData = await ApiService.getAllProducts();
      const productList = productData.products || productData;

      setTotalPages(Math.ceil(productList.length / itemsPerPage));
      setProducts(
        productList.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      );
    } catch (error) {
      showMessage(
        error.response?.data.message || "Could not retrieve products: " + error
      );
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleDeleteProduct = async (productId) => {
    try {
      if (window.confirm("Are you sure you want to delete this product?")) {
        await ApiService.deleteProduct(productId);
        showMessage("Product deleted successfully");

        if (products.length === 1 && currentPage > 1) {
          setCurrentPage((p) => p - 1);
        } else {
          getProducts();
        }
      }
    } catch (error) {
      showMessage(
        error.response?.data.message || "Could not delete product: " + error
      );
    }
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className="product-page">
        <div className="product-header">
          <h1>Products</h1>
          <button onClick={() => navigate("/add-product")}>Add Product</button>
        </div>

        {products.length > 0 ? (
          <ul className="product-list">
            {products.map((product) => (
              <li key={product.id} className="product-item">
                <img
                  className="product-image"
                  src={product.imageUrl || "/default-product.png"}
                  alt={product.name}
                />
                <div className="product-info">
                  <h3 className="name">{product.name}</h3>
                  <h3 className="sku">SKU: {product.sku}</h3>
                  <h3 className="price">
                    Price: ${Number(product.price).toFixed(2)}
                  </h3>
                  <h3 className="quantity">
                    Quantity: {product.stockQuantity}
                  </h3>
                </div>

                <div className="product-actions">
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/edit-product/${product.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products available.</p>
        )}

        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </Layout>
  );
};

export default ProductPage;
