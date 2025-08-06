# 🚀 Pesante Enterprise - Routing Setup Guide

## 📋 Overview

This guide explains the routing setup for the Pesante Enterprise application, which includes both frontend and backend routing configurations.

## 🔧 Backend Routing (Port 5000)

### API Routes Structure

```
POST   /api/admin/login              - Admin authentication
POST   /api/admin/change-password    - Change admin password
GET    /api/health                   - Health check
GET    /api/envcheck                 - Environment variables check

# Properties Routes
GET    /api/properties               - Get all properties
POST   /api/properties               - Create new property
PUT    /api/properties/:id           - Update property
DELETE /api/properties/:id           - Delete property

# Appointments Routes
GET    /api/appointments             - Get all appointments
POST   /api/appointments             - Create new appointment
PUT    /api/appointments/:id         - Update appointment
DELETE /api/appointments/:id         - Delete appointment

# Inquiries Routes
GET    /api/inquiries                - Get all inquiries
POST   /api/inquiries                - Create new inquiry
PUT    /api/inquiries/:id            - Update inquiry
DELETE /api/inquiries/:id            - Delete inquiry
```

### Authentication
- All routes except `/api/health`, `/api/envcheck`, and `/api/admin/login` require JWT authentication
- Token should be sent in Authorization header: `Bearer <token>`

## 🌐 Frontend Routing (Port 5173)

### React Router Routes

```
/                    - Home page (Hero, Services, About, Contact)
/properties          - Properties listing page
/appointment         - Appointment booking page
/admin               - Admin portal (with login)
```

### Navigation Structure
- **Navbar**: Fixed navigation with smooth scrolling to sections
- **Home**: Single page with multiple sections
- **Properties**: Dedicated page with filtering
- **Appointment**: Booking form
- **Admin**: Protected admin interface

## 🚀 How to Run

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```
Backend will run on: `http://localhost:5000`

### 2. Start Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: `http://localhost:5173`

### 3. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔄 API Proxy Configuration

The frontend uses Vite's proxy configuration to forward API requests:

```javascript
// frontend/vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:5000' // 🔁 Local backend proxy for API routes
  }
}
```

This means all `/api/*` requests from the frontend are automatically forwarded to the backend.

## 🛠️ Key Fixes Applied

### 1. Port Configuration
- **Backend**: Changed from port 4000 to 5000
- **Frontend Proxy**: Updated to point to port 5000

### 2. MongoDB ID Fixes
- Fixed property ID references from `p.id` to `p._id`
- Updated all CRUD operations to use MongoDB's `_id` field

### 3. Missing Backend Routes
- Added PUT and DELETE routes for properties
- Added GET, PUT, DELETE routes for appointments
- Added GET, PUT, DELETE routes for inquiries
- Added change password route

### 4. Frontend API Integration
- Fixed AdminPortal component to use correct IDs
- Updated all CRUD operations to work with MongoDB

## 🔐 Authentication Flow

1. **Login**: POST to `/api/admin/login` with username/password
2. **Token Storage**: JWT token stored in localStorage
3. **Auto-Attachment**: Axios interceptor adds token to all requests
4. **Protected Routes**: All admin operations require valid token

## 📱 Component Routing

### AdminPortal Component
- **Properties Tab**: CRUD operations for property listings
- **Appointments Tab**: Manage appointment bookings
- **Inquiries Tab**: Handle customer inquiries
- **Password Change**: Admin password management

### Properties Component
- **Filtering**: By location, price, and type
- **Display**: Grid layout with property cards
- **Status**: Only shows 'Active' properties

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :5000
   # Kill the process if needed
   taskkill /PID <process_id> /F
   ```

2. **CORS Issues**
   - Backend CORS is configured for frontend URLs
   - Check `FRONTEND_URLS` environment variable

3. **MongoDB Connection**
   - Ensure MongoDB is running
   - Check connection string in `config.js`

4. **API 404 Errors**
   - Verify backend is running on port 5000
   - Check proxy configuration in `vite.config.js`

### Environment Variables
Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=pesante254
FRONTEND_URLS=http://localhost:5173
```

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": [...],
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## 🔄 Development Workflow

1. **Backend Changes**: Restart backend server
2. **Frontend Changes**: Hot reload (automatic)
3. **Database Changes**: Restart backend server
4. **Environment Changes**: Restart both servers

## 📝 Notes

- All routes are properly configured with authentication where needed
- MongoDB integration is complete with proper ID handling
- Frontend routing uses React Router v6
- Backend uses Express.js with comprehensive middleware
- CORS is properly configured for development
- Rate limiting is enabled for API protection 