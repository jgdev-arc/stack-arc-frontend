import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("seenSplash");
    const token = localStorage.getItem("token");
    const nextPath = token ? "/dashboard" : "/";

    if (hasSeenSplash) {
      navigate(nextPath, { replace: true });
      return;
    }

    sessionStorage.setItem("seenSplash", "true");
    const timer = setTimeout(() => navigate(nextPath, { replace: true }), 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <img src="/main.png" alt="Stack Arc logo" className="splash-logo" />
      <h1 className="splash-title">Stack Arc</h1>
    </div>
  );
};

export default SplashScreen;
