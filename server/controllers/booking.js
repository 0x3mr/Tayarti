import Booking from '../models/Booking.js'
import Flight from '../models/Flight.js'

export async function createBooking(req, res) {
    try {
        const { flightId, numberOfSeats } = req.body

        const flight = await Flight.findById(flightId)
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' })
        }

        if (flight.availableSeats < numberOfSeats) {
            return res.status(400).json({ message: 'Not enough seats available' })
        }

        flight.availableSeats -= numberOfSeats
        await flight.save()

        const booking = new Booking({
            userId: req.user.userId,
            flightId,
            bookingDate: new Date(),
            numberOfSeats,
            totalPrice: flight.price * numberOfSeats,
            bookingStatus: 'CONFIRMED'
        })

        await booking.save()
        res.status(201).json({ message: 'Booking created successfully', booking })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export async function getMyBookings(req, res) {
    try {
        const bookings = await Booking.find({ userId: req.user.userId })
            .populate('flightId')

        res.status(200).json(bookings)

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export async function updateBookingStatus(req, res) {
    try {
        const booking = await Booking.findOne({ 
            _id: req.params.id, 
            userId: req.user.userId 
        })

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        booking.bookingStatus = req.body.bookingStatus
        await booking.save()

        res.status(200).json({ message: 'Booking status updated', booking })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}