# Correct Deployment Instructions

This document provides the correct instructions for deploying the Pesante Enterprises application to Render. This approach uses a single service to build and serve both the frontend and the backend, which is the correct way to handle SPA routing in this setup.

## 1. 📂 File Changes

The following files have been modified:

-   `backend/index.js`: The path to the frontend's `dist` directory has been made more robust using `path.resolve`.
-   `render.yaml`: The file has been simplified to use a single `pesante-backend` service. This service now builds both the frontend and the backend, and it serves the frontend's static files.

## 2. 🚀 Deployment Steps

To deploy the application, follow these steps:

1.  **Commit and push your changes to GitHub**:

    ```bash
    git add .
    git commit -m "Fix: Correctly configure single-service deployment"
    git push
    ```

2.  **Delete and re-create the service on Render**:
    -   Go to your Render dashboard and delete the existing services for this application.
    -   Create a new "Blueprint" service.
    -   Connect your GitHub repository.
    -   Render will automatically detect and use the `render.yaml` file.
    -   Review the service and click "Approve" to create it.

3.  **Monitor the deployment**:
    -   Open your Render dashboard and navigate to your new service.
    -   You should see a new deployment in progress.
    -   You can monitor the build and runtime logs to ensure that the deployment is successful.

## 3. ✅ Verification

Once the deployment is complete, you can test the application to verify that the "404 Not Found" error is resolved.

-   Navigate to `https://<your-render-app-name>.onrender.com`.
-   Click on the navigation links to go to different pages.
-   Refresh the page on any route (e.g., `/properties`, `/admin`).
-   The page should reload correctly without any "404 Not Found" errors.

By following these instructions, you will have a correctly deployed application with a single service that handles both the backend and the frontend, and the SPA routing will work as expected.
