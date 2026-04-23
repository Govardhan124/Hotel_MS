import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['single', 'double', 'suite', 'deluxe'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'cleaning'],
      default: 'available',
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

roomSchema.index({ type: 1, price: 1, status: 1 });

const Room = mongoose.model('Room', roomSchema);

export default Room;
