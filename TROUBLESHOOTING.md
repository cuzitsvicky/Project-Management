# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to fetch" Errors

**Symptoms:**
- Console shows `TypeError: Failed to fetch`
- API calls not working
- Data not loading

**Solutions:**

#### Check Environment Variables

1. **Frontend** - Verify `VITE_API_URL` is set:
   ```bash
   # In Vercel/Netlify dashboard, check Environment Variables
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

2. **Backend** - Verify `FRONTEND_URL` is set:
   ```bash
   # In Railway/Render dashboard
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

#### Check CORS Configuration

1. **Backend CORS** should allow your frontend URL:
   ```javascript
   // In backend/server.js
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

2. **Test CORS** by checking browser console:
   - Open browser DevTools → Network tab
   - Look for failed requests
   - Check if CORS error appears

#### Verify Backend is Running

1. **Check backend URL**:
   ```bash
   curl https://your-backend-url.railway.app/
   # Should return: {"message":"Project Management API is running"}
   ```

2. **Test API endpoint**:
   ```bash
   curl https://your-backend-url.railway.app/api/projects
   # Should return JSON array
   ```

#### Common Fixes

1. **Add frontend URL to backend CORS**:
   - Go to Railway/Render dashboard
   - Add environment variable: `FRONTEND_URL`
   - Value: Your frontend URL (e.g., `https://your-app.vercel.app`)
   - Redeploy backend

2. **Verify API URL in frontend**:
   - Check Vercel/Netlify environment variables
   - Ensure `VITE_API_URL` includes `/api` at the end
   - Example: `https://backend.railway.app/api` (not `https://backend.railway.app`)

3. **Check HTTPS**:
   - Both frontend and backend should use HTTPS in production
   - Mixed HTTP/HTTPS causes CORS issues

---

### 2. Images Not Loading

**Symptoms:**
- Project/client images show broken image icon
- Images return 404

**Solutions:**

1. **Check image paths**:
   ```javascript
   // Should be: https://backend-url.com/uploads/filename.jpg
   // Not: http://localhost:3000/uploads/filename.jpg
   ```

2. **Verify backend serves static files**:
   - Check `backend/server.js` has:
   ```javascript
   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
   ```

3. **Check file uploads directory**:
   - Ensure `backend/uploads/` directory exists
   - Files should be uploaded there

---

### 3. MongoDB Connection Issues

**Symptoms:**
- Backend crashes on startup
- "MongoDB connection error" in logs

**Solutions:**

1. **Check MongoDB Atlas**:
   - Verify IP whitelist includes `0.0.0.0/0` (all IPs)
   - Check database user credentials
   - Verify connection string format

2. **Test connection string**:
   ```bash
   # Should be in format:
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```

3. **Check environment variable**:
   ```bash
   # In Railway/Render
   MONGODB_URI=mongodb+srv://...
   ```

---

### 4. Environment Variables Not Working

**Symptoms:**
- Frontend still uses localhost URLs
- Backend CORS not working

**Solutions:**

1. **Vite requires `VITE_` prefix**:
   ```env
   # ✅ Correct
   VITE_API_URL=https://backend.com/api
   
   # ❌ Wrong
   API_URL=https://backend.com/api
   ```

2. **Rebuild after changing env vars**:
   - Vercel/Netlify auto-rebuilds
   - For local: Stop dev server, restart

3. **Check variable names**:
   - Frontend: `VITE_API_URL`
   - Backend: `FRONTEND_URL`, `MONGODB_URI`, `PORT`

---

### 5. Deployment Platform Specific Issues

#### Railway

**Issue**: Backend not starting
- Check logs in Railway dashboard
- Verify `package.json` has `start` script
- Check root directory is set to `backend`

**Issue**: Environment variables not loading
- Add variables in Railway dashboard
- Redeploy after adding variables

#### Vercel

**Issue**: 404 on page refresh
- Already handled by `vercel.json`
- Check redirects configuration

**Issue**: Build failing
- Check build logs
- Verify Node.js version
- Check for TypeScript errors

#### Netlify

**Issue**: SPA routing not working
- Ensure `netlify.toml` has redirects
- Check `_redirects` file

---

### 6. Debugging Steps

1. **Check Browser Console**:
   - Look for error messages
   - Check Network tab for failed requests
   - Verify API calls are going to correct URL

2. **Check Backend Logs**:
   - Railway: View logs in dashboard
   - Render: Check logs tab
   - Look for CORS errors, MongoDB errors

3. **Test API Directly**:
   ```bash
   # Test backend health
   curl https://your-backend.com/
   
   # Test API endpoint
   curl https://your-backend.com/api/projects
   ```

4. **Verify Environment Variables**:
   ```bash
   # In backend, add temporary log:
   console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
   console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
   ```

---

### 7. Quick Fixes Checklist

- [ ] Backend `FRONTEND_URL` includes your frontend domain
- [ ] Frontend `VITE_API_URL` points to backend with `/api`
- [ ] Both use HTTPS in production
- [ ] MongoDB Atlas IP whitelist allows all (`0.0.0.0/0`)
- [ ] Environment variables are set in deployment platform
- [ ] Backend is running and accessible
- [ ] CORS allows your frontend origin
- [ ] Images use full backend URL, not localhost

---

## Still Having Issues?

1. **Check deployment logs** for specific errors
2. **Test locally** with production environment variables
3. **Verify** all URLs are correct (no typos)
4. **Check** browser console and network tab
5. **Review** platform-specific documentation

