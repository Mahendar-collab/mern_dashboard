import React, { useState, useEffect } from "react";
import { API_URL } from "../data/apiPath";

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  // 🟢 Fetch all products for the current firm
  const productHandler = async () => {
    const firmId = localStorage.getItem("firmId");
    if (!firmId) {
      alert("No firm ID found in local storage");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/product/${firmId}/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const newProductData = await response.json();
      setProducts(newProductData.products || []);
      console.log("✅ Products fetched:", newProductData.products);
    } catch (error) {
      console.error("❌ Failed to fetch products", error);
      alert("Failed to fetch products");
    }
  };

  useEffect(() => {
    productHandler();
  }, []);

  // 🗑️ Delete product by ID
  const deleteProductById = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/product/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("❌ Failed to delete product:", response.status, errText);
        alert("Failed to delete product");
        return;
      }

      const data = await response.json();
      console.log("✅ Deleted product:", data);

      // Remove product from the state list
      setProducts((prev) => prev.filter((product) => product._id !== productId));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("❌ Failed to delete product:", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div>
      <h2>All Products</h2>

      {!products.length ? (
        <p>No products added</p>
      ) : (
        <table className="product-table" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Image</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item._id}>
                <td>{item.productName}</td>
                <td>{item.price}</td>
                <td>
                  {item.image && (
                    <img
                      src={`${API_URL}/uploads/${item.image}`}
                      alt={item.productName}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => deleteProductById(item._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllProducts;
