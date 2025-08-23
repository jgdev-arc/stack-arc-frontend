import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const features = [
  {
    title: "Track Inventory",
    desc: "Add products, categories, and stock levels with quick edits.",
  },
  {
    title: "Manage Suppliers",
    desc: "Store supplier details and attach them to purchases.",
  },
  {
    title: "Record Transactions",
    desc: "Purchase/Sell flows with status updates and filtering.",
  },
  {
    title: "Fast Search",
    desc: "Find transactions instantly with server-side search.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const hasSeenSplash = sessionStorage.getItem("seenSplash");

    if (!hasSeenSplash) {
      navigate("/splash", { replace: true });
      return;
    }
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="landing-page">
      <main>
        {/* Hero (condensed + centered) */}
        <section className="lp-hero lp-hero-condensed">
          <h1>Inventory management that’s fast and simple.</h1>
          <p className="lp-hero-sub">
            Track products, suppliers, and transactions—then search and analyze
            it, all in one place. Built with Kotlin + Spring Boot and React.
          </p>

          <div className="lp-hero-actions">
            <Link to="/register" className="lp-cta lp-cta-lg">
              Try it free
            </Link>
            <Link to="/login" className="lp-link alt">
              Sign in
            </Link>
          </div>

          <div className="lp-hero-art">
            <img
              src="/test-images/app-preview.png"
              alt="Stack Arc app preview"
              className="lp-hero-img"
              fetchPriority="high"
            />
          </div>
        </section>

        {/* Features */}
        <section className="lp-section lp-center-all">
          <h2>What you can do</h2>
          <div className="lp-features">
            {features.map((f) => (
              <div key={f.title} className="lp-card">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="lp-section lp-center-all">
          <h2>How it works</h2>
          <ol className="lp-steps">
            <li>
              <span>1</span> Register your account
            </li>
            <li>
              <span>2</span> Add products & categories
            </li>
            <li>
              <span>3</span> Record purchases & sales
            </li>
            <li>
              <span>4</span> View dashboard & search
            </li>
          </ol>
          <div className="lp-center">
            <Link to="/register" className="lp-cta">
              Create your account
            </Link>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div>© {new Date().getFullYear()} Stack Arc</div>
        <div className="lp-footer-links">
          <Link to="/privacy">Privacy</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
