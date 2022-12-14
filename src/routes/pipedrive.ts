import { Router } from 'express';
import defineRoutes from 'helpers/defineRoutes';
import {
	postWebhookActivity as postWebhookActivityController,
	postWebhookDeal as postWebhookDealController,
	postWebhookNote as postWebhookNoteController,
} from 'controllers/pipedrive';

const router = Router();
defineRoutes(router, [
	{
		method: 'post',
		route: '/activity',
		controller: postWebhookActivityController,
	},
	{
		method: 'post',
		route: '/deal',
		controller: postWebhookDealController,
	},
	{
		method: 'post',
		route: '/note',
		controller: postWebhookNoteController,
	},
]);

export default router;
