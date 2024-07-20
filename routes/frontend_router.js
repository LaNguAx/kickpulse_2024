import express from 'express';

import { getIndex as getHomeIndex } from '../controllers/frontend/home_Controller.js';
import { getIndex as getLoginIndex } from '../controllers/frontend/login_Controller.js';
import { getIndex as getRegisterIndex } from '../controllers/frontend/register_Controller.js';
import { getIndex as getShippingIndex } from '../controllers/frontend/shipping_Controller.js';
import { getIndex as getTermsIndex } from '../controllers/frontend/terms_Controller.js';
import { getIndex as getPrivacyIndex } from '../controllers/frontend/privacy_Controller.js';
import { getIndex as getOurstoresIndex } from '../controllers/frontend/ourStores_Controller.js';
import { getIndex as getLaunchesIndex } from '../controllers/frontend/launches_Controller.js';
import { getIndex as getGeneralIndex } from '../controllers/frontend/general_Controller.js';
import { getIndex as getFaqIndex } from '../controllers/frontend/faq_Controller.js';
import { getIndex as getContactIndex } from '../controllers/frontend/contact_Controller.js';
import { getIndex as getAccessibilityIndex } from '../controllers/frontend/accessibility_Controller.js';
import { getIndex as getAboutIndex } from '../controllers/frontend/aboutus_Controller.js';
const router = express.Router();

// homepage
router.route('/').get((req, res) => res.redirect('/home'));
router.route('/home').get(getHomeIndex);

router.route('/login').get(getLoginIndex);
router.route('/register').get(getRegisterIndex);
router.route('/shipping').get(getShippingIndex);
router.route('/terms').get(getTermsIndex);
router.route('/privacy').get(getPrivacyIndex);
router.route('/ourstores').get(getOurstoresIndex);
router.route('/launches').get(getLaunchesIndex);
router.route('/general').get(getGeneralIndex);
router.route('/faq').get(getFaqIndex);
router.route('/contact').get(getContactIndex);
router.route('/accessibility').get(getAccessibilityIndex);
router.route('/about-us').get(getAboutIndex);

export default router;
