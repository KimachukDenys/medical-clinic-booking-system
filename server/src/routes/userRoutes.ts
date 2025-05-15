import express from 'express';
import { loginUser, registerUser } from '../controllers/userController';
import { getAllDoctors, getDoctorProfile, createDoctorProfile, updateDoctorProfile } from '../controllers/doctorController';
import { authenticateToken } from '../middlwares/auth';
import { authorizeRole } from '../middlwares/auth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/doctors', getAllDoctors);
router.get('/doctor/profile/:doctorId', getDoctorProfile);
router.post('/doctor/profile/create', authenticateToken, authorizeRole(['doctor']), createDoctorProfile);
router.put('/doctor/profile/edit/:userId', authenticateToken, authorizeRole(['doctor']), updateDoctorProfile);

export default router;
