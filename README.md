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
Method	Endpoint	Description
GET	/api/properties	Fetch active property listings
POST	/api/inquiries	Submit user inquiries
POST	/api/appointments	Schedule viewings
Additional routes available for admin actions and database management.

👨‍💻 Usage
Visit http://localhost:5173

Use Navbar to navigate: Home, Services, About, Contact, Properties, Appointment

Admin login portal at /admin (localStorage-based auth)

Properties filter in real-time using Context API (PropertiesContext.jsx)

👥 Contribution Guidelines
Fork the repo and create a feature branch.

Write clear, testable code (consider ESLint/Prettier setup).

Submit a pull request with details and screenshots if applicable.

Collaborate via Issues and Pull Requests.

📄 License
Licensed under the ISC License. See LICENSE for terms.
