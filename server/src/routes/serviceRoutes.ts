// src/routes/serviceRoutes.ts
import express from 'express';
import { getAllServices, getServiceById, createService, getServicesForDoctor, updateService} from '../controllers/serviceController';
import { createAppointment, updateAppointment, getAllAppointments, getAppointmentById, getBookedTimes, deleteAppointment } from '../controllers/appointmentController';
import { assignDoctorToService, getDoctorsForService, remoteDoctorFromService } from '../controllers/doctorController';
import { authenticateToken, authorizeRole } from '../middlwares/auth';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/create', authenticateToken, authorizeRole(['admin']), createService);
router.put('/update/:id', authenticateToken, authorizeRole(['admin']), updateService);


router.post('/appointments', authenticateToken, createAppointment);
router.get('/appointments/list', authenticateToken, getAllAppointments);
router.get('/appointments/details/:id', authenticateToken, getAppointmentById);
router.put('/appointments/:id', authenticateToken, updateAppointment);
router.get('/appointments/booked', authenticateToken, getBookedTimes);
router.delete('/appointments/:id', authenticateToken, deleteAppointment);


router.post('/:id/add/doctors', authenticateToken, authorizeRole(['admin']), assignDoctorToService);
router.delete('/:id/remove/doctors/:doctorId', authenticateToken, authorizeRole(['admin']), remoteDoctorFromService);
router.get('/:id/doctors', authenticateToken, getDoctorsForService);
router.get('/:id/services', authenticateToken, getServicesForDoctor);


export default router;
