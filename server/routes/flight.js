import express from 'express'
import { 
    createFlight, 
    getAllFlights, 
    searchFlights, 
    updateFlight, 
    deleteFlight 
} from '../controllers/flight.js'
import authMiddleware from '../middleware/airport.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const router = express.Router()

router.get('/search', searchFlights)
router.get('/', getAllFlights)
router.post('/', authMiddleware, adminMiddleware, createFlight)
router.put('/:id', authMiddleware, adminMiddleware, updateFlight)
router.delete('/:id', authMiddleware, adminMiddleware, deleteFlight)

export default router