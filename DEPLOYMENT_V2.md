# Correct Deployment Instructions (Two-Service)

This document provides the correct instructions for deploying the Pesante Enterprises application to Render using a two-service approach. This is the standard and recommended way to deploy a full-stack application on Render.

## 1. 📂 File Changes

The following files have been modified:

-   `backend/index.js`: The code that serves the frontend static files has been removed.
-   `render.yaml`: The file has been updated to use a two-service configuration:
    -   `pesante-backend`: A "Web Service" for the backend API.
    -   `pesante-frontend`: A "Static Site" for the frontend.

## 2. 🚀 Deployment Steps

To deploy the application, follow these steps:

1.  **Commit and push your changes to GitHub**:

    ```bash
    git add .
    git commit -m "Fix: Revert to two-service deployment"
    git push
    ```

2.  **Delete and re-create the services on Render**:
    -   Go to your Render dashboard and delete the existing services for this application.
    -   Create a new "Blueprint" service.
    -   Connect your GitHub repository.
    -   Render will automatically detect and use the `render.yaml` file.
    -   Review the services and click "Approve" to create them. You should see two services: `pesante-backend` and `pesante-frontend`.

3.  **Monitor the deployment**:
    -   Open your Render dashboard and navigate to your new services.
    -   You should see new deployments in progress for both services.
    -   You can monitor the build and runtime logs to ensure that the deployments are successful.

## 3. ✅ Verification

Once the deployments are complete, you can test the application to verify that the "404 Not Found" error is resolved.

-   Navigate to the URL of your `pesante-frontend` static site. You can find this URL in your Render dashboard.
-   Click on the navigation links to go to different pages.
-   Refresh the page on any route (e.g., `/properties`, `/admin`).
-   The page should reload correctly without any "404 Not Found" errors.

By following these instructions, you will have a correctly deployed application with two separate services for the backend and frontend. This is a more robust and scalable approach, and it will resolve the routing issues you have been experiencing.
