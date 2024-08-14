import express from 'express';
import { isAdmin } from '../controllers/auth_Controller.js';

import { getAdminLoginIndex } from '../controllers/dashboard_controller.js';
import { usersIndex } from '../controllers/dashboard/users_controller.js';
import { productsIndex } from '../controllers/dashboard/products_controller.js';
import { suppliersIndex } from '../controllers/dashboard/suppliers_controller.js';
import { brandsIndex } from '../controllers/dashboard/brands_controller.js';
import { ordersIndex } from '../controllers/dashboard/orders_controller.js';
import { categoriesIndex } from '../controllers/dashboard/categories_controller.js';
import { analyticsIndex } from '../controllers/dashboard/analytics_controller.js';
import { facebookIndex } from '../controllers/dashboard/facebook_controller.js';
import { branchesIndex } from '../controllers/dashboard/branches_controller.js';

const router = express.Router();

// redirect admin to products temporarily until admin login
router.route('/').get((req, res) => res.redirect('/dashboard/products'));

router.route('/login').get(getAdminLoginIndex);

router.route('/products').get(isAdmin, productsIndex);

router.route('/suppliers').get(isAdmin, suppliersIndex);

router.route('/categories').get(isAdmin, categoriesIndex);

router.route('/users').get(isAdmin, usersIndex);
router.route('/orders').get(isAdmin, ordersIndex);

router.route('/brands').get(isAdmin, brandsIndex);

router.route('/analytics').get(isAdmin, analyticsIndex)

router.route('/facebook').get(isAdmin, facebookIndex);

router.route('/branches').get(isAdmin, branchesIndex);


export default router;
