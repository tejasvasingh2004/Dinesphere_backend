import express from 'express';
import { getMenus, getMenu, create, update, remove, getMenusByRestaurant } from '../controllers/menuController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getMenus);
router.get('/:id', getMenu);
router.get('/restaurant/:restaurant_id', getMenusByRestaurant);
router.post('/', authenticate, authorize(2), create); // manager only
router.put('/:id', authenticate, authorize(2), update); // manager only
router.delete('/:id', authenticate, authorize(2), remove); // manager only

export default router;
