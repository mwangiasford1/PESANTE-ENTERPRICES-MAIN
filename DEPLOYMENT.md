# Deploying Pesante Enterprises to Render (MongoDB Atlas Edition)

This guide helps you deploy the Pesante Enterprises full-stack app to Render using the `render.yaml` file for "Infrastructure as Code" deployments.

## 🧰 Prerequisites

-   GitHub account
-   Render account (free tier is fine)
-   Project pushed to GitHub

## 📦 Step 1: Prepare Your Repository

Push your code to GitHub:

```bash
git add .
git commit -m "Configure for render.yaml deployment"
git push
```

## ☁️ Step 2: Set Up on Render

1.  **Create a new "Blueprint" service** on Render.
2.  **Connect your GitHub repository**.
3.  Render will automatically detect and use the `render.yaml` file.
4.  **Review the services** that will be created. You should see a single `pesante-backend` service.
5.  **Click "Approve"** to create the services.

Render will now build and deploy your application based on the instructions in the `render.yaml` file.

## 🧠 Step 3: Backend Configuration Notes

-   Your backend must use `mongoose.connect(process.env.MONGO_URI)` to connect to Atlas.
-   The `render.yaml` file contains all the necessary environment variables. You may need to update the `MONGO_URI` with your own MongoDB Atlas connection string.

## 🔐 Environment Variables Reference

The following environment variables are defined in the `render.yaml` file:

-   `NODE_ENV`: `production`
-   `MONGO_URI`: Your MongoDB Atlas connection string
-   `ADMIN_USERNAME`: `admin`
-   `ADMIN_PASSWORD`: `pesante254`
-   `JWT_SECRET`: `pesanteSuperSecretKey`
-   `CONTACT_EMAIL`: `mwangiasford12@gmail.com`
-   `CONTACT_EMAIL_PASS`: `mwangi2024`
-   `FRONTEND_URLS`: `https://pesante-enterprices-main-1.onrender.com,http://localhost:5174`

## 🧹 Troubleshooting

-   **Build Failures**: Check the build logs on Render for any errors. The most common issues are related to dependency installation or the build command.
-   **Application Not Starting**: Check the runtime logs on Render for any errors. The most common issues are related to incorrect environment variables or database connection problems.
-   **"Not Found" Errors**: If you're still seeing "Not Found" errors, ensure that the `postinstall` script in `frontend/package.json` is correctly building the frontend and that the `backend/index.js` file is serving the static files from the `frontend/dist` directory.

