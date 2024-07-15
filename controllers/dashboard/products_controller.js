import ProductService from '../../services/dashboard/product_service.js';
import SuppliersService from '../../services/dashboard/supplier_service.js';
import CategoriesService from '../../services/dashboard/category_service.js';

export async function productsIndex(req, res) {
  const allProducts = await ProductService.getProducts();
  const allSuppliers = await SuppliersService.getSuppliers();
  const allCategories = await CategoriesService.getCategories();

  res.render('../views/dashboard/products', {
    products: allProducts,
    suppliers: allSuppliers,
    categories: allCategories,
  });
}
