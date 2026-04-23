import { Router } from 'express';
import { deleteUser, getUserById, getUsers, updateUserRole } from '../controllers/userController.js';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, authorizeRoles('admin'));

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
