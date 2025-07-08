# PESANTE ENTERPRICES

## Overview
PESANTE ENTERPRICES is a full-stack application designed to manage property listings, inquiries, and appointments. It consists of a backend (Node.js/Express/Sequelize) and a frontend (React/Vite). The backend handles data storage and API endpoints, while the frontend provides a user-friendly interface for users and administrators.

## Features
- Property listing and management
- Inquiry submission and management
- Appointment scheduling
- Admin portal for managing properties, inquiries, and appointments

## Project Structure
```
PESANTE_ENTERPRICES/
  backend/           # Node.js/Express backend
    models/          # Sequelize models (Property, Inquiry, Appointment)
    config.js        # Database and environment config
    db.js            # Sequelize initialization
    index.js         # Main server file
    package.json     # Backend dependencies
  PESANTE-ENTERPRICES/ # React frontend
    src/             # React source code
      components/    # React components
      api.js         # API calls to backend
      App.jsx        # Main app component
    public/          # Static assets
    package.json     # Frontend dependencies
```

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- npm (v8+ recommended)
- MySQL (for backend database)

### Backend Setup
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env` and fill in your database credentials.
4. Run database migrations (if any) and start the server:
   ```sh
   node index.js
   ```
   The backend will run on the port specified in your `.env` (default: 3001).

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd PESANTE-ENTERPRICES
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The frontend will run on the port specified by Vite (default: 5173).

## Usage
- Access the frontend in your browser at `http://localhost:5173`.
- The frontend communicates with the backend API (ensure both are running).
- Use the admin portal for management features.

## API Overview (Backend)
- `GET /properties` - List all properties
- `POST /inquiries` - Submit an inquiry
- `POST /appointments` - Schedule an appointment
- Additional endpoints for admin management (see backend code for details)

## Contribution Guidelines
1. Fork the repository and create your branch from `main`.
2. Make your changes and add tests if applicable.
3. Ensure code style consistency (use ESLint/Prettier if configured).
4. Submit a pull request with a clear description of your changes.

## License
This project is licensed under the ISC License. See the LICENSE file for details. 