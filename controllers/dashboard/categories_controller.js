import CategoriesService from '../../services/dashboard/category_service.js';

export async function categoriesIndex(req, res) {
  const allCategories = await CategoriesService.getCategories();
  res.render('../views/dashboard/categories', {
    categories: allCategories,
  });
}
