// src/controllers/categoryController.ts
import { Request, Response } from 'express';
import Category from '../models/Categories';

// Створити категорію (тільки адмін)
export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const newCategory = await Category.create({
      name,
    });
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create category.' });
  }
};

// Отримати всі категорії
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
};
