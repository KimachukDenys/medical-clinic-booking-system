import Category from '../models/Categories';

export class CategoryService {
  async createCategory(name: string) {
    return await Category.create({ name });
  }

  async getAllCategories() {
    return await Category.findAll();
  }

  async updateCategory(id: number, name: string) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('NotFound:Category not found');
    }
    category.name = name;
    return await category.save();
  }

  async deleteCategory(id: number) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('NotFound:Category not found');
    }
    await category.destroy();
  }
}
