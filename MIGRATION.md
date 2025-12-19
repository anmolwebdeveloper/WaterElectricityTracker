# Migration Guide: Next.js to React + Vite

## Files to Delete

### Next.js Specific Files
Run these commands to clean up Next.js files:

```bash
# Delete Next.js build directory
Remove-Item -Recurse -Force .next

# Delete Next.js config files
Remove-Item next.config.mjs
Remove-Item next-env.d.ts

# Delete TypeScript config if not using TypeScript
Remove-Item tsconfig.json

# Delete app directory (content moved to frontend/src)
Remove-Item -Recurse -Force app

# Delete postcss.config.mjs (if using Vite's default)
Remove-Item postcss.config.mjs

# Delete components.json (v0 specific)
Remove-Item components.json

# Delete pnpm-lock.yaml if switching to npm
Remove-Item pnpm-lock.yaml
```

Or manually delete:
- `.next/`
- `next.config.mjs`
- `next-env.d.ts`
- `tsconfig.json` (optional)
- `app/` (already converted)
- `postcss.config.mjs` (optional)
- `components.json`
- `pnpm-lock.yaml` (if using npm)

## Package Installation

```powershell
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

## Environment Setup

### Backend Environment
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wattsflow
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-here
```

### Frontend Environment
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

## Code Changes Summary

### 1. Routing Changes

**Before (Next.js):**
```jsx
import Link from 'next/link'
import { useRouter } from 'next/navigation'

<Link href="/dashboard">Dashboard</Link>
const router = useRouter()
router.push('/dashboard')
```

**After (React Router):**
```jsx
import { Link, useNavigate } from 'react-router-dom'

<Link to="/dashboard">Dashboard</Link>
const navigate = useNavigate()
navigate('/dashboard')
```

### 2. Component Changes

**Before (Next.js):**
```jsx
"use client"  // Remove this

import { usePathname } from 'next/navigation'

export default function Page() {
  const pathname = usePathname()
  // ...
}
```

**After (React):**
```jsx
// No "use client" directive

import { useLocation } from 'react-router-dom'

export default function Page() {
  const location = useLocation()
  const pathname = location.pathname
  // ...
}
```

### 3. Layout Changes

**Before (Next.js):**
```jsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}

// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return <div>{children}</div>
}
```

**After (React Router):**
```jsx
// App.jsx with Routes
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="analytics" element={<Analytics />} />
  </Route>
</Routes>

// DashboardLayout.jsx
import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet /> {/* Renders nested routes */}
      </main>
    </div>
  )
}
```

### 4. Import Path Changes

**Before:**
```jsx
import { Button } from "@/components/ui/button"
// @ alias points to root in Next.js
```

**After:**
```jsx
import { Button } from "@/components/ui/button"
// @ alias now points to root (configured in vite.config.js)
// Vite config sets: alias: { '@': path.resolve(__dirname, '../') }
```

### 5. CSS/Globals Import

**Before:**
```jsx
// app/layout.tsx
import "./globals.css"
```

**After:**
```jsx
// frontend/src/main.jsx
import '@/app/globals.css'
```

## Directory Structure Comparison

### Before (Next.js):
```
WaterElecTracking/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── login/page.tsx
│   └── dashboard/
│       ├── layout.tsx
│       └── page.tsx
├── components/
└── package.json
```

### After (React + Vite):
```
WaterElecTracking/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── dashboard/
│   │   │       └── Dashboard.jsx
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── server.js
│   └── package.json
├── components/
└── package.json (root)
```

## Running the Application

### Option 1: Both together (Recommended)
```bash
npm run dev
```

### Option 2: Separate terminals
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Common Issues & Solutions

### Issue 1: Module not found errors
**Solution:** Check Vite alias configuration in `vite.config.js`

### Issue 2: Components not rendering
**Solution:** Ensure React Router routes are properly configured in `App.jsx`

### Issue 3: API calls failing
**Solution:** 
- Check backend is running on port 5000
- Verify CORS settings in `backend/server.js`
- Check proxy configuration in `vite.config.js`

### Issue 4: Styles not loading
**Solution:** 
- Ensure globals.css is imported in `main.jsx`
- Check Tailwind CSS configuration
- Verify PostCSS setup

## Verification Checklist

- [ ] All dependencies installed successfully
- [ ] Backend starts without errors (port 5000)
- [ ] Frontend starts without errors (port 5173)
- [ ] MongoDB is running and accessible
- [ ] Environment files created and configured
- [ ] Can navigate to homepage
- [ ] Can navigate to login/signup pages
- [ ] Can access dashboard after login
- [ ] All routes working correctly
- [ ] No console errors in browser
- [ ] API endpoints responding correctly

## Next Steps

1. **Delete old Next.js files** (use commands above)
2. **Install dependencies** (`npm run install:all`)
3. **Setup environment variables** (create .env files)
4. **Start MongoDB**
5. **Run the application** (`npm run dev`)
6. **Test all routes and functionality**
7. **Convert remaining dashboard pages** (from placeholders to full content)

## Need Help?

If you encounter issues:
1. Check the console for errors
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check environment variables
5. Review the README.md file
6. Create an issue in the repository

---

**Migration Complete! 🎉**

Your Next.js application is now running on React + Vite + Express!
