import express from 'express';
import {
    login,
    register,
    verifyEmail,
    resendVerificationCode
} from '../controllers/auth.js';

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/verify-email', verifyEmail)
router.post('/resend-code', resendVerificationCode)

export default router;