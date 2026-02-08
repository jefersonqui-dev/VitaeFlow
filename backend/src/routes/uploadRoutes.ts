import express from 'express';
import { getUploadUrl, uploadLocalFile } from '../controllers/uploadController';
import { protect } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.post('/presigned-url', protect, getUploadUrl);
router.post('/local', protect, upload.single('file'), uploadLocalFile);

export default router;
