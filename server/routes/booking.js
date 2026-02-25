import express from 'express'
import authMiddleware from '../middleware/airport.js'
// import {
//     createBooking,
//     getMyBookings,
//     updateBookingStatus
// } from '../controllers/booking.js'

const router = express.Router()

// router.post('/', authMiddleware, createBooking)
// router.get('/my', authMiddleware, getMyBookings)
// router.put('/:id', authMiddleware, updateBookingStatus)

export default router