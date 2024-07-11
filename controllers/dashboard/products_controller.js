import ProductService from '../../services/dashboard/product_service.js';
import SuppliersService from '../../services/dashboard/supplier_service.js';

export async function productsIndex(req, res) {
  const allProducts = await ProductService.getProducts();
  const allSuppliers = await SuppliersService.getSuppliers();
  res.render('../views/dashboard/products', {
    products: allProducts,
    suppliers: allSuppliers,
  });
}
