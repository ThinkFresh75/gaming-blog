import { Router } from 'express';
import { getUsers, updateUserRole, getStatistics } from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/roleCheck';

const router = Router();

router.get('/users', authenticateToken, checkRole(['admin']), getUsers);
router.put('/users/:id/role', authenticateToken, checkRole(['admin']), updateUserRole);
router.get('/statistics', authenticateToken, checkRole(['admin']), getStatistics);

export default router;