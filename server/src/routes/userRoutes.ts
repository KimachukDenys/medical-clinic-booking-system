import express from 'express';
import { container } from '../di/container';
import { UserController } from '../controllers/userController';
import { DoctorController } from '../controllers/doctorController';
import { DoctorService } from '../services/doctorService';
import { authenticateToken, authorizeRole } from '../middlwares/auth';
import { uploadImage } from '../middlwares/upload';

const router = express.Router();

const asyncHandler =
  (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const userController = container.resolve(UserController);

const doctorService = new DoctorService();
const doctorController = new DoctorController(doctorService);

router.post('/register', asyncHandler(userController.registerUser));
router.post('/login', asyncHandler(userController.loginUser));
router.get ('/profile/:id', authenticateToken, asyncHandler(userController.getUserProfile));
router.put ('/profile/:id',authenticateToken, uploadImage, asyncHandler(userController.editUserProfile));

router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctor/profile/:doctorId', doctorController.getDoctorProfile);
router.post('/doctor/profile/create', authenticateToken, authorizeRole(['doctor']), doctorController.createDoctorProfile);
router.put('/doctor/profile/edit/:userId', authenticateToken, authorizeRole(['doctor']), doctorController.updateDoctorProfile);

export default router;
