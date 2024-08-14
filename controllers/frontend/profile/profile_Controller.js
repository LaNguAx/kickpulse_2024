import CategoriesService from '../../../services/dashboard/category_service.js';

export async function getIndex(req, res) {

  return res.redirect('/profile/orders');

  // const categories = await CategoriesService.getCategories();
  // res.render('../views/frontend/profile/profile', { categories, session: req.session });
}
