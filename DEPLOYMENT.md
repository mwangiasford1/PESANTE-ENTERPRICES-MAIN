Deploying Pesante Enterprises to Render (MongoDB Atlas Edition)
This guide helps you deploy the Pesante Enterprises full-stack app to Render, using MongoDB Atlas for database management.

🧰 Prerequisites
GitHub account

Render account (free tier is fine)

Project pushed to GitHub

📦 Step 1: Prepare Your Repository
Push your code to GitHub:

bash
git add .
git commit -m "Prepare for Render deployment with Atlas"
git remote add origin https://github.com/yourusername/PESANTE-ENTERPRICES-MAIN.git
git push -u origin main
☁️ Step 2: Set Up on Render
🔧 Deploy Manually (No render.yaml required)
1. Create the MongoDB Atlas Cluster
Go to MongoDB Atlas

Create a free-tier cluster

Create a database named pesante_db

Create a collection named properties

Add a database user with password

Whitelist IP (0.0.0.0/0) or specify Render IP

2. Deploy Backend
On Render Dashboard, click “New” → “Web Service”

Connect your GitHub repo

Configure settings:

Name: pesante-backend

Environment: Node

Build Command: cd backend && npm install

Start Command: cd backend && npm start

Plan: Free

Add Environment Variables:

NODE_ENV: production

MONGO_URI: your MongoDB Atlas connection string

PORT: 5000

CONTACT_EMAIL: you@example.com

CONTACT_EMAIL_PASS: your email password or app password

3. Deploy Frontend
Click “New” → “Static Site”

Connect the same repo

Configure:

Name: pesante-frontend

Build Command: cd frontend && npm install && npm run build

Publish Directory: frontend/dist

Plan: Free

Add Environment Variable:

VITE_API_URL: https://pesante-backend.onrender.com

🧠 Step 3: Backend Configuration Notes
Your backend must use mongoose.connect(process.env.MONGO_URI) to connect to Atlas

If needed, temporarily enable debug logging to verify connection

Ensure your schema aligns with your frontend’s property structure

🔐 Environment Variables Reference
Backend:
NODE_ENV: production

MONGO_URI: MongoDB Atlas URI (replace password in URI properly)

PORT: 5000

CONTACT_EMAIL, CONTACT_EMAIL_PASS: For email features

Frontend:
VITE_API_URL: Full backend URL

🧹 Troubleshooting
Issue	Solution
Backend can't connect	Check IP whitelist and credentials in Atlas
Frontend can’t access API	Confirm VITE_API_URL matches Render backend URL
Properties not showing	Validate MongoDB seed data or replace dummy data with res.data
Email not sending	Check email config and app password; use Gmail app password if needed
