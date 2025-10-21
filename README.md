# Village Skill Portal

A modern web application that connects skilled professionals in villages, built with React, Node.js, Express, and MongoDB.

## 🌟 Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Skill Management**: Add, edit, and showcase your skills with proficiency levels
- **Village Community**: Connect with skilled professionals in your village
- **Search & Filter**: Find people by skills, village, or name
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Updates**: Dynamic content updates and real-time data

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with animations and responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd village-skill-portal
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://vishnuarikatlaofficial:vishnu123@vishnuscluster.5nn9j1z.mongodb.net/village-skill-portal
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 3000).

## 📁 Project Structure

```

## Quick start (Windows / PowerShell)

Follow these steps to run the project locally on Windows using PowerShell.

1. Install dependencies (from repository root):

```powershell
npm run install-all
```

2. Create a `.env` file in the project root (same folder as `package.json`) and set required variables:

```powershell
# .env
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=your-secret-key
PORT=5000
```

3. Start both backend and frontend in development mode:

```powershell
npm run dev
```

This runs the backend on port 5000 and the frontend dev server on port 3000. The frontend `package.json` contains a proxy entry so requests to `/api/*` are forwarded to the backend.

If you prefer to run servers in separate shells:

```powershell
# Terminal 1 - backend
npm run server

# Terminal 2 - frontend
cd frontend; npm start
```

## Quick troubleshooting

- If the backend fails to start, check the console for MongoDB connection errors. Ensure `MONGODB_URI` is valid and reachable.
- If the frontend cannot reach the backend, verify the backend is running on `http://localhost:5000` and the proxy is set in `frontend/package.json`.
- If registration returns "Email already registered", use a different email or delete the duplicate entry in your MongoDB collection.
- If you get CORS errors (unlikely with the current `app.use(cors())`), confirm the frontend origin is allowed or temporarily enable permissive CORS during development.
- Check ports 3000 and 5000 are free. Use `Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess` in PowerShell to see which process is using a port.

## How to test registration manually (PowerShell)

Use this PowerShell snippet to POST a new user to the backend (replace fields as needed):

```powershell
$body = @{
   name = 'Test User'
   email = 'testuser@example.com'
   password = 'secret123'
   village = 'MyVillage'
   phone = '1234567890'
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/users/register' -Body $body -ContentType 'application/json'
```

If the request succeeds you will receive the created user object. If it fails, the response will include a message (e.g., validation errors or duplicate email).
village-skill-portal/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   └── userController.js  # User business logic
│   ├── models/
│   │   └── user.js            # User data model
│   ├── routes/
│   │   └── userRoutes.js      # API endpoints
│   └── server.js              # Express server
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # React context
│   │   ├── App.js            # Main app component
│   │   └── index.js          # App entry point
│   └── package.json          # Frontend dependencies
└── package.json              # Root package.json
```

## 🎯 Available Scripts

- `npm start` - Start the production server
- `npm run server` - Start the backend server with nodemon
- `npm run client` - Start the frontend development server
- `npm run dev` - Start both servers concurrently
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install both backend and frontend dependencies

## 🔐 API Endpoints

### Public Routes
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/users` - Get all users (public)

### Protected Routes (require JWT token)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/skills` - Add new skill

## 🎨 Features Overview

### Home Page
- Hero section with call-to-action
- Feature highlights
- How it works guide
- Community statistics

### Authentication
- User registration with validation
- Secure login system
- JWT token management
- Protected routes

### Dashboard
- User profile overview
- Skills display
- Community statistics
- Quick actions

### Skill Portal
- Browse all users and skills
- Advanced search and filtering
- Add new skills
- Contact other users

### Profile Management
- Edit personal information
- Update skills
- Change password
- Account actions

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on all screen sizes
- **Smooth Animations**: CSS transitions and hover effects
- **Color-coded Skills**: Visual skill level indicators
- **Interactive Elements**: Hover effects and micro-interactions
- **Loading States**: User feedback during operations
- **Error Handling**: Clear error messages and validation

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin request handling
- **Environment Variables**: Secure configuration management

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Ensure MongoDB connection is accessible

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build` folder to platforms like:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the console for error messages
2. Verify your MongoDB connection
3. Ensure all dependencies are installed
4. Check that ports 3000 and 5000 are available

## 🔮 Future Enhancements

- Real-time messaging between users
- Skill verification system
- Rating and review system
- File upload for skill portfolios
- Push notifications
- Mobile app development
- Advanced analytics dashboard
- Multi-language support

---

**Built with ❤️ for connecting village communities through skills and collaboration.**


