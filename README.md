PESANTE ENTERPRISES is a full-stack real estate application designed to showcase and manage property listings, handle inquiries and appointments, and provide an admin portal for backend operations. Built with modern technologies including React (Vite), Node.js/Express, and MongoDB Atlas, the app supports real-time filtering and secure admin access.

🌟 Features
🔎 Dynamic property listings with real-time filtering by location, price, and type

🗓️ Appointment scheduling and contact form integration

📬 Inquiry submission via RESTful API

🔐 Admin portal with login/logout and local state management

📦 MongoDB Atlas integration via Axios and Context API

🎯 Scrollable sections with navigation via React Router

🗂️ Project Structure
PESANTE_ENTERPRICES/
├── backend/               # Node.js/Express backend
│   ├── models/            # Mongoose models (Property, Inquiry, Appointment)
│   ├── routes/            # API route handlers
│   ├── .env               # MongoDB URI and config
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
⚙️ Setup Instructions

## 🚀 Quick Start

### Option 1: Use the provided scripts
```bash
# Windows Batch
start-servers.bat

# PowerShell
.\start-servers.ps1
```

### Option 2: Manual setup
🧩 Prerequisites
Node.js v16+

npm v8+

MongoDB Atlas account and cluster setup

🔙 Backend Setup
Navigate to the backend directory:

bash
cd backend
Install dependencies:

bash
npm install
Create a .env file and configure:

env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
Start the server:

bash
node index.js
🎨 Frontend Setup
Navigate to the frontend:

bash
cd frontend
Install dependencies:

bash
npm install
Configure Vite proxy (vite.config.js):

js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
}
Run the development server:

bash
npm run dev
📡 API Endpoints

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

👨‍💻 Usage

### 🌐 Frontend Routes
- **Home** (`/`): Hero, Services, About, Contact sections
- **Properties** (`/properties`): Property listings with filtering
- **Appointment** (`/appointment`): Booking form for property viewings
- **Admin Portal** (`/admin`): Protected admin interface

### 🔐 Authentication
- **Public Access**: Properties viewing, appointment booking, inquiry submission
- **Admin Access**: Property management, appointment management, inquiry management
- **Login**: Admin portal uses localStorage-based authentication

### 🎯 Features
- Real-time property filtering by location, price, and type
- Responsive navigation with smooth scrolling
- Admin portal with CRUD operations
- MongoDB integration with proper ID handling

👥 Contribution Guidelines
Fork the repo and create a feature branch.

Write clear, testable code (consider ESLint/Prettier setup).

Submit a pull request with details and screenshots if applicable.

Collaborate via Issues and Pull Requests.

📄 License
Licensed under the ISC License. See LICENSE for terms.
