const bookingSchema = new mongoose.Schema({
        userID: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User',
            required: true
        },
        flightID: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Flight',
            required: true
        },
        bookingDate: {
            type: Date,
            default: null
        },
        numberOfSeats: {
            type: Number,
            default: 1
        },
        totalPrice: {
            type: Number
        },
        bookingStatus: {
            type: String,
            enum: [
                'CONFIRMED',
                'CANCELLED',
                'PENDING'
            ],
            default: 'PENDING'
        }
    }
)