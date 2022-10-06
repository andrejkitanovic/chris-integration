import { Router } from 'express';
import defineRoutes from 'helpers/defineRoutes';
import { postWebhookLog as postWebhookLogController } from 'controllers/webhook';

const router = Router();
defineRoutes(router, [
	{
		method: 'get',
		route: '/',
		controller: postWebhookLogController,
	},
	{
		method: 'post',
		route: '/',
		controller: postWebhookLogController,
	},
]);

export default router;
