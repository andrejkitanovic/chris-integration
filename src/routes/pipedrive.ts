import { Router } from 'express';
import defineRoutes from 'helpers/defineRoutes';
import {
	postWebhookActivity as postWebhookActivityController,
	postWebhookDealUpdated as postWebhookDealUpdatedController,
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
		route: '/deal/updated',
		controller: postWebhookDealUpdatedController,
	},
]);

export default router;
