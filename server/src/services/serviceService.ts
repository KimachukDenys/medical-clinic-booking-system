import { Service, Category, User } from '../models';

export class ServiceService {
  async createService(data: {
    title: string;
    description: string;
    price: number;
    categoryId: number;
    imagePath?: string | null;
  }) {
    return await Service.create({
      title: data.title,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      imagePath: data.imagePath || null,
      isHidden: false,
    });
  }

  async getAllServices(includeHidden: boolean) {
    return await Service.findAll({
      where: includeHidden ? {} : { isHidden: false },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  async getServiceById(id: number) {
    return await Service.findByPk(id);
  }

  async getServicesForDoctor(doctorId: number) {
    const doctor = await User.findByPk(doctorId, {
      include: {
        model: Service,
        as: 'services',
        through: { attributes: [] },
      },
    });
    return doctor?.services || null;
  }

  async updateService(id: number, updateData: {
    title?: string;
    description?: string;
    price?: number;
    categoryId?: number;
    isHidden?: boolean;
    imagePath?: string | null;
  }) {
    const service = await Service.findByPk(id);
    if (!service) return null;

    await service.update(updateData);
    return service;
  }
}
