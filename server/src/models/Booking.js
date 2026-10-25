import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: [true, 'Show reference is required'],
      index: true,
    },
    movie: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
      title: { type: String, required: true },
      posterUrl: { type: String, required: true },
      duration: { type: Number },
      language: { type: String },
    },
    theatre: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
      name: { type: String, required: true },
      city: { type: String, required: true },
      screenName: { type: String, required: true },
      screenType: { type: String, default: 'Standard' },
    },
    showDetails: {
      date: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String },
    },
    seats: [
      {
        seatNumber: { type: String, required: true },
        row: { type: String, required: true },
        column: { type: Number, required: true },
        tier: { type: String, enum: ['standard', 'premium', 'vip'], default: 'standard' },
        price: { type: Number, required: true },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    convenienceFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['SUCCESS', 'PENDING', 'FAILED', 'REFUNDED'],
      default: 'SUCCESS',
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'Credit Card / Digital Checkout (Dev Mode)',
    },
    paymentTransactionId: {
      type: String,
      default: () => `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    },
    qrCode: {
      type: String, // Data URL of generated QR code
      default: '',
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
