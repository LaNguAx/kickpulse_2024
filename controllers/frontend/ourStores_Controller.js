import CategoryService from "../../services/dashboard/category_service.js";
import BrandService from '../../services/dashboard/brand_service.js';

export async function getIndex(req, res) {
  const categories = await CategoryService.getCategories();
  const brandNames = await BrandService.getBrands();
  categories.brandNames = brandNames;

  res.render('../views/frontend/ourstores', { categories, session: req.session, key: process.env.GOOGLE_MAPS_API_KEY });
}
