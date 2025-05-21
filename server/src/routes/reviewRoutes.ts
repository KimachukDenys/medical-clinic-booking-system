import Express from "express";
import { ReviewController } from "../controllers/reviewController";
import { ReviewService } from "../services/reviewService";
import { authenticateToken, authorizeRole } from '../middlwares/auth';

const router = Express.Router();
const reviewService = new ReviewService();
const reviewController = new ReviewController(reviewService);

router.get('/user/:userId', authenticateToken, authorizeRole(['patient']), reviewController.getUserReviews);
router.post('/create', authenticateToken, authorizeRole(['patient']), reviewController.createReview);
router.put('/update/:id', authenticateToken, authorizeRole(['patient']), reviewController.updateReview);
router.delete('/delete/:id', authenticateToken, authorizeRole(['patient', 'admin']), reviewController.deleteReview);
router.get('/doctor/:doctorId', reviewController.getDoctorReviews)
router.get('/service/:serviceId', reviewController.getServiceReviews)

export default router;