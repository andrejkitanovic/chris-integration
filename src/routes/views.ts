import { Router } from 'express';
import defineRoutes from 'helpers/defineRoutes';
import { getHomepage as getHomepageController } from 'controllers/views';

const router = Router();
defineRoutes(router, [
	{
		method: 'get',
		route: '/',
		controller: getHomepageController,
	},
]);

export default router;
