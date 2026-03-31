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

## � Deployment

### Deploying to Render

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

**Quick Start:**
1. Set up MongoDB Atlas - https://www.mongodb.com/cloud/atlas
2. Configure environment variables on Render
3. Connect your GitHub repository to Render
4. Create backend and frontend services from Render "New +" and deploy

**Requirements:**
- GitHub account with your repo
- Render account (https://render.com)
- MongoDB Atlas account (free tier available)

For security guidelines, see [SECURITY.md](./SECURITY.md).

## �👥 Contributing

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
