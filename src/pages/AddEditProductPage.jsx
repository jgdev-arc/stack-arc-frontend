import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditProductPage = () => {
    const { productId } = useParams();
    const [name, setName] = useState("");
    const [sku, setSku] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 4000);
    };

    useEffect(() => {
        const fetchCategories = async() => {
            try {
                const categoriesData = await ApiService.getAllCategories();
                const list = Array.isArray(categoriesData.categories)
                ? categoriesData.categories
                : categoriesData;
                setCategories(list);

            } catch (error) {
                console.error(error);
                showMessage(error.response?.data.message || "Could not find categories " + error);
            }
        }

        const fetchProductById = async() => {
        if (productId) {
            setIsEditing(true);
            try {
                const productData = await ApiService.getProductById(productId);
                if (productData.status === 200) {
                    setName(productData.product.name)
                    setSku(productData.product.sku)
                    setPrice(productData.product.price)
                    setStockQuantity(productData.product.stockQuantity)
                    setCategoryId(productData.product.categoryId)
                    setDescription(productData.product.description)
                    setImageUrl(productData.product.imageUrl)
                } else {
                    showMessage(productData.message);
                }
            } catch (error) {
                 showMessage(error.response?.data.message || "Could not find product by ID: " + error);
            }
        }
        
    }

        fetchCategories();
        if (productId) fetchProductById();
    }, [productId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImageUrl(reader.result);
        reader.readAsDataURL(file);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("sku", sku);
        formData.append("price", price);
        formData.append("stockQuantity", stockQuantity);
        formData.append("categoryId", categoryId);
        formData.append("description", description);
        if (imageFile) {
            formData.append("imageFile", imageFile)
        }

        try {
            if (isEditing) {
                await ApiService.updateProduct(productId, formData);
                showMessage("Product Updated!");
            } else {
                await ApiService.addProduct(formData);
                showMessage("Product added successfully!");
            }
            navigate("/product")
        } catch (error) {
            showMessage(error.response?.data.message || "Could not update Product: " + error);
        }
    }

    return(
        <Layout>
            {message && <div className="message">{message}</div>}
            <div className="product-form-page">
                <h1>{isEditing ? "Edit Product" : "Add Product"}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        />
                    </div>

                    <div className="form-group">
                        <label>Sku</label>
                        <input 
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        required
                        />
                    </div>

                    <div className="form-group">
                        <label>Stock Quantity</label>
                        <input 
                        type="number"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input 
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        >
                        </textarea>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select 
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        >
                            <option value="">Select Category</option>
                            {Array.isArray(categories) && categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}


                        </select>
                    </div>

                    <div className="form-group">
                        <label>Product Image</label>
                        <input type="file" onChange={handleImageChange}/>
                       {imageUrl && (
                        <img src={imageUrl} 
                        alt="preview" 
                        className="image-preview" />
                       )}
                    </div>

                    <button type="submit">{isEditing ? "Edit Product" : "Add Product"}</button>

                </form>
            </div>
        </Layout>
    )

}

export default AddEditProductPage;