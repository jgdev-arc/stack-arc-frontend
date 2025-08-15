import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getLoggedInUsersInfo();
        const userData = data.user ?? data;
        setUser(userData);
      } catch (error) {
        showMessage(
          error?.response?.data?.message ||
            "Could not retrieve profile: " + error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className="profile-page">
        {loading && <div className="loading">Loading…</div>}

        {!loading && !user && (
          <div className="error-message">No profile data found.</div>
        )}

        {!loading && user && (
          <div className="profile-card">
            <h1>Hello, {user.name ?? user.fullName ?? "User"}!</h1>
            <div className="profile-info">
              <div className="profile-item">
                <label>Name: </label>
                <span>{user.name ?? user.fullName ?? "-"}</span>
              </div>
              <div className="profile-item">
                <label>Email: </label>
                <span>{user.email ?? user.emailAddress ?? "-"}</span>
              </div>
              <div className="profile-item">
                <label>Phone Number: </label>
                <span>{user.phoneNumber ?? user.phone ?? "-"}</span>
              </div>
              <div className="profile-item">
                <label>Role: </label>
                <span>
                  {user.role ??
                    (Array.isArray(user.roles) ? user.roles.join(", ") : "-")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
