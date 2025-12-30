import { Router } from 'express';
import { uploadFile, getFiles, deleteFile } from '../controllers/fileController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', authenticateToken, upload.single('file'), uploadFile);
router.get('/', authenticateToken, getFiles);
router.delete('/:id', authenticateToken, deleteFile);

export default router;