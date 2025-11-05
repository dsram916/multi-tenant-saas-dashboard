# 📚 Multi-Tenant SaaS Bookstore Dashboard

## Project Summary

This project delivers a complete, production-ready **Multi-Tenant SaaS (Software as a Service)** platform, modeled as a digital bookstore marketplace. The application strictly follows the Nimbus Problem Statement requirements, proving **data isolation**, **runtime theming**, and professional **observability** features.

---

## ✅ Core Features & Problem Statement Compliance

The entire system is secured and governed by the **`tenantId`** structure.

| Key Feature (PS) | Implementation Proof | Code Location |
| :--- | :--- | :--- |
| **Data Isolation** | All Mongoose schemas (`User`, `Book`) use a strict `tenantId` field. Queries in **`bookController.js`** enforce: `Book.find({ tenantId: req.user.tenantId })`. | `backend/models/`, `backend/controllers/bookController.js` |
| **Access Control** | **JWT Authentication** includes `tenantId` and `role` (`admin`/`customer`). **`authMiddleware.js`** intercepts every request to enforce permissions and isolation. | `backend/middleware/authMiddleware.js` |
| **Runtime Theming** | **DEMO:** Admins update the `primaryColor` and `logoUrl` in settings. Frontend JavaScript hooks update **CSS variables** (`--color-primary`) instantly, achieving zero-redeploy theming. | `frontend/pages/StoreSettingsPage.jsx` |
| **Admin Console** | Complete Seller dashboard featuring **Product CRUD** (Create, Read, Update, Delete books), **Branding Assets** (Logo Upload), and **Feature Toggles** (`enable3dModel` switch). | `frontend/dashboards/` |
| **Tenant Resolution** | Implemented resolution via URL prefix. Public storefronts are accessed via `/t/:slug` (e.g., `/t/alices-awesome-books`). | `backend/controllers/publicController.js` |
| **Performance & Indexing** | **Pagination** is implemented in `bookController.js` using MongoDB's `limit` and `skip`. This is coupled with compound indexes (`tenantId, createdAt`) for fast query execution. | `backend/controllers/bookController.js` |
| **Observability** | Implemented structured logging using **`morgan-json`**. Every backend log is a JSON object containing a unique **`correlation-id`** and the relevant **`tenantId`**. | `backend/middleware/logMiddleware.js` |
| **Validation & Tests** | The **`seeder.js`** script generates two fully independent, isolated tenants (Alice & Bob) with pre-populated data for rapid smoke testing. | `backend/seeder.js` |
| **Containerized Dev** | All application services (Frontend, API, MongoDB) are defined for containerized deployment. | `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile` |

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React.js, Vite, Framer Motion** | Fast UI, dynamic routing, and premium, animated user experience. |
| **Backend** | **Node.js, Express.js** | Robust, scalable API layer. |
| **Database** | **MongoDB (Mongoose)** | Flexible, schemaless database for high scalability. |
| **Deployment** | **Docker, Docker Compose** | Isolation and production deployment readiness. |

---

## 🚀 Installation and Launch

### Prerequisites

1.  Node.js (v18+)
2.  MongoDB Server (Local or Atlas)
3.  Docker Desktop (for Containerized Launch)

### Local Launch (Non-Docker)

1.  Clone the repository and install dependencies:
    ```bash
    git clone [https://github.com/dsram916/multi-tenant-saas-dashboard.git](https://github.com/dsram916/multi-tenant-saas-dashboard.git)
    cd multi-tenant-saas-dashboard
    npm install
    npm install --prefix backend
    npm install --prefix frontend
    ```
2.  Set environment variables in **`backend/.env`**.
3.  Start the full stack:
    ```bash
    npm run dev
    ```

### Seed the Database (Required for First Run)

To populate the isolated tenants (Alice, Bob, and Customer Charlie):

```bash
npm run seed --prefix backend
