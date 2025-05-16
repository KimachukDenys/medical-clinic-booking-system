import Express from "express";
import { createReview, updateReview, deleteReview, getDoctorReviews, getServiceReviews } from "../controllers/reviewController";
import { authenticateToken, authorizeRole } from '../middlwares/auth';

const router = Express.Router();

router.post('/create', authenticateToken, authorizeRole(['patient']), createReview);
router.put('/update/:id', authenticateToken, authorizeRole(['patient']), updateReview);
router.delete('/delete/:id', authenticateToken, authorizeRole(['patient', 'admin']), deleteReview);
router.get('/doctor/:doctorId', getDoctorReviews)
router.get('/service/:serviceId', getServiceReviews)

export default router;