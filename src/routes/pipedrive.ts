import { Router } from 'express';
import defineRoutes from 'helpers/defineRoutes';
import {
	postWebhookActivityUpdated as postWebhookActivityUpdatedController,
	postWebhookActivityDeleted as postWebhookActivityDeletedController,
} from 'controllers/pipedrive';

const router = Router();
defineRoutes(router, [
	{
		method: 'post',
		route: '/activity/updated',
		controller: postWebhookActivityUpdatedController,
	},
	{
		method: 'post',
		route: '/activity/deleted',
		controller: postWebhookActivityDeletedController,
	},
]);

export default router;
