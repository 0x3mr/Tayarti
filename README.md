# Tayarti - Flight Booking System

A full-stack flight booking application with user authentication, email verification, flight search, and booking management.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, Vite, Tailwind CSS
- **Auth:** JWT, bcrypt, email verification (Mailtrap)

## Prerequisites

- Node.js (v18+)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm

## Setup

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd Tayarti

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

### 2. Configure environment variables

Create `server/.env` with:

```env
MONGO_URI=mongodb://localhost:27017/tayarti
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tayarti

JWT_SECRET=your-secret-key-change-this

# For email verification (Mailtrap)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your-mailtrap-user
MAILTRAP_PASS=your-mailtrap-pass
```

### 3. Run the application

**Terminal 1 – Backend:**

```bash
cd server
node server.js
```

Server runs at `http://localhost:5000`

**Terminal 2 – Frontend:**

```bash
cd client
npm run dev
```

Frontend runs at `http://localhost:5173`

## Project Structure

```
Tayarti/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/            # API service
│   │   ├── components/
│   │   ├── context/        # Auth context
│   │   └── pages/
│   └── ...
├── server/                 # Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utilities/
│   └── server.js
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/verify-email` | Verify email with 6-digit code |
| POST | `/api/auth/resend-code` | Resend verification code |
| GET | `/api/flights` | Get all flights |
| GET | `/api/flights/search?from=&to=&date=` | Search flights |
| POST | `/api/flights` | Create flight (admin) |
| PUT | `/api/flights/:id` | Update flight (admin) |
| DELETE | `/api/flights/:id` | Delete flight (admin) |
| POST | `/api/bookings` | Create booking (auth required) |
| GET | `/api/bookings/my` | Get my bookings (auth required) |
| PUT | `/api/bookings/:id` | Update booking status (auth required) |

## Creating an Admin User

Admin users can create, update, and delete flights. To create one:

1. Register a user and verify their email.
2. In MongoDB, update the user document:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or use MongoDB Compass to edit the user's `role` field to `"admin"`.

## License

ISC
