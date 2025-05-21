import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/categoryService';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const newCategory = await this.categoryService.createCategory(name);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  };

  getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = +req.params.id;
      const { name } = req.body;
      const updated = await this.categoryService.updateCategory(id, name);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = +req.params.id;
      await this.categoryService.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
