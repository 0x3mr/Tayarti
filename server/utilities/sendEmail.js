import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: parseInt(process.env.MAILTRAP_PORT),
    secure: false,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000
})

async function sendEmail({ to, subject, text }) {
    console.log('Mailtrap config:', {
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        user: process.env.MAILTRAP_USER
    });
    try {
        console.log('Attempting to send email to:', to)
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