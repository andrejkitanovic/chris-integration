import { Router } from 'express';
import defineRoutes from 'helpers/defineRoutes';
import { postWebhookActivityDeleted as postWebhookActivityDeletedController } from 'controllers/pipedrive';

const router = Router();
defineRoutes(router, [
	{
		method: 'post',
		route: '/activity/deleted',
		controller: postWebhookActivityDeletedController,
	},
]);

export default router;
