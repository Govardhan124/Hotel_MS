import { Router } from 'express';
import { body } from 'express-validator';
import {
  cancelBooking,
  checkAvailability,
  createBooking,
  getAllBookings,
  getMyBookings,
  getRevenueStats,
} from '../controllers/bookingController.js';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/availability', checkAvailability);
router.get('/my', protect, getMyBookings);
router.get('/admin/all', protect, authorizeRoles('admin', 'staff'), getAllBookings);
router.get('/admin/revenue', protect, authorizeRoles('admin'), getRevenueStats);

router.post(
  '/',
  protect,
  [
    body('room').notEmpty().withMessage('Room ID is required'),
    body('checkIn').isISO8601().withMessage('Valid checkIn date is required'),
    body('checkOut').isISO8601().withMessage('Valid checkOut date is required'),
  ],
  createBooking
);

router.patch('/:id/cancel', protect, cancelBooking);

export default router;
