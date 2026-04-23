import { validationResult } from 'express-validator';
import asyncHandler from '../middleware/asyncHandler.js';
import Room from '../models/Room.js';
import cloudinary from '../config/cloudinary.js';

export const createRoom = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { roomNumber, type, price, status, images = [] } = req.body;

  const existingRoom = await Room.findOne({ roomNumber });
  if (existingRoom) {
    res.status(409);
    throw new Error('Room number already exists');
  }

  const room = await Room.create({ roomNumber, type, price, status, images });
  res.status(201).json({ success: true, data: room });
});

export const getRooms = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters = {};
  if (req.query.type) filters.type = req.query.type;
  if (req.query.status) filters.status = req.query.status;
  if (req.query.minPrice || req.query.maxPrice) {
    filters.price = {};
    if (req.query.minPrice) filters.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filters.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.search) {
    filters.roomNumber = { $regex: req.query.search, $options: 'i' };
  }

  const [rooms, total] = await Promise.all([
    Room.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Room.countDocuments(filters),
  ]);

  res.status(200).json({
    success: true,
    data: rooms,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  res.status(200).json({ success: true, data: room });
});

export const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  const updatableFields = ['roomNumber', 'type', 'price', 'status', 'images'];
  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      room[field] = req.body[field];
    }
  });

  await room.save();
  res.status(200).json({ success: true, data: room });
});

export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  await room.deleteOne();
  res.status(200).json({ success: true, message: 'Room deleted successfully' });
});

export const uploadRoomImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided');
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    res.status(400);
    throw new Error('Cloudinary is not configured');
  }

  const uploaded = await cloudinary.uploader.upload(req.file.path, {
    folder: 'hotel-rooms',
  });

  res.status(200).json({
    success: true,
    data: {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    },
  });
});
