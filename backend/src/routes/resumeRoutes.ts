import express from 'express';
import { createResume, getResumes, getResumeById, updateResume, downloadResumePdf } from '../controllers/resumeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createResume).get(protect, getResumes);
router.route('/:id').get(protect, getResumeById).put(protect, updateResume);
router.route('/:id/pdf').get(protect, downloadResumePdf);

export default router;
