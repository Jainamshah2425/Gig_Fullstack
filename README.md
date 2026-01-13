# GigFlow - Freelance Marketplace

A full-stack freelance marketplace where clients post gigs and freelancers bid on them. Built with production-ready features including secure authentication, atomic transactions, and real-time notifications.

## 🌟 Features

- 🔐 **Secure JWT Authentication** with HttpOnly cookies
- 💼 **Post and Browse Gigs** - Create job postings with title, description, and budget
- 💰 **Submit Bids** - Freelancers can bid with proposed prices and messages
- ✅ **Atomic Hiring Process** - Race condition-safe hiring using MongoDB transactions
- 🔔 **Real-time Notifications** - Socket.io integration for instant hire notifications
- 🔍 **Search and Filter** - Full-text search across gigs
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS

## 🛠 Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Socket.io Client for real-time features
- Axios for API requests

**Backend:**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Socket.io for real-time notifications
- Winston for logging
- Helmet for security headers
- Express Rate Limit for API protection

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## 🚀 Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` and configure your environment variables:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` with your backend URL:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
```
*Requires authentication*

#### Logout
```http
POST /api/auth/logout
```
*Requires authentication*

### Gig Endpoints

#### Get All Gigs
```http
GET /api/gigs?search=keyword&page=1&limit=10
```

#### Get Single Gig
```http
GET /api/gigs/:id
```

#### Create Gig
```http
POST /api/gigs
Content-Type: application/json

{
  "title": "Build a React website",
  "description": "Need a modern React website with responsive design",
  "budget": 500
}
```
*Requires authentication*

#### Get My Gigs
```http
GET /api/gigs/my-gigs
```
*Requires authentication*

### Bid Endpoints

#### Submit Bid
```http
POST /api/bids
Content-Type: application/json

{
  "gigId": "65abc123...",
  "message": "I can complete this project in 2 weeks",
  "proposedPrice": 450
}
```
*Requires authentication*

#### Get Bids for Gig
```http
GET /api/bids/gig/:gigId
```
*Requires authentication (gig owner only)*

#### Hire Freelancer
```http
PATCH /api/bids/:bidId/hire
```
*Requires authentication (gig owner only)*

## 🔐 Security Features

✅ **Password Hashing** - bcrypt with salt rounds: 10  
✅ **HttpOnly Cookies** - JWT stored securely, not in localStorage  
✅ **CORS Protection** - Configured with credentials support  
✅ **Rate Limiting** - Protects authentication endpoints  
✅ **Helmet.js** - Security headers configured  
✅ **Input Validation** - Express-validator on all inputs  
✅ **Authorization Checks** - User permissions verified  
✅ **MongoDB Transactions** - Atomic operations for hiring  

## 🎯 Key Features Implementation

### Atomic Hiring Process

The hiring process uses MongoDB transactions to ensure data consistency:

1. Verifies the bid exists and user is authorized
2. Checks if gig is still open
3. Updates gig status to 'assigned' (atomically)
4. Marks the hired bid as 'hired'
5. Rejects all other bids for the gig
6. Commits transaction or rolls back on error

This prevents race conditions when multiple clients try to hire simultaneously.

### Real-time Notifications

Socket.io integration provides instant feedback:

1. When a freelancer is hired, they receive a real-time notification
2. Notifications appear as toast messages in the UI
3. Socket rooms are used to target specific users

## 📁 Project Structure

```
fullstack_Task/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and environment configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Logger and error classes
│   │   └── server.js       # Entry point
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios client configuration
│   │   ├── components/     # React components
│   │   ├── context/        # Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 🧪 Testing the Application

### Manual Testing Flow

1. **Registration Flow**
   - Register a new user
   - Verify JWT cookie is set
   - Check user is redirected to home page

2. **Gig Creation**
   - Create a new gig with title, description, budget
   - Verify it appears in "My Gigs"
   - Check it's visible in the browse page

3. **Bidding Flow**
   - Register a second user
   - Browse gigs and submit a bid
   - Verify bid appears in gig owner's view

4. **Hiring Flow** (Critical)
   - Login as gig owner
   - View bids on your gig
   - Hire a freelancer
   - Verify:
     - Gig status changes to 'assigned'
     - Hired bid status is 'hired'
     - Other bids are 'rejected'
     - Real-time notification appears

5. **Search Functionality**
   - Use search bar to find gigs by keyword
   - Verify full-text search works

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Set environment variables in your hosting platform
2. Change `NODE_ENV` to `production`
3. Use MongoDB Atlas for the database
4. Update `CLIENT_URL` to your frontend domain
5. Ensure `secure: true` for cookies in production

### Frontend Deployment (Vercel/Netlify)

1. Set `VITE_API_URL` to your backend URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder
4. Configure redirects for client-side routing

## 🐛 Common Issues

**MongoDB Connection Failed**
- Ensure MongoDB is running locally or check Atlas connection string
- Verify IP whitelist in MongoDB Atlas

**CORS Errors**
- Check `CLIENT_URL` in backend `.env` matches frontend URL
- Ensure `withCredentials: true` in axios requests

**Cookie Not Set**
- Check browser settings allow cookies
- Verify `sameSite` and `secure` settings match your environment

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues, please open an issue on the GitHub repository.

---

Built with ❤️ using React, Node.js, and MongoDB
