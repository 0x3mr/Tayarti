import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { flightsAPI } from '../api/api'

export default function AddFlight() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    flightNumber: '',
    from: '',
    to: '',
    date: '',
    availableSeats: 1,
    price: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value, type } = e.target
    const nextValue =
      type === 'number' ? (value === '' ? '' : Number(value)) : value
    setForm((prev) => ({ ...prev, [name]: nextValue }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        flightNumber: form.flightNumber.trim(),
        from: form.from.trim(),
        to: form.to.trim(),
        date: form.date,
        availableSeats: Number(form.availableSeats),
        price: Number(form.price)
      }

      const { data } = await flightsAPI.create(payload)
      setSuccess(data?.message || 'Flight created successfully.')
      setTimeout(() => navigate('/'), 600)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create flight.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Add a new flight</h1>
        <p className="text-stone-600">Admin-only. This creates a new flight in the system.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 border border-stone-200 space-y-4"
      >
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-sm border border-emerald-200">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Flight number</label>
            <input
              type="text"
              name="flightNumber"
              value={form.flightNumber}
              onChange={handleChange}
              required
              placeholder="e.g. TA-102"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Departure date & time</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">From</label>
            <input
              type="text"
              name="from"
              value={form.from}
              onChange={handleChange}
              required
              placeholder="City or airport"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">To</label>
            <input
              type="text"
              name="to"
              value={form.to}
              onChange={handleChange}
              required
              placeholder="City or airport"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Available seats</label>
            <input
              type="number"
              name="availableSeats"
              min={1}
              value={form.availableSeats}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Price (per seat)</label>
            <input
              type="number"
              name="price"
              min={0}
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create flight'}
          </button>
        </div>
      </form>
    </div>
  )
}
