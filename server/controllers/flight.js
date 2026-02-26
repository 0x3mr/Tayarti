import Flight from '../models/Flight.js'

export async function createFlight(req, res) {
    try {
        const { flightNumber, from, to, date, totalSeats, availableSeats, price } = req.body

        const existingFlight = await Flight.findOne({ flightNumber })
        if (existingFlight) {
            return res.status(400).json({ message: 'Flight number already exists' })
        }

        const flight = new Flight({
            flightNumber,
            from,
            to,
            date,
            totalSeats,
            availableSeats,
            price
        })

        await flight.save()
        res.status(201).json({ message: 'Flight created successfully', flight })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export async function getAllFlights(req, res) {
    try {
        const flights = await Flight.find()
        res.status(200).json(flights)

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export async function searchFlights(req, res) {
    try {
        const { from, to, date } = req.query

        const filter = {}

        if (from) filter.from = { $regex: from, $options: 'i' }
        if (to) filter.to = { $regex: to, $options: 'i' }
        if (date) {
            const startOfDay = new Date(date)
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date(date)
            endOfDay.setHours(23, 59, 59, 999)
            filter.date = { $gte: startOfDay, $lte: endOfDay }
        }

        const flights = await Flight.find(filter)
        res.status(200).json(flights)

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export async function updateFlight(req, res) {
    try {
        const flight = await Flight.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' })
        }

        res.status(200).json({ message: 'Flight updated successfully', flight })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export async function deleteFlight(req, res) {
    try {
        const flight = await Flight.findByIdAndDelete(req.params.id)

        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' })
        }

        res.status(200).json({ message: 'Flight deleted successfully' })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}