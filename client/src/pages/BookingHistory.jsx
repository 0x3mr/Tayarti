import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { bookingsAPI } from '../api/api'
import { useAuth } from '../context/auth'
import LoadingSpinner from '../components/LoadingSpinner'

export default function BookingHistory() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login')
      return
    }
    if (isAuthenticated) fetchBookings()
  }, [isAuthenticated, authLoading, navigate])

  const fetchBookings = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await bookingsAPI.getMyBookings()
      setBookings(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings.')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (d) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-stone-100 text-stone-800'
    }
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const deleteBooking = async (b, event) => {
      const button = event.currentTarget;
      button.parentElement.classList.add('opacity-50');
      button.textContent = "Deleting...";

      try {
          await bookingsAPI.deleteBooking(b._id);
          fetchBookings();
      } catch (e) {
          console.error(e);
          // revert UI if delete fails
          button.parentElement.classList.remove('opacity-50');
          button.textContent = "Failed to cancel";
      }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">My Bookings</h1>
        <p className="text-stone-600">View and manage your flight reservations</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-stone-200">
          <p className="text-stone-600 text-lg">You have no bookings yet.</p>
          <p className="text-stone-500 text-sm mt-1">
            Search for flights and book your first trip!
          </p>
          <Link
            to="/"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-semibold transition"
          >
            Search Flights
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const flight = booking.flightID || booking.flightId
            return (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-md p-6 border border-stone-200"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-sm font-medium ${getStatusColor(
                          booking.bookingStatus
                        )}`}
                      >
                        {booking.bookingStatus}
                      </span>
                      <span className="text-stone-500 text-sm">
                        Booked {formatDate(booking.bookingDate)}
                      </span>
                    </div>
                    {flight && (
                      <div className="text-stone-700">
                        <span className="font-mono font-bold">{flight.flightNumber}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {flight.from} → {flight.to}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(flight.date)}</span>
                      </div>
                    )}
                    <div className="mt-2 text-stone-600 text-sm">
                      {booking.numberOfSeats} seat(s) • Total: $
                      {booking.totalPrice?.toLocaleString()}
                    </div>
                  </div>
                  <div onClick={(event) => deleteBooking(booking, event)} className="bg-red-500/45 p-2 px-4 rounded-xl text-red-950 hover:underline hover:cursor-pointer">
                    Cancel
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
