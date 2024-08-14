import CategoriesService from '../../../services/dashboard/category_service.js';
import AuthService from '../../../services/auth_service.js';
import OrderService from '../../../services/dashboard/order_service.js';
import BrandService from '../../../services/dashboard/brand_service.js';

export async function getIndex(req, res) {
  const categories = await CategoriesService.getCategories();
  const { orders: orderIds } = await AuthService.getUser(req.session.email);

  const orders = await OrderService.getOrdersByIds(orderIds);
  const brandNames = await BrandService.getBrands();
  categories.brandNames = brandNames;

  console.log(orders);

  res.render('../views/frontend/profile/orders', { categories, session: req.session, orders });
}
