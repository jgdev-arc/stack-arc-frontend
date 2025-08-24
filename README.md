# <div align="center">🖥️ **Stack Arc – Frontend (React)** 🖥️</div>

A clean, responsive **React** SPA for inventory management. Features a polished landing page + one-time splash, JWT-auth flows, protected/admin routes, and a card-first UI that matches the backend’s capabilities. Deployed on **Azure Static Web Apps** and talks to the Spring Boot API via **Axios**. View the back end repository [here](https://github.com/jgdev-arc/Stack-Arc).

---

<p align="center">
  <i>“Fast to navigate, easy on the eyes, and wired for real work.”</i>
</p>

## :camera_flash: Features
<img width="1536" height="1024" alt="architecture" src="https://github.com/user-attachments/assets/ccd8a390-2992-47d2-a75e-75b8a1660061" />


- **Modern SPA** – React + React Router; deep-linking supported (e.g., `/transaction/123`).
- **Landing + One-Time Splash** – Brand splash shows once per session, then a concise landing that explains the app.
- **Auth Flows** – Login/Register screens; token stored client-side; role-aware UI.
- **Protected & Admin Routes** – `ProtectedRoute` for authenticated areas; `AdminRoute` for admin-only pages.
- **Transactions UX** – Server-side filtering via query `q`; friendly details page with status updates.
- **Inventory Suite** – Products, Categories, Suppliers, Purchases, Sales; consistent card/table views.
- **Profile Page** – Displays the current user fetched from the backend.
- **Responsive & Themed** – Teal/gray theme with a dark landing hero; consistent spacing, rounded cards, subtle shadows.

---

## :earth_americas: Try It

If you’re here to **use the app**, open the **Azure Frontend**:  
👉 **Open the UI:** https://calm-pond-0fe4c9410.2.azurestaticapps.net/

Register, sign in, and explore the dashboard, products, suppliers, and transactions.

---

## :electric_plug: API Integration

- **Axios** service centralizes calls: `ApiService`  
- Uses `REACT_APP_API_BASE_URL` for the backend base URL  
- Transactions search uses `q` (e.g., `GET /transactions?q=widget`)

**Auth**
- On login, store the JWT in `localStorage`
- Guards read token/role to control access
- `ApiService` attaches the token to protected requests

---

## :art: UI/Style Notes

- **Theme**: teal accents with grays; landing uses dark navy hero.
  - Landing: `#0f172a` base, teal accents `#5eead4` / `#14b8a6`
  - App buttons: `#008080` hover `#2f4f4f`
- **Patterns**:
  - Section cards with rounded corners and soft shadows
  - Compact grids for feature cards and steps
  - Responsive image sizing via `clamp(...)` on the landing hero
- **Assets**:
  - Landing hero preview: `/test-images/app-preview.png`
  - Brand image(s) live under `/public/` for root-relative paths

---

## :file_folder: Project Structure (frontend)

```text
frontend/
├─ public/
│  ├─ test-images/
│  └─ (static assets: hero images, icons, etc.)
├─ src/
│  ├─ pages/
│  │  ├─ LandingPage.jsx
│  │  ├─ SplashScreen.jsx
│  │  ├─ LoginPage.jsx
│  │  ├─ RegisterPage.jsx
│  │  ├─ DashboardPage.jsx
│  │  ├─ TransactionsPage.jsx
│  │  ├─ TransactionDetailsPage.jsx
│  │  ├─ PurchasePage.jsx
│  │  ├─ SellPage.jsx
│  │  ├─ ProductPage.jsx
│  │  ├─ AddEditProductPage.jsx
│  │  ├─ CategoryPage.jsx
│  │  ├─ SupplierPage.jsx
│  │  ├─ AddEditSupplierPage.jsx
│  │  └─ ProfilePage.jsx
│  ├─ component/
│  │  ├─ Sidebar.jsx
│  │  ├─ ProtectedRoute.jsx (or service/Guard.js)
│  │  └─ AdminRoute.jsx     (or service/Guard.js)
│  ├─ service/
│  │  ├─ ApiService.js
│  │  └─ Guard.js           (exports ProtectedRoute, AdminRoute)
│  ├─ App.js
│  ├─ index.js
│  └─ index.css
└─ (GitHub Actions / config files as needed)
```
---

# :memo: Authors :memo:
- [@jgdev-arc](https://github.com/jgdev-arc)
