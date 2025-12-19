# WattsFlow - Water & Electricity Tracking Platform

A full-stack application for tracking water and electricity consumption with AI-powered insights and real-time analytics.

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Recharts** - Data visualization
- **Lucide Icons** - Beautiful icon library

### Backend
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Helmet** - Security middleware

## 📁 Project Structure

```
WaterElecTracking/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   └── App.jsx        # Main app with routing
│   ├── package.json
│   └── vite.config.js
├── backend/               # Express.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── server.js         # Entry point
│   └── package.json
├── components/           # Shared UI components
├── hooks/               # React hooks
├── context/            # React context providers
├── lib/                # Utility functions
└── package.json        # Root package.json (scripts)
```

## 🔧 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or pnpm

### Step 1: Clone and Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Or install manually
cd frontend && npm install
cd ../backend && npm install
```

### Step 2: Configure Environment Variables

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

**Frontend** (`frontend/.env`):
```bash
cp frontend/.env.example frontend/.env
```

### Step 3: Start MongoDB

Make sure MongoDB is running on your system:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

## 🏃 Running the Application

### Development Mode

**Option 1: Run Both (Recommended)**
```bash
# From root directory - runs both frontend and backend
npm run dev
```

**Option 2: Run Separately**
```bash
# Terminal 1 - Frontend (port 5173)
npm run dev:frontend

# Terminal 2 - Backend (port 5000)
npm run dev:backend
```

### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd ../backend
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Readings
- `GET /api/readings` - Get all readings
- `POST /api/readings` - Create new reading
- `GET /api/readings/:id` - Get specific reading
- `PUT /api/readings/:id` - Update reading
- `DELETE /api/readings/:id` - Delete reading

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

### Analytics
- `GET /api/analytics/consumption` - Get consumption analytics
- `GET /api/analytics/trends` - Get trend analysis
- `GET /api/analytics/predictions` - Get AI predictions

## 🔑 Features

- ✅ Real-time consumption tracking
- ✅ AI-powered anomaly detection
- ✅ Predictive savings recommendations
- ✅ Interactive dashboards and charts
- ✅ Goal setting and tracking
- ✅ Multi-household support
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Real-time notifications via Socket.io

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test
```

## 📦 Building for Production

```bash
# Build frontend
npm run build

# The built files will be in frontend/dist/
```

## 🛠️ Development Scripts

```bash
npm run dev              # Run both frontend and backend
npm run dev:frontend     # Run only frontend
npm run dev:backend      # Run only backend
npm run build            # Build frontend for production
npm run install:all      # Install all dependencies
```

## 🚨 Migration from Next.js

This project was converted from Next.js to React + Vite. If you have the old Next.js version:

### Files to Delete (Next.js specific):
- `.next/` directory
- `next.config.mjs`
- `next-env.d.ts`
- `app/` directory (content moved to `frontend/src/pages/`)
- All Next.js specific imports and features

### Key Changes:
1. `Link` from Next.js → `Link` from `react-router-dom`
2. `useRouter` from Next.js → `useNavigate`, `useLocation` from `react-router-dom`
3. `"use client"` directives removed
4. Server components converted to client components
5. App directory structure → Standard React pages structure

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For support, email anmosh2004@gmail.com or create an issue in the repository.

## 🙏 Acknowledgments

- Built with ❤️ by Anmol
- Icons by Lucide
- UI Components by Radix UI
- Styled with TailwindCSS

---

**Happy Tracking! 💧⚡**
