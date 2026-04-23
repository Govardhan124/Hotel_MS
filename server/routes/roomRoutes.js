import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import {
  createRoom,
  deleteRoom,
  getRoomById,
  getRooms,
  updateRoom,
  uploadRoomImage,
} from '../controllers/roomController.js';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router
  .route('/')
  .get(getRooms)
  .post(
    protect,
    authorizeRoles('admin', 'staff'),
    [
      body('roomNumber').notEmpty().withMessage('Room number is required'),
      body('type').isIn(['single', 'double', 'suite', 'deluxe']).withMessage('Invalid room type'),
      body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    ],
    createRoom
  );

router.post('/upload-image', protect, authorizeRoles('admin', 'staff'), upload.single('image'), uploadRoomImage);

router
  .route('/:id')
  .get(getRoomById)
  .put(protect, authorizeRoles('admin', 'staff'), updateRoom)
  .delete(protect, authorizeRoles('admin'), deleteRoom);

export default router;
