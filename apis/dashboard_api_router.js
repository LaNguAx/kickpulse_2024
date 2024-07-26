import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  getProductsByGender
} from './dashboard/products_api.js';

import {
  createSupplier,
  deleteSupplier,
  getSupplier,
  getSupplierBrands,
  getSuppliers,
} from './dashboard/suppliers_api.js';
import {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getBrands,
} from './dashboard/brands_api.js';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
  getCategoryProducts,
} from './dashboard/categories_api.js';
const router = express.Router();

router.route('/products').get(getProducts).post(createProduct);
router.route('/products/:id').get(getProduct).delete(deleteProduct);
router.route('/products/gender/:gender').get(getProductsByGender);


router.route('/suppliers').get(getSuppliers).post(createSupplier);
router.route('/suppliers/:id').get(getSupplier).delete(deleteSupplier);
router.route('/suppliers/:id/brands').get(getSupplierBrands);

router.route('/brands').get(getBrands).post(createBrand);
router.route('/brands/:id').get(getBrand).put(updateBrand).delete(deleteBrand);


router.route('/categories').get(getCategories).post(createCategory);
router.route('/categories/:id').get(getCategory).delete(deleteCategory).put(updateCategory);
router.route('/categories/products/:id').get(getCategoryProducts);

export default router;
