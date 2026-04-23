import { validationResult } from 'express-validator';
import asyncHandler from '../middleware/asyncHandler.js';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import { sendEmail } from '../config/mailer.js';

const hasOverlap = async (roomId, checkIn, checkOut) => {
  const existingBooking = await Booking.findOne({
    room: roomId,
    status: { $ne: 'cancelled' },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });

  return Boolean(existingBooking);
};

export const checkAvailability = asyncHandler(async (req, res) => {
  const { roomId, checkIn, checkOut } = req.query;
  if (!roomId || !checkIn || !checkOut) {
    res.status(400);
    throw new Error('roomId, checkIn and checkOut are required');
  }

  const isBooked = await hasOverlap(roomId, new Date(checkIn), new Date(checkOut));
  res.status(200).json({ success: true, data: { available: !isBooked } });
});

export const createBooking = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { room: roomId, checkIn, checkOut } = req.body;

  const room = await Room.findById(roomId);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (checkOutDate <= checkInDate) {
    res.status(400);
    throw new Error('Check-out must be after check-in');
  }

  const isBooked = await hasOverlap(roomId, checkInDate, checkOutDate);
  if (isBooked) {
    res.status(409);
    throw new Error('Room is already booked for selected dates');
  }

  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const totalPrice = nights * room.price;

  const booking = await Booking.create({
    user: req.user._id,
    room: roomId,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalPrice,
    paymentStatus: 'pending',
  });

  room.status = 'booked';
  await room.save();

  await sendEmail({
    to: req.user.email,
    subject: 'Booking Confirmed',
    html: `<h3>Your booking is confirmed</h3><p>Room: ${room.roomNumber}</p><p>Check In: ${checkInDate.toDateString()}</p><p>Check Out: ${checkOutDate.toDateString()}</p>`,
  });

  res.status(201).json({ success: true, data: booking });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('room')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: bookings });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('room');
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const canCancel =
    booking.user.toString() === req.user._id.toString() ||
    req.user.role === 'admin' ||
    req.user.role === 'staff';

  if (!canCancel) {
    res.status(403);
    throw new Error('You cannot cancel this booking');
  }

  booking.status = 'cancelled';
  booking.paymentStatus = booking.paymentStatus === 'paid' ? 'refunded' : booking.paymentStatus;
  await booking.save();

  const overlappingActive = await Booking.findOne({
    room: booking.room._id,
    status: { $ne: 'cancelled' },
    checkOut: { $gt: new Date() },
  });

  if (!overlappingActive) {
    booking.room.status = 'available';
    await booking.room.save();
  }

  res.status(200).json({ success: true, data: booking });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find()
      .populate('user', 'name email role')
      .populate('room', 'roomNumber type price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: bookings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getRevenueStats = asyncHandler(async (req, res) => {
  const paid = await Booking.aggregate([
    { $match: { paymentStatus: 'paid', status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: null,
        revenue: { $sum: '$totalPrice' },
        totalBookings: { $sum: 1 },
      },
    },
  ]);

  const result = paid[0] || { revenue: 0, totalBookings: 0 };
  res.status(200).json({ success: true, data: result });
});
