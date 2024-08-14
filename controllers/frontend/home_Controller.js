import CategoriesService from '../../services/dashboard/category_service.js';
import ProductsService from '../../services/dashboard/product_service.js';
import BrandService from '../../services/dashboard/brand_service.js';

export async function getIndex(req, res) {
  const categories = await CategoriesService.getCategories();
  const menProducts = await ProductsService.getProductsByGender('men');
  const brandNames = await BrandService.getBrands();
  categories.brandNames = brandNames;

  res.render('../views/frontend/home', { categories, menProducts, session: req.session });
}
