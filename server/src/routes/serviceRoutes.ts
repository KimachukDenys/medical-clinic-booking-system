// src/routes/serviceRoutes.ts
import express from 'express';
import { ServiceController } from '../controllers/serviceController';
import { ServiceService } from '../services/serviceService';
import { AppointmentController } from '../controllers/appointmentController';
import { AppointmentService } from '../services/appointmentService';
import { DoctorController } from '../controllers/doctorController';
import { DoctorService } from '../services/doctorService';
import { authenticateToken, authorizeRole } from '../middlwares/auth';

const router = express.Router();
const serviceService = new ServiceService();
const serviceController = new ServiceController(serviceService);

const appointmentService = new AppointmentService();
const appointmentController = new AppointmentController(appointmentService);

const doctorService = new DoctorService();
const doctorController = new DoctorController(doctorService);

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.post('/create', authenticateToken, authorizeRole(['admin']), serviceController.createService);
router.put('/update/:id', authenticateToken, authorizeRole(['admin']), serviceController.updateService);


router.post('/appointments', authenticateToken, appointmentController.createAppointment);
router.get('/appointments/list', authenticateToken, appointmentController.getAllAppointments);
router.get('/appointments/details/:id', authenticateToken, appointmentController.getAppointmentById);
router.put('/appointments/:id', authenticateToken, appointmentController.updateAppointment);
router.get('/appointments/booked', authenticateToken, appointmentController.getBookedTimes);
router.delete('/appointments/:id', authenticateToken, appointmentController.deleteAppointment);


router.post('/:id/add/doctors', authenticateToken, authorizeRole(['admin']), doctorController.assignDoctorToService);
router.delete('/:id/remove/doctors/:doctorId', authenticateToken, authorizeRole(['admin']), doctorController.removeDoctorFromService);
router.get('/:id/doctors', authenticateToken, doctorController.getDoctorsForService);
router.get('/:id/services', authenticateToken, serviceController.getServicesForDoctor);


export default router;
