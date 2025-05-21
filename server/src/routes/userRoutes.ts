import express from 'express';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';
import { DoctorController } from '../controllers/doctorController';
import { DoctorService } from '../services/doctorService';
import { authenticateToken, authorizeRole } from '../middlwares/auth';

const router = express.Router();
const userService = new UserService();
const userController = new UserController(userService);

const doctorService = new DoctorService();
const doctorController = new DoctorController(doctorService);

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile/:id', authenticateToken, userController.getUserProfile);

router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctor/profile/:doctorId', doctorController.getDoctorProfile);
router.post('/doctor/profile/create', authenticateToken, authorizeRole(['doctor']), doctorController.createDoctorProfile);
router.patch('/doctor/profile/edit/:userId', authenticateToken, authorizeRole(['doctor']), doctorController.updateDoctorProfile);

export default router;
