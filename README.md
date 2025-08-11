# PESANTE ENTERPRISES

PESANTE ENTERPRISES is a full-stack real estate application designed to showcase and manage property listings, handle inquiries and appointments, and provide an admin portal for backend operations. Built with modern technologies including React (Vite), Node.js/Express, and MongoDB Atlas, the app supports real-time filtering and secure admin access.

## 🌐 Live Application

**Frontend**: https://pesante-enterprices-main-1.onrender.com
**Backend API**: https://pesante-enterprices-main.onrender.com/api
**Admin Portal**: https://pesante-enterprices-main-1.onrender.com/admin

**Admin Credentials:**
- Username: `admin`
- Password: `pesante254`

## 🌟 Enhanced Features

### 🗓️ Advanced Appointment Management
- Complete form fields: Client name, phone, property selection, date/time
- Status management: Pending, Confirmed, Cancelled with color-coded badges
- Professional table display with property linking
- Full CRUD operations with proper validation

### 🏠 Property Management
- Dynamic property listings with real-time filtering by location, price, and type
- Image upload and preview functionality
- Status toggle (Active/Inactive/Sold/Pending)
- Comprehensive property details management

### 📬 Inquiry System
- Contact form integration
- Admin dashboard for inquiry management
- RESTful API submission

### 🔐 Security & Authentication
- JWT-based authentication with 24-hour expiration
- Protected admin routes
- CORS configuration for production
- Environment-based configuration

## 🗂️ Project Structure
```
PESANTE_ENTERPRICES/
├── backend/               # Node.js/Express backend
│   ├── models/            # Mongoose models (Property, Inquiry, Appointment)
│   ├── .env               # MongoDB Atlas URI and config
│   ├── index.js           # Entry point of backend server
│   └── package.json       # Backend dependencies
└── frontend/              # React (Vite) frontend
    ├── src/
    │   ├── components/    # All React components (Pages, Navbar, Context)
    │   ├── App.jsx        # Main app component
    │   └── main.jsx       # Root React renderer
    ├── public/            # Static assets
    ├── vite.config.js     # Proxy config for backend API
    └── package.json       # Frontend dependencies
```

## 🚀 Local Development Setup

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pesante_db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=pesante254
JWT_SECRET=your_jwt_secret
PORT=3001
FRONTEND_URLS=http://localhost:5174
```

Start server:
```bash
node index.js
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
```

Start development server:
```bash
npm run dev
```

## 📡 API Endpoints

### Public Routes (No Authentication Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/properties` | Fetch active property listings |
| POST | `/api/inquiries` | Submit user inquiries |
| POST | `/api/appointments` | Schedule viewings |

### Protected Routes (Admin Authentication Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin authentication |
| POST | `/api/admin/change-password` | Change admin password |
| POST | `/api/properties` | Create new property |
| PUT | `/api/properties/:id` | Update property |
| DELETE | `/api/properties/:id` | Delete property |
| GET | `/api/appointments` | Get all appointments |
| PUT | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id` | Delete appointment |
| GET | `/api/inquiries` | Get all inquiries |
| PUT | `/api/inquiries/:id` | Update inquiry |
| DELETE | `/api/inquiries/:id` | Delete inquiry |

## 🚀 Deployment

The application is deployed on Render with the following configuration:

### Backend (Node.js Service)
- **URL**: https://pesante-enterprices-main.onrender.com
- **Environment**: Production
- **Database**: MongoDB Atlas
- **CORS**: Configured for frontend domain

### Frontend (Static Site)
- **URL**: https://pesante-enterprices-main-1.onrender.com
- **Build**: Vite production build
- **API Integration**: Points to backend service

## 🛠️ Technology Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Context API for state management

**Backend:**
- Node.js with Express
- MongoDB Atlas (Cloud Database)
- JWT for authentication
- CORS for cross-origin requests
- Helmet for security headers

**Deployment:**
- Render (Both frontend and backend)
- Environment-based configuration
- Production-ready setup

## 📄 License
Licensed under the ISC License.