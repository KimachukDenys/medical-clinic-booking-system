// src/routes/categoryRoutes.ts
import { Router } from 'express';
import { createCategory, getAllCategories } from '../controllers/categoryController';

const router = Router();

// Створити категорію
router.post('/create', createCategory);

// Отримати всі категорії
router.get('/', getAllCategories);

export default router;
