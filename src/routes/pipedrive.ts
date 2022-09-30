import { Router } from 'express';
import defineRoutes from 'helpers/defineRoutes';
import { postWebhookActivity as postWebhookActivityController } from 'controllers/pipedrive';

const router = Router();
defineRoutes(router, [
	{
		method: 'post',
		route: '/activity',
		controller: postWebhookActivityController,
	},
]);

export default router;
