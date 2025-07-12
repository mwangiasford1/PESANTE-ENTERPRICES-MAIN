# Deploying Pesante Enterprises to Render

This guide will help you deploy your Pesante Enterprises application to Render.

## Prerequisites

1. A GitHub account
2. A Render account (free tier available)
3. Your code pushed to a GitHub repository

## Step 1: Prepare Your Repository

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git remote add origin https://github.com/yourusername/PESANTE-ENTERPRICES-MAIN.git
   git push -u origin main
   ```

## Step 2: Deploy on Render

### Option A: Using render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file and create:
   - A MySQL database
   - A backend web service
   - A frontend static site

### Option B: Manual Deployment

#### 1. Create MySQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "MySQL"
3. Choose "Free" plan
4. Name: `pesante-db`
5. Database: `pesante_db`
6. User: `pesante_user`
7. Note down the connection details

#### 2. Deploy Backend

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `pesante-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `DB_HOST`: (from your MySQL database)
   - `DB_USER`: (from your MySQL database)
   - `DB_PASSWORD`: (from your MySQL database)
   - `DB_NAME`: `pesante_db`
   - `DB_PORT`: `3306`
   - `CONTACT_EMAIL`: (your email)
   - `CONTACT_EMAIL_PASS`: (your email password)

#### 3. Deploy Frontend

1. Click "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `pesante-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free

4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-service-name.onrender.com`

## Step 3: Database Setup

After deployment, you'll need to set up your database tables. You can do this by:

1. Temporarily changing the backend code to sync the database
2. Or manually creating the tables using the models

## Step 4: Update Frontend API URL

Make sure your frontend is configured to use the correct backend URL. The environment variable `VITE_API_URL` should point to your deployed backend service.

## Environment Variables Reference

### Backend Environment Variables:
- `NODE_ENV`: Set to `production`
- `DB_HOST`: MySQL database host
- `DB_USER`: MySQL database username
- `DB_PASSWORD`: MySQL database password
- `DB_NAME`: MySQL database name
- `DB_PORT`: MySQL database port (usually 3306)
- `CONTACT_EMAIL`: Email for contact form
- `CONTACT_EMAIL_PASS`: Email password for contact form

### Frontend Environment Variables:
- `VITE_API_URL`: Backend service URL

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check environment variables are set correctly
   - Ensure database is created and accessible

2. **Build Failed**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json

3. **Frontend Can't Connect to Backend**
   - Verify `VITE_API_URL` is set correctly
   - Check CORS settings in backend

4. **Email Not Working**
   - Verify email credentials are correct
   - Check if your email provider allows app passwords

## Support

If you encounter issues:
1. Check Render deployment logs
2. Verify all environment variables are set
3. Test locally with production environment variables 