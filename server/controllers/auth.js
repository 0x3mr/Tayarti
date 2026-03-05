import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'
import sendEmail from '../utilities/sendEmail.js'

export async function register(req, res) {
    try {
        const { name, email, password } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000)

        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationCode,
            verificationCodeExpires
        })

        await user.save()

        await sendEmail({
            to: email,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${verificationCode}. It expires in 10 minutes.`
        })

        res.status(201).json({ message: 'Registration successful, check your email for the verification code' })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export async function verifyEmail(req, res) {
    try {
        const { email, code } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' })
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Invalid verification code' })
        }

        if (user.verificationCodeExpires < new Date()) {
            return res.status(400).json({ message: 'Verification code has expired' })
        }

        user.isVerified = true
        user.verificationCode = null
        user.verificationCodeExpires = null
        user.markModified('verificationCode')
        user.markModified('verificationCodeExpires')
        await user.save()

        res.status(200).json({ message: 'Email verified successfully' })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in' })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export async function resendVerificationCode(req, res) {
    try {
        const { email } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' })
        }

        if (!user.verificationCode) {
            return res.status(400).json({ message: 'No verification code exists for this user' })
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000)

        user.verificationCode = verificationCode
        user.verificationCodeExpires = verificationCodeExpires
        await user.save()

        await sendEmail({
            to: email,
            subject: 'Your New Verification Code',
            text: `Your new verification code is: ${verificationCode}. It expires in 10 minutes.`
        })

        res.status(200).json({ message: 'Verification code resent successfully' })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}