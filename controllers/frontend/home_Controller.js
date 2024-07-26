import CategoriesService from '../../services/dashboard/category_service.js';
import ProductsService from '../../services/dashboard/product_service.js';

export async function getIndex(req, res) {
  const categories = await CategoriesService.getCategories();
  const menProducts = await ProductsService.getProductsByGender('men');
  res.render('../views/frontend/home', { categories, menProducts });
}
