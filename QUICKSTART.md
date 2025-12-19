# Quick Start Guide - After Migration

## Current Status
✅ Project structure converted from Next.js to React + Vite  
✅ All pages migrated to frontend/src/pages  
✅ React Router setup complete  
✅ Backend configured as standalone Express server  
✅ Documentation created

## To Complete the Setup:

### Step 1: Copy Shared Resources to Frontend

```powershell
# Copy shared UI components
Copy-Item -Recurse C:\WaterElecTracking\components C:\WaterElecTracking\frontend\src\components

# Copy hooks
Copy-Item -Recurse C:\WaterElecTracking\hooks C:\WaterElecTracking\frontend\src\hooks

# Copy lib utilities
Copy-Item -Recurse C:\WaterElecTracking\lib C:\WaterElecTracking\frontend\src\lib

# Copy context
Copy-Item -Recurse C:\WaterElecTracking\context C:\WaterElecTracking\frontend\src\context

# Copy styles
Copy-Item -Recurse C:\WaterElecTracking\styles C:\WaterElecTracking\frontend\src\styles

# Copy globals.css if not already done
Copy-Item C:\WaterElecTracking\app\globals.css C:\WaterElecTracking\frontend\src\globals.css
```

### Step 2: Update Vite Config

Edit `frontend/vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

### Step 3: Update Imports in React Components

Change all imports from:
```javascript
import { Button } from "@/components/ui/button"
```

To match the new structure (@ now points to src/):
```javascript
import { Button } from "@/components/ui/button"  // Still works!
```

### Step 4: Install Missing Dependencies

```powershell
cd C:\WaterElecTracking\frontend
npm install tailwindcss-animate
```

### Step 5: Start the Application

```powershell
# Option 1: Start both frontend and backend
cd C:\WaterElecTracking
npm run dev

# Option 2: Start separately
# Terminal 1 - Backend
cd C:\WaterElecTracking\backend
npm run dev

# Terminal 2 - Frontend  
cd C:\WaterElecTracking\frontend
npm run dev
```

## Simplified Alternative Approach

If you want to keep the components/hooks/lib at root level (shared):

### Update frontend/vite.config.js:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../'),  // Points to root
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

This way components/hooks/lib stay at root and can be shared.

## Access Points

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000  
- **API Health**: http://localhost:5000/api/health

## File Structure After Setup

```
WaterElecTracking/
├── frontend/
│   ├── src/
│   │   ├── components/     # (copied from root)
│   │   ├── hooks/         # (copied from root)
│   │   ├── lib/           # (copied from root)
│   │   ├── context/       # (copied from root)
│   │   ├── pages/         # ✅ Created
│   │   ├── layouts/       # ✅ Created
│   │   ├── App.jsx        # ✅ Created
│   │   ├── main.jsx       # ✅ Updated
│   │   └── globals.css    # ✅ Copied
│   ├── tailwind.config.js # ✅ Created
│   ├── postcss.config.js  # ✅ Created
│   └── vite.config.js     # ✅ Updated
├── backend/               # ✅ Ready
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── README.md             # ✅ Created
├── MIGRATION.md          # ✅ Created
└── package.json          # ✅ Updated
```

## Next Steps

1. Follow Step 1 above to copy shared resources OR update vite config for root-level sharing
2. Run `npm run dev` from root directory
3. Application should start on http://localhost:5173
4. Test all routes: /, /login, /signup, /dashboard

## Troubleshooting

**If components not found**: Make sure vite.config.js alias is correctly pointing to where your components are.

**If styles not loading**: Ensure globals.css is imported in main.jsx and tailwind.config.js content paths are correct.

**If API calls fail**: Verify backend is running on port 5000 and proxy is configured in vite.config.js.

---

**You're almost there! Just a few more commands and you'll be running!** 🚀
