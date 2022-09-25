import { Router } from 'express';
import defineRoutes from 'helpers/defineRoutes';
import {
	postWebhookBookingCreated as postWebhookBookingCreatedController,
	postWebhookBookingUpdated as postWebhookBookingUpdatedController,
	postWebhookBookingDeleted as postWebhookBookingDeletedController,
} from 'controllers/adversus';

const router = Router();
defineRoutes(router, [
	{
		method: 'post',
		route: '/created',
		controller: postWebhookBookingCreatedController,
	},
	{
		method: 'post',
		route: '/updated',
		controller: postWebhookBookingUpdatedController,
	},
	{
		method: 'post',
		route: '/deleted',
		controller: postWebhookBookingDeletedController,
	},
]);

export default router;
