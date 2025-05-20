import { Router } from 'express';
import { CategoryService } from '../services/categoryService';
import { CategoryController } from '../controllers/categoryController';
import { authenticateToken, authorizeRole } from '../middlwares/auth';

const router = Router();
const controller = new CategoryController(new CategoryService());

router.post('/create',authenticateToken, authorizeRole(['admin']), controller.createCategory);      
router.get('/', controller.getAllCategories);
router.put('/:id',authenticateToken, authorizeRole(['admin']), controller.updateCategory);
router.delete('/:id',authenticateToken, authorizeRole(['admin']), controller.deleteCategory);    

export default router;
