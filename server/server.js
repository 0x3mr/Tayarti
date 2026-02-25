import cors from 'cors';
import dotenv from 'dotenv'
import express from 'express';

import authRouter from './routes/auth.js';
import flightRouter from './routes/flight.js';
import bookingRouter from './routes/booking.js';
import setupDatabase from './utilities/setupDatabase.js';

const server = express()
const PORT = process.env.PORT || 5000

server.use(cors())
server.use(express.json())
dotenv.config();

setupDatabase();

// ==============================
// ROUTES
// ==============================

server.use('/api/auth', authRouter)
server.use('/api/flights', flightRouter)
server.use('/api/bookings', bookingRouter)

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))