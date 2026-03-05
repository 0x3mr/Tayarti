import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import FlightSearch from './pages/FlightSearch'
import Register from './pages/Register'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import BookingHistory from './pages/BookingHistory'
import AddFlight from './pages/AddFlight'
import RequireAdmin from './components/RequireAdmin'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<FlightSearch />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/bookings" element={<BookingHistory />} />
            <Route
              path="/admin/flights/new"
              element={
                <RequireAdmin>
                  <AddFlight />
                </RequireAdmin>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
