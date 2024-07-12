import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
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
  deleteBrand,
  getBrand,
  getBrands,
} from './dashboard/brands_api.js';
const router = express.Router();

router.route('/products').get(getProducts).post(createProduct);
router.route('/products/:id').get(getProduct).delete(deleteProduct);

router.route('/suppliers').get(getSuppliers).post(createSupplier);
router.route('/suppliers/:id').get(getSupplier).delete(deleteSupplier);
router.route('/suppliers/:id/brands').get(getSupplierBrands);

router.route('/brands').get(getBrands).post(createBrand);
router.route('/brands/:id').get(getBrand).delete(deleteBrand);

export default router;
