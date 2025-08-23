import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./service/Guard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CategoryPage from "./pages/CategoryPage";
import SupplierPage from "./pages/SupplierPage";
import AddEditSupplierPage from "./pages/AddEditSupplierPage";
import ProductPage from "./pages/ProductPage";
import AddEditProductPage from "./pages/AddEditProductPage";
import PurchasePage from "./pages/PurchasePage";
import SellPage from "./pages/SellPage";
import TransactionsPage from "./pages/TransactionsPage";
import TransactionDetailsPage from "./pages/TransactionDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import SplashScreen from "./pages/SplashScreen";
import LandingPage from "./pages/LandingPage";
import Logout from "./pages/Logout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />

        {/*Admin Routes*/}
        <Route
          path="/category"
          element={<AdminRoute element={<CategoryPage />} />}
        />
        <Route
          path="/supplier"
          element={<AdminRoute element={<SupplierPage />} />}
        />
        <Route
          path="/add-supplier"
          element={<AdminRoute element={<AddEditSupplierPage />} />}
        />
        <Route
          path="/edit-supplier/:supplierId"
          element={<AdminRoute element={<AddEditSupplierPage />} />}
        />
        <Route
          path="/product"
          element={<AdminRoute element={<ProductPage />} />}
        />
        <Route
          path="/add-product"
          element={<AdminRoute element={<AddEditProductPage />} />}
        />
        <Route
          path="/edit-product/:productId"
          element={<AdminRoute element={<AddEditProductPage />} />}
        />

        {/*Admin AND Manager Routes*/}
        <Route
          path="/purchase"
          element={<ProtectedRoute element={<PurchasePage />} />}
        />
        <Route
          path="/sell"
          element={<ProtectedRoute element={<SellPage />} />}
        />
        <Route
          path="/transaction"
          element={<ProtectedRoute element={<TransactionsPage />} />}
        />
        <Route
          path="/transaction/:transactionId"
          element={<ProtectedRoute element={<TransactionDetailsPage />} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<ProfilePage />} />}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<DashboardPage />} />}
        />

        <Route path="*" element={<LoginPage />} />
        <Route path="/logout" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
