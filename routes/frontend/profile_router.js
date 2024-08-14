import express from 'express';
import { getIndex as getProfileIndex } from '../../controllers/frontend/profile/profile_Controller.js';
import { getIndex as getOrdersIndex } from '../../controllers/frontend/profile/orders_Controller.js';
import { getIndex as getSettingsIndex } from '../../controllers/frontend/profile/settings_Controller.js';
import { mustLogin, updateUser } from '../../controllers/auth_Controller.js'; // Ensure you import mustLogin if it's needed here


const router = express.Router();

router.route('/profile').get(mustLogin, getProfileIndex);

router.route('/profile/orders').get(mustLogin, getOrdersIndex);
router.route('/profile/settings').get(mustLogin, getSettingsIndex).post(mustLogin, updateUser);

export { router };