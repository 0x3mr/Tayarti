import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-teal-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Tayarti
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-teal-300 transition">Flights</Link>
            {isAuthenticated ? (
              <>
                <Link to="/bookings" className="hover:text-teal-300 transition">My Bookings</Link>
                <span className="text-stone-400 text-sm">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded bg-teal-800 hover:bg-teal-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-teal-300 transition">Login</Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded bg-teal-500 hover:bg-teal-400 text-white font-medium transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
