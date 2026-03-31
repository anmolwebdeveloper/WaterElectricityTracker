# WattsFlow - Render Deployment Guide

This guide will help you deploy the WattsFlow application to Render.

## Prerequisites

- GitHub account with repository pushed
- Render account (create at https://render.com)
- MongoDB Atlas account (for production MongoDB) - https://www.mongodb.com/cloud/atlas
- (Optional) Google OAuth credentials - https://console.developers.google.com
- (Optional) Twilio account for SMS - https://www.twilio.com/console

## Pre-Deployment Checklist

- [ ] All environment variables are configured in `.env.example` files
- [ ] Backend `.env` file is NOT committed to GitHub (should be in `.gitignore`)
- [ ] Frontend `.env` file is NOT committed to GitHub
- [ ] `render.yaml` is configured and committed
- [ ] All dependencies in `package.json` are up to date
- [ ] Database models are properly defined
- [ ] API routes are properly configured
- [ ] CORS is configured for your domain
- [ ] All sensitive data is in environment variables

## Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a Database User
4. Whitelist all IPs (0.0.0.0/0)
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/wattsflow?retryWrites=true&w=majority`)

## Step 2: Prepare Environment Variables

### Backend Environment Variables needed on Render:

```
PORT=10000 (Render default)
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wattsflow?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend-domain.onrender.com
JWT_SECRET=generate-secure-random-string
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your-google-client-id (if using Google OAuth)
GOOGLE_CLIENT_SECRET=your-google-client-secret (if using Google OAuth)
GOOGLE_CALLBACK_URL=https://your-backend-domain.onrender.com/api/auth/google/callback
TWILIO_ACCOUNT_SID=your-twilio-sid (if using Twilio)
TWILIO_AUTH_TOKEN=your-twilio-token (if using Twilio)
TWILIO_PHONE_NUMBER=your-twilio-phone (if using Twilio)
```

### Frontend Environment Variables needed on Render:

```
VITE_API_URL=https://your-backend-domain.onrender.com
```

### Generate Secure JWT Secret

Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. Push your code to GitHub with `render.yaml` in the root directory
2. Go to https://render.com/dashboard
3. Click "New +" > "Blueprint" or "Multi-Service Blueprint"
4. Connect your GitHub repository
5. Select the branch to deploy
6. Click "Deploy"
7. Fill in the environment variables for both services

### Option B: Manual Deployment

#### Deploy Backend:

1. Go to https://render.com/dashboard
2. Click "New +" > "Web Service"
3. Select your GitHub repository
4. Configure:
   - **Name**: `wattsflow-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Health Check Path**: `/api/health`
5. Add Environment Variables (copy from Step 2)
6. Click "Create Web Service"

#### Deploy Frontend:

1. Go to https://render.com/dashboard
2. Click "New +" > "Static Site"
3. Select your GitHub repository
4. Configure:
   - **Name**: `wattsflow-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
5. Click "Create Static Site"
6. After deployment:
   - Go to Site Settings
   - Add the following to "Redirects/Rewrites":
     - Source: `/*`
     - Destination: `/index.html`
     - Status Code: `200` (this is important for React Router)

## Step 4: Post-Deployment Configuration

### Update CORS and Callbacks

After both services are deployed, you'll have URLs like:
- Frontend: `https://wattsflow-frontend.onrender.com`
- Backend: `https://wattsflow-backend.onrender.com`

Update the following in Render Environment Variables:

**Backend:**
- `FRONTEND_URL=https://wattsflow-frontend.onrender.com`
- `GOOGLE_CALLBACK_URL=https://wattsflow-backend.onrender.com/api/auth/google/callback` (if applicable)

**Frontend:** (if needed)
- `VITE_API_URL=https://wattsflow-backend.onrender.com`

## Step 5: Verify Deployment

1. Visit your frontend URL
2. Check the Network tab in DevTools to verify API calls go to the correct backend URL
3. Test login/authentication flow
4. Test any features that require backend API calls

## Troubleshooting

### Backend not starting
- Check logs in Render dashboard
- Verify MongoDB connection string is correct
- Ensure all required environment variables are set
- Check that `server.js` is in the backend directory

### Frontend not loading
- Check if build was successful (look at logs)
- Verify the Static Site redirection is set for React Router
- Check if `dist` folder exists after build

### API calls failing
- Verify `FRONTEND_URL` is set correctly in backend
- Check CORS errors in browser console
- Ensure backend health check passes (`/api/health`)

### Database connection issues
- Verify MongoDB URI is correct
- Check that IP whitelist includes 0.0.0.0/0 in MongoDB Atlas
- Test connection string locally first

## Maintenance

### Viewing Logs
1. Go to your service in Render dashboard
2. Click "Logs" tab to see real-time logs

### Redeploying
- Push new code to GitHub - Render will automatically redeploy
- Or manually trigger by clicking "Redeploy" in the service settings

### Managing Environment Variables
1. Go to service Settings
2. Scroll to "Environment"
3. Edit or add variables
4. Changes take effect after redeployment

## Security Checklist

- [ ] `.env` files are in `.gitignore` and never committed
- [ ] JWT_SECRET is a long, random string
- [ ] MONGODB_URI uses strong password
- [ ] Google OAuth callback URL matches deployed URL
- [ ] Helmet security headers are enabled (included in server.js)
- [ ] CORS is properly configured for allowed origins
- [ ] All API endpoints validate and authenticate requests

## Performance Tips

- Consider using Render's database to store cache
- Implement API response caching where appropriate
- Monitor MongoDB performance and optimize queries
- Consider upgrading to higher plan if hitting resource limits

## Additional Resources

- Render Documentation: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Express.js: https://expressjs.com/
- Vite: https://vitejs.dev/
- React Router: https://reactrouter.com/

## Need Help?

- Check Render Support: https://render.com/support
- Review Render Docs: https://render.com/docs
- Check application logs for specific errors
