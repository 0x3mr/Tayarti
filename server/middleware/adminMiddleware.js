import User from '../models/User.js'

async function adminMiddleware(req, res, next) {
    try {
        const user = await User.findById(req.user.userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access only' })
        }

        next()

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export default adminMiddleware