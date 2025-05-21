import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  createCategory = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const newCategory = await this.categoryService.createCategory(name);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create category.' });
    }
  };

  getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch categories.' });
    }
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = +req.params.id;
      const { name } = req.body;
      const updated = await this.categoryService.updateCategory(id, name);
      res.json(updated);
    } catch (error: any) {
      if (error.message?.startsWith('NotFound')) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      console.error(error);
      res.status(500).json({ message: 'Failed to update category.' });
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = +req.params.id;
      await this.categoryService.deleteCategory(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message?.startsWith('NotFound')) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      console.error(error);
      res.status(500).json({ message: 'Failed to delete category.' });
    }
  };
}
