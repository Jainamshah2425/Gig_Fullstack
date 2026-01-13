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

4. Edit `.env` and configure your environment variables:


5. Start the backend server:
```bash
npm run dev
```
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

4. Edit `.env` with your backend URL:

5. Start the development server:
```bash
npm run dev
```

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

