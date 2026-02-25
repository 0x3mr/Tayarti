import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
})

async function sendEmail({ to, subject, text }) {
    try {
        await transporter.sendMail({
            from: '"Flight Booking System" <noreply@flightbooking.com>',
            to,
            subject,
            text
        })
        console.log(`Email sent to ${to}`)
    } catch (error) {
        console.log('Email sending failed:', error.message)
        throw error
    }
}

export default sendEmail