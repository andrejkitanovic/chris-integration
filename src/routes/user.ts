import { Router } from 'express';
import defineRoutes from 'helpers/defineRoutes';
import { getUsers as getUsersController, postUser as postUserController } from 'controllers/user';

const router = Router();
defineRoutes(router, [
	{
		method: 'get',
		route: '/',
		controller: getUsersController,
	},
	{
		method: 'post',
		route: '/',
		controller: postUserController,
	},
]);

export default router;
