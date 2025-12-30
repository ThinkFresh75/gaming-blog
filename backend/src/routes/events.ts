import { Router } from 'express';
import { getEvents, createEvent, joinEvent, leaveEvent } from '../controllers/eventController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getEvents);
router.post('/', authenticateToken, createEvent);
router.post('/:id/join', authenticateToken, joinEvent);
router.delete('/:id/leave', authenticateToken, leaveEvent);

export default router;