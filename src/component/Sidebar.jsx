import React from "react";
import { Link } from "react-router-dom";
import ApiService from "../service/ApiService";

const logout = () => {
  ApiService.logout();
};

const Sidebar = () => {
  const isAuth = ApiService.isAuthenticated();
  return (
    <div className="sidebar">
      <h1 className="stack-icon">
        <img src="test-images/main.png" alt="app-icon" />
      </h1>
      <ul className="nav-links">
        {isAuth && (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/transaction">Transactions</Link>
            </li>
            <li>
              <Link to="/category">Category</Link>
            </li>
            <li>
              <Link to="/product">Product</Link>
            </li>
            <li>
              <Link to="/supplier">Supplier</Link>
            </li>
            <li>
              <Link to="/purchase">Purchase</Link>
            </li>
            <li>
              <Link to="/sell">Sell</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button onClick={logout} className="link-button">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
