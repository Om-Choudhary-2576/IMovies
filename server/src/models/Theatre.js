import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  screenType: {
    type: String,
    enum: ['Standard', 'IMAX', '4DX', 'Dolby Cinema'],
    default: 'Standard',
  },
  totalRows: {
    type: Number,
    default: 8, // A to H
  },
  seatsPerRow: {
    type: Number,
    default: 12, // 1 to 12
  },
  totalSeats: {
    type: Number,
    default: 96,
  },
});

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
      index: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    amenities: {
      type: [String],
      default: ['Dolby Atmos', 'Recliner Seats', 'Food Court', 'Parking', 'Wheelchair Accessible'],
    },
    screens: [screenSchema],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Theatre = mongoose.model('Theatre', theatreSchema);
export default Theatre;
