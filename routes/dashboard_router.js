import express from 'express';
import {
  usersIndex,
  ordersIndex,
} from '../controllers/dashboard_controller.js';

import { productsIndex } from '../controllers/dashboard/products_controller.js';
import { suppliersIndex } from '../controllers/dashboard/suppliers_controller.js';
import { brandsIndex } from '../controllers/dashboard/brands_controller.js';
import { categoriesIndex } from '../controllers/dashboard/categories_controller.js';

const router = express.Router();

// redirect admin to products temporarily until admin login
router.route('/').get((req, res) => res.redirect('/dashboard/products'));

router.route('/products').get(productsIndex);

router.route('/suppliers').get(suppliersIndex);

router.route('/categories').get(categoriesIndex);

router.route('/users').get(usersIndex);
router.route('/orders').get(ordersIndex);

router.route('/brands').get(brandsIndex);

export default router;
