import { Router } from 'express';
import defineRoutes from 'helpers/defineRoutes';

const router = Router();
defineRoutes(router, [
	{
		method: 'get',
		route: '/',
		controller: (req, res) => res.render('index'),
	},
]);

export default router;
