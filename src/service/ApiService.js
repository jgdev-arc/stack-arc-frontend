import axios from "axios";
import CryptoJS from "crypto-js";

export default class ApiService {
    static BASE_URL = "http://localhost:5050/api";
    static ENCRYPTION_KEY = "stackarc-inventory";

    static encrypt(data) {
        return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
    }

    static decrypt(data) {
        const bytes = CryptoJS.AES.decrypt(data, this.ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    static saveToken(token) {
        const encryptedToken = this.encrypt(token);
        localStorage.setItem("token", encryptedToken);
    }

    static getToken() {
        const encryptedToken = localStorage.getItem("token");
        if (!encryptedToken) return null;
        return this.decrypt(encryptedToken);
    }

    static saveRole(role) {
        const encryptedRole = this.encrypt(role);
        localStorage.setItem("role", encryptedRole);
    }

    static getRole() {
        const encryptedRole = localStorage.getItem("role");
        if (!encryptedRole) return null;
        return this.decrypt(encryptedRole);
    }

    static clearAuth() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    static getHeader() {
        const token = this.getToken();
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    // ---------------- Authentication ----------------
    static async registerUser(registerData) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registerData);
        return response.data;
    }

    static async loginUser(loginData) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginData);
        return response.data;
    }

    static logout() {
        this.clearAuth();
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static isAdmin() {
        return this.getRole() === "ADMIN";
    }

    // ---------------- Users ----------------
    static async getAllUsers() {
        const response = await axios.get(`${this.BASE_URL}/users`, { headers: this.getHeader() });
        return response.data;
    }

    static async getLoggedInUsersInfo() {
        const response = await axios.get(`${this.BASE_URL}/users/current`, { headers: this.getHeader() });
        return response.data;
    }

    static async getUserById(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/${userId}`, { headers: this.getHeader() });
        return response.data;
    }

    static async updateUser(userId, userData) {
        const response = await axios.put(`${this.BASE_URL}/users/${userId}`, userData, { headers: this.getHeader() });
        return response.data;
    }

    static async deleteUser(userId) {
        const response = await axios.delete(`${this.BASE_URL}/users/${userId}`, { headers: this.getHeader() });
        return response.data;
    }

    // ---------------- Products ----------------
    static async addProduct(formData) {
        const response = await axios.post(`${this.BASE_URL}/products`, formData, {
            headers: { ...this.getHeader(), "Content-Type": "multipart/form-data" }
        });
        return response.data;
    }

    static async updateProduct(id, formData) {
        const response = await axios.put(`${this.BASE_URL}/products/${id}`, formData, {
            headers: { ...this.getHeader(), "Content-Type": "multipart/form-data" }
        });
        return response.data;
    }

    static async getAllProducts() {
        const response = await axios.get(`${this.BASE_URL}/products`, { headers: this.getHeader() });
        return response.data;
    }

    static async getProductById(productId) {
        const response = await axios.get(`${this.BASE_URL}/products/${productId}`, { headers: this.getHeader() });
        return response.data;
    }

    static async searchProduct(searchValue) {
        const response = await axios.get(`${this.BASE_URL}/products/search`, {
            params: { searchValue },
            headers: this.getHeader()
        });
        return response.data;
    }

    static async deleteProduct(productId) {
        const response = await axios.delete(`${this.BASE_URL}/products/${productId}`, { headers: this.getHeader() });
        return response.data;
    }

    // ---------------- Categories ----------------
    static async createCategory(category) {
        const response = await axios.post(`${this.BASE_URL}/categories`, category, { headers: this.getHeader() });
        return response.data;
    }

    static async getAllCategories() {
    try {
        const url = `${this.BASE_URL}/categories`;
        console.log("Fetching categories from:", url);
        const response = await axios.get(url, { headers: this.getHeader() });
        console.log("Categories response:", response.data);

        // Return array directly or fallback if wrapped in {categories: [...]}
        return response.data.categories || response.data || [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}

    static async getCategoryById(categoryId) {
        const response = await axios.get(`${this.BASE_URL}/categories/${categoryId}`, { headers: this.getHeader() });
        return response.data;
    }

    static async updateCategory(categoryId, categoryData) {
        const response = await axios.put(`${this.BASE_URL}/categories/${categoryId}`, categoryData, { headers: this.getHeader() });
        return response.data;
    }

    static async deleteCategory(categoryId) {
        const response = await axios.delete(`${this.BASE_URL}/categories/${categoryId}`, { headers: this.getHeader() });
        return response.data;
    }

    // ---------------- Suppliers ----------------
    static async addSupplier(supplierData) {
        const response = await axios.post(`${this.BASE_URL}/suppliers`, supplierData, { headers: this.getHeader() });
        return response.data;
    }

    static async getAllSuppliers() {
    try {
        const url = `${this.BASE_URL}/suppliers`;
        console.log("Fetching suppliers from:", url);
        const response = await axios.get(url, { headers: this.getHeader() });
        console.log("Suppliers response:", response.data);

        
        return response.data.suppliers || response.data || [];
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        throw error;
    }
}

    static async getSupplierById(supplierId) {
        const response = await axios.get(`${this.BASE_URL}/suppliers/${supplierId}`, { headers: this.getHeader() });
        return response.data;
    }

    static async updateSupplier(supplierId, supplierData) {
        const response = await axios.put(`${this.BASE_URL}/suppliers/${supplierId}`, supplierData, { headers: this.getHeader() });
        return response.data;
    }

    static async deleteSupplier(supplierId) {
        const response = await axios.delete(`${this.BASE_URL}/suppliers/${supplierId}`, { headers: this.getHeader() });
        return response.data;
    }

    // ---------------- Transactions ----------------
    static async purchaseProduct(body) {
        const response = await axios.post(`${this.BASE_URL}/transactions/purchase`, body, { headers: this.getHeader() });
        return response.data;
    }

    static async sellProduct(body) {
        const response = await axios.post(`${this.BASE_URL}/transactions/sell`, body, { headers: this.getHeader() });
        return response.data;
    }

    static async returnToSupplier(body) {
        const response = await axios.post(`${this.BASE_URL}/transactions/return-to-supplier`, body, { headers: this.getHeader() });
        return response.data;
    }

    static async getAllTransactions(q = "") {
        const response = await axios.get(`${this.BASE_URL}/transactions`, {
            headers: this.getHeader(),
            params: { q }
        });
        return response.data;
    }

    static async getTransactionsByMonthAndYear(month, year) {
        const response = await axios.get(`${this.BASE_URL}/transactions/month-year`, {
            headers: this.getHeader(),
            params: { month, year }
        });
        return response.data;
    }

    static async getTransactionById(transactionId) {
        const response = await axios.get(`${this.BASE_URL}/transactions/${transactionId}`, { headers: this.getHeader() });
        return response.data;
    }

    static async updateTransactionStatus(transactionId, status) {
        const response = await axios.put(`${this.BASE_URL}/transactions/${transactionId}`, status, { headers: this.getHeader() });
        return response.data;
    }
}
