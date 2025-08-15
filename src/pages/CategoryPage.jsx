import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 4000);
    };

    const getCategories = async () => {
        try {
            const response = await ApiService.getAllCategories();
            if (response) {
                setCategories(response);
            } else {
                showMessage("Failed to load categories");
            }
        } catch (error) {
            showMessage(error.response?.data.message || "Could not retrieve categories: " + error);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const addCategory = async () => {
        if (!categoryName) {
            showMessage("Category name cannot be empty");
            return;
        }

        try {
            await ApiService.createCategory({ name: categoryName });
            setCategoryName("");
            showMessage("Category added successfully");
            getCategories();
        } catch (error) {
            showMessage(error.response?.data.message || "Could not add category: " + error);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            if (window.confirm("Are you sure you want to delete this category?")) {
                await ApiService.deleteCategory(categoryId);
                setCategories(categories.filter((cat) => cat.id !== categoryId));
                showMessage("Category deleted successfully");
            }
        } catch (error) {
            showMessage(error.response?.data.message || "Could not delete category: " + error);
        }
    };

    const handleEditCategory = (category) => {
        setIsEditing(true);
        setCategoryName(category.name);
        setEditingCategoryId(category.id);
    };

    const handleUpdateCategory = async () => {
        if (!categoryName) {
            showMessage("Category name cannot be empty");
            return;
        }

        try {
            await ApiService.updateCategory(editingCategoryId, { name: categoryName });
            setCategoryName("");
            setIsEditing(false);
            setEditingCategoryId(null);
            showMessage("Category updated successfully");
            getCategories();
        } catch (error) {
            showMessage(error.response?.data.message || "Could not update category: " + error);
        }
    };

    return (
        <Layout>
            {message && <div className="message">{message}</div>}

            <div className="category-page">
                <div className="category-header">
                    <h1>Categories</h1>
                    <div className="category-actions">
                        <input
                            type="text"
                            placeholder="Enter category name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                        {isEditing ? (
                            <button onClick={handleUpdateCategory}>Update</button>
                        ) : (
                            <button onClick={addCategory}>Add</button>
                        )}
                    </div>
                </div>
            </div>

            {categories.length > 0 && (
                <ul className="category-list">
                    {categories.map((category) => (
                        <li className="category-item" key={category.id}>
                            <span>{category.name}</span>
                            <div className="category-buttons">
                                <button onClick={() => handleEditCategory(category)}>Edit</button>
                                <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Layout>
    );
};

export default CategoryPage;
