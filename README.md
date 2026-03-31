# 💧⚡ WattsFlow - Smart Utility Tracking Platform

WattsFlow is a full-stack, comprehensive web application designed to help users track, analyze, and optimize their water and electricity consumption. Built with a modern tech stack, it features real-time monitoring, goal setting, anomaly detection, predictive insights, and administrative management.

---

## 🏗️ Architecture & System Design (Interview Focus)

This project is deliberately structured to showcase enterprise-level architectural patterns suitable for technical interviews.

- **Monorepo Structure**: Frontend (React) and Backend (Node.js) are housed in a single repository for cohesive version control and streamlined developer experience.
- **Single-Origin Deployment**: In production, the backend Express server statically serves the compiled React application frontend and proxies API routes. This eliminates CORS complexity in production and allows single-URL scaling (e.g., deployed via Render).
- **RESTful API**: Strict adherence to REST conventions with modular routers separated by domains (Auth, Meters, Consumption, Reports, Admin).
- **Real-time WebSockets**: Integrated `socket.io` on the backend to broadcast real-time consumption events and alerts directly to connected clients.
- **Role-Based Access Control (RBAC)**: Distinct data access and routing limits for standard users versus admin users.
- **Secure Credential Handling**: Environmental variables decoupled via `dotenv` with strict GitHub security.

---

## 🛠️ Comprehensive Tech Stack & Libraries

### 🖥️ Frontend (Client-Side)
- **React 19**: Modern component-based UI engineering.
- **Vite 7**: Ultra-fast build tool and development server with hot module replacement (HMR), vastly outperforming Create React App.
- **Tailwind CSS v4**: Utility-first CSS framework for highly responsive and maintainable custom styling without CSS bloat.
- **React Router DOM v7**: Declarative client-side routing, enabling a seamless Single Page Application (SPA).
- **Radix UI**: Unstyled, accessible UI primitive components (modals, dropdowns, dialogs) ensuring WAI-ARIA compliance.
- **Recharts**: Composable charting library heavily utilized to visualize energy/water consumption trend timelines.
- **React Hook Form + Zod**: Highly performant form management coupled with strict schema-based runtime validation.
- **Framer Motion**: Production-ready animation library for fluid UI transitions and interactions.
- **Axios**: Promised-based HTTP client for predictable API requests and automatic JSON transformations via an interceptor pattern.
- **Lucide React**: Crisp, highly customizable SVG icon set.
- **Sonner**: Highly responsive toast notification system for instant UI feedback.

### ⚙️ Backend (Server-Side)
- **Node.js**: Asynchronous, event-driven JavaScript runtime environment.
- **Express.js**: Minimal and flexible Node.js web application framework providing robust routing and middleware capabilities.
- **MongoDB**: NoSQL database perfectly matched for flexible schema design and time-series IoT/meter reading data.
- **Mongoose**: Object Data Modeling (ODM) library providing strict schema validation, robust relationship definitions, and efficient queries.
- **Socket.io**: Enables bi-directional, real-time communication for immediate consumption alerts, goal tracking, and live dashboard updates.
- **Twilio**: External API integration to seamlessly send SMS alerts for critical threshold breaches (e.g., detected water leaks).
- **Passport.js & Local OAuth**: Flexible authentication middleware handling extensive authentication strategies including `passport-google-oauth20` secure login flows.

### 🔒 Security & Optimization Utilities
- **JSON Web Tokens (JWT)**: Stateless authentication protocol enforcing secure session control across the monolithic architecture.
- **Bcrypt.js**: Cryptographic password hashing to safely store user credentials.
- **Helmet**: Secures Express apps by setting crucial HTTP response headers (e.g., DNS Prefetch Control, Frameguard, XSS protection).
- **CORS**: Cross-Origin Resource Sharing middleware securely configured for both local development and production routing.
- **Express Rate Limit**: Guards the REST API against brute-force password guess attacks and DDOS abuse by limiting repeated client requests.
- **Dotenv**: Manages sensitive environment variables off-source code control.
- **Express Validator**: Server-side request sanitizer ensuring robust validation pipeline security before hitting the database logic.

---

## 💡 Key Product Features

1. **Real-time Consumption Tracking**: Log and monitor utility usage live.
2. **AI-Powered Insights Dashboard**: Anomaly detection identifies potential leaks or unnatural power drains.
3. **Predictive Analytics**: Estimates upcoming utility bills based on historical user usage trends.
4. **Interactive Visualizations**: Granular charts breaking down usage by individual meter, time, and utility type.
5. **Goal Setting Ecosystem**: Custom consumption limits with automated progress tracking and push notifications.
6. **Automated Enterprise Reports**: Scheduled PDF/CSV summaries for long-term record-keeping.
7. **Role-Based Admin Dashboard**: Specialized overview for managing users, handling support tickets, and modifying system global settings.
8. **Multi-Channel Alerts**: Critical warnings triggered via the Twilio SMS integration and App UI.

---

## 📁 Project Structure (Monorepo)

```text
WaterElecTracking/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable Radix UI & custom components
│   │   ├── hooks/         # Custom React lifecycle hooks
│   │   ├── pages/         # Primary routed app pages
│   │   ├── layouts/       # Context/State wrapper layouts
│   │   ├── utils/         # Axios API interceptors & logic
│   │   └── App.jsx        # Main routing root tree
│   └── vite.config.js     # Production build & proxy config
├── backend/               # Express.js backend API
│   ├── models/           # Mongoose Database schemas
│   ├── routes/           # RESTful API controller routes
│   ├── middleware/       # JWT Auth & error handlers
│   └── server.js         # Backend/Express initialization root
└── package.json        # Central execution & deployment scripts
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas online URI)

### Local Initialization

1. **Clone the repo and configure environment variables**  
   Create `.env` files inside `/backend` and `/frontend` based on the provided `.env.example` structures.

2. **Install all cross-environment dependencies**
   ```bash
   npm run install:all
   ```
   
3. **Boot both servers via concurrently**
   ```bash
   npm run dev
   ```
   *Vite frontend will launch on `localhost:5173` and the Express server will attach to `localhost:5000`.*

### Manual Production Build Flow
```bash
npm run build
npm start
```
When building for production, the Vite frontend seamlessly compiles strictly optimized assets into `frontend/dist`. The Express server automatically statically serves these specific assets, effectively producing a full-stack, single-URL deployment architecture.

---

## 👨‍💻 Developer & Maintainer
Built by Anmol. 
- Core infrastructure engineered specifically emphasizing scalable design patterns, RESTful API integration, and optimal real-time rendering. 
- Open for open-source contributions and ready to scale for extensive utility data grids.
