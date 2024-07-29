import CategoryService from "../../services/dashboard/category_service.js";

export async function getIndex(req, res) {
  const categories = await CategoryService.getCategories();

  res.render('../views/frontend/checkout', { categories });
}
