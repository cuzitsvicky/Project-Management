# Deployment Guide

This guide covers deploying both the frontend (React/Vite) and backend (Node.js/Express) of the Project Management application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Platform-Specific Guides](#platform-specific-guides)

---

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (for cloud database) or MongoDB installed locally
- Git repository
- Accounts on deployment platforms (Vercel, Netlify, Railway, Render, etc.)

---

## Backend Deployment

### Option 1: Railway (Recommended for Backend)

#### Step 1: Prepare Backend for Deployment

1. **Create `.env` file** (if not exists):
   ```bash
   cd backend
   touch .env
   ```

2. **Add environment variables** to `.env`:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=production
   ```

3. **Update `server.js`** to handle production port:
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```

4. **Ensure `package.json` has start script**:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

#### Step 2: Deploy to Railway

1. **Sign up/Login** to [Railway](https://railway.app)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo" (connect your GitHub account)
   - Select your repository

3. **Configure Deployment**:
   - Railway will auto-detect Node.js
   - Set root directory to `backend`
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `PORT`: 3000 (Railway will auto-assign, but set for consistency)
     - `NODE_ENV`: production

4. **Deploy**:
   - Railway will automatically deploy
   - Note the generated URL (e.g., `https://your-app.railway.app`)

---

### Option 2: Render

#### Step 1: Prepare Backend

Same as Railway steps 1-3 above.

#### Step 2: Deploy to Render

1. **Sign up/Login** to [Render](https://render.com)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service**:
   - **Name**: project-management-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free or Paid

4. **Add Environment Variables**:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: production
   - `PORT`: 3000

5. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy
   - Note the URL (e.g., `https://your-app.onrender.com`)

---

### Option 3: Heroku

#### Step 1: Install Heroku CLI

```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
# Or use npm
npm install -g heroku
```

#### Step 2: Login to Heroku

```bash
heroku login
```

#### Step 3: Create Heroku App

```bash
cd backend
heroku create your-app-name-backend
```

#### Step 4: Add Environment Variables

```bash
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set NODE_ENV=production
```

#### Step 5: Deploy

```bash
git add .
git commit -m "Prepare for deployment"
git push heroku main
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended for Frontend)

#### Step 1: Build Frontend Locally (Test)

```bash
cd frontend
npm run build
```

This creates a `dist` folder with production-ready files.

#### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```
   
   Or use Vercel Dashboard:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

4. **Add Environment Variables**:
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com`

5. **Update API URLs in Frontend**:
   - Update `frontend/src/pages/LandingPage.jsx`:
     ```javascript
     const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
     ```
   - Update `frontend/src/pages/AdminPanel.jsx`:
     ```javascript
     const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
     ```

---

### Option 2: Netlify

#### Step 1: Prepare Frontend

1. **Create `netlify.toml`** in `frontend` directory:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Update API URLs** (same as Vercel step 5)

#### Step 2: Deploy to Netlify

1. **Install Netlify CLI** (optional):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   cd frontend
   netlify deploy --prod
   ```
   
   Or use Netlify Dashboard:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select repository
   - Configure:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

4. **Add Environment Variables**:
   - Site Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com`

---

### Option 3: GitHub Pages

#### Step 1: Install gh-pages

```bash
cd frontend
npm install --save-dev gh-pages
```

#### Step 2: Update package.json

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/project-management"
}
```

#### Step 3: Deploy

```bash
npm run deploy
```

---

## Environment Variables

### Backend Environment Variables

Create `.env` file in `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# CORS (if needed)
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend Environment Variables

Create `.env` file in `frontend` directory:

```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

**Important**: 
- Vite requires `VITE_` prefix for environment variables
- Access using `import.meta.env.VITE_API_URL`

---

## Database Setup

### MongoDB Atlas (Cloud Database - Recommended)

1. **Create Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Cluster**:
   - Click "Build a Database"
   - Choose free tier (M0)
   - Select region closest to your deployment

3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password (save these!)

4. **Whitelist IP Address**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - For production: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For development: Add your current IP

5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name

6. **Update Backend**:
   - Add connection string to backend `.env` as `MONGODB_URI`

---

## Platform-Specific Guides

### Full Stack Deployment on Railway

Railway can host both frontend and backend:

1. **Deploy Backend** (as described above)

2. **Deploy Frontend**:
   - Create new service in same project
   - Select frontend directory
   - Set build command: `npm run build`
   - Set start command: `npx serve -s dist -l 3000`
   - Add environment variable: `VITE_API_URL` = backend URL

---

## Post-Deployment Checklist

### Backend
- [ ] Environment variables set correctly
- [ ] MongoDB connection working
- [ ] CORS configured for frontend URL
- [ ] API endpoints accessible
- [ ] File uploads working (check uploads directory)

### Frontend
- [ ] Environment variables set correctly
- [ ] API URL points to deployed backend
- [ ] Images loading correctly (check image paths)
- [ ] All routes working
- [ ] Forms submitting correctly

---

## Troubleshooting

### Backend Issues

**Problem**: Cannot connect to MongoDB
- **Solution**: Check MongoDB Atlas IP whitelist and connection string

**Problem**: CORS errors
- **Solution**: Update CORS in `server.js`:
  ```javascript
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }));
  ```

**Problem**: File uploads not working
- **Solution**: Ensure `uploads` directory exists and has write permissions

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Check `VITE_API_URL` environment variable and CORS settings

**Problem**: Images not loading
- **Solution**: Update image URLs to use full backend URL:
  ```javascript
  src={`${API_BASE_URL.replace('/api', '')}${project.image}`}
  ```

**Problem**: 404 on refresh
- **Solution**: Add redirect rule (Vercel/Netlify handle this automatically)

---

## Quick Deploy Commands

### Backend (Railway)
```bash
cd backend
# Push to GitHub, Railway auto-deploys
git add .
git commit -m "Deploy backend"
git push origin main
```

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

---

## Recommended Deployment Stack

- **Backend**: Railway or Render (easy MongoDB integration)
- **Frontend**: Vercel or Netlify (optimized for static sites)
- **Database**: MongoDB Atlas (free tier available)

---

## Security Notes

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** (most platforms do this automatically)
4. **Restrict MongoDB IP access** in production
5. **Use strong database passwords**
6. **Keep dependencies updated**

---

## Support

For issues:
1. Check platform-specific documentation
2. Review error logs in deployment dashboard
3. Test locally with production environment variables
4. Check CORS and network access settings

