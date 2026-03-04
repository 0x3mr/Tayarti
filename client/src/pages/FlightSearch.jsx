import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { flightsAPI, bookingsAPI } from '../api/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function FlightSearch() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ from: '', to: '', date: '' })
  const [bookingLoading, setBookingLoading] = useState(null)
  const [seatsByFlight, setSeatsByFlight] = useState({})

  const fetchFlights = async (isSearch = false) => {
    if (isSearch) setSearchLoading(true)
    else setLoading(true)
    setError('')
    try {
      const hasFilters = filters.from || filters.to || filters.date
      const { data } = hasFilters
        ? await flightsAPI.search(filters)
        : await flightsAPI.getAll()
      setFlights(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load flights.')
      setFlights([])
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    fetchFlights()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchFlights(true)
  }

  const getSeatsForFlight = (flightId, availableSeats) => {
    const n = seatsByFlight[flightId]
    if (n == null) return 1
    return Math.min(Math.max(1, parseInt(n, 10) || 1), availableSeats)
  }

  const handleBook = async (flightId, seats) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setBookingLoading(flightId)
    setError('')
    try {
      await bookingsAPI.create({ flightId, numberOfSeats: seats })
      setFlights((prev) =>
        prev.map((f) =>
          f._id === flightId ? { ...f, availableSeats: f.availableSeats - seats } : f
        )
      )
      navigate('/bookings')
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.')
    } finally {
      setBookingLoading(null)
    }
  }

  const formatDate = (d) => {
    if (!d) return '-'
    const date = new Date(d)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Find your flight</h1>
        <p className="text-stone-600">Search by departure, destination, or date</p>
      </div>

      <form
        onSubmit={handleSearch}
        className="bg-white rounded-xl shadow-md p-6 mb-8 border border-stone-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">From</label>
            <input
              type="text"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              placeholder="City or airport"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">To</label>
            <input
              type="text"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              placeholder="City or airport"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
          <div className="flex items-end gap-5">
            <button
              type="submit"
              disabled={searchLoading}
              className="w-full py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-semibold transition disabled:opacity-50"
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
            {(filters.from || filters.to || filters.date) && (
              <button
                type="button"
                onClick={() => {
                  setFilters({ from: '', to: '', date: '' })
                  window.location.reload();
                }}
                className="py-2.5 px-3 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold transition whitespace-nowrap"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : flights.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-stone-200">
          <p className="text-stone-600 text-lg">No flights found.</p>
          <p className="text-stone-500 text-sm mt-1">Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flights.map((flight) => (
            <div
              key={flight._id}
              className="bg-white rounded-xl shadow-md p-6 border border-stone-200 hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold text-stone-800">{flight.flightNumber}</span>
                    <span className="text-stone-500 text-sm">
                      {flight.availableSeats} seats left
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-stone-700">
                    <span>
                      <strong>{flight.from}</strong> → <strong>{flight.to}</strong>
                    </span>
                    <span className="text-stone-500">{formatDate(flight.date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xl font-bold text-teal-600">
                    ${flight.price?.toLocaleString()}
                    <span className="text-sm font-normal text-stone-500">/seat</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-stone-600">Tickets:</label>
                    <input
                      type="number"
                      min={1}
                      max={flight.availableSeats}
                      value={seatsByFlight[flight._id] ?? 1}
                      onChange={(e) =>
                        setSeatsByFlight((prev) => ({
                          ...prev,
                          [flight._id]: e.target.value
                        }))
                      }
                      className="w-16 px-2 py-1.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-center"
                    />
                  </div>
                  <button
                    onClick={() => handleBook(flight._id, getSeatsForFlight(flight._id, flight.availableSeats))}
                    disabled={flight.availableSeats < 1 || bookingLoading === flight._id}
                    className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading === flight._id ? 'Booking...' : 'Book'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
