import { Router } from 'express';
import { getGames, getGame, createGame, updateGame } from '../controllers/gameController';
import { authenticateToken } from '../middleware/auth';
import { checkRole } from '../middleware/roleCheck';

const router = Router();

router.get('/', getGames);
router.get('/:id', getGame);
router.post('/', authenticateToken, checkRole(['admin', 'moderator']), createGame);
router.put('/:id', authenticateToken, checkRole(['admin', 'moderator']), updateGame);

export default router;