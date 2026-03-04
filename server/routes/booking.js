import express from 'express'
import authMiddleware from '../middleware/airport.js'
import { 
    createBooking, 
    getMyBookings, 
    updateBookingStatus,
    deleteBooking 
} from '../controllers/booking.js'

const router = express.Router()

router.post('/', authMiddleware, createBooking)
router.get('/my', authMiddleware, getMyBookings)
router.put('/:id', authMiddleware, updateBookingStatus)
router.delete('/:id', authMiddleware, deleteBooking)

export default router