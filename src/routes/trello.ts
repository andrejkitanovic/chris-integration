import { Router } from 'express';
import defineRoutes from 'helpers/defineRoutes';
import { getTrello as getTrelloController, postTrelloCard as postTrelloCardController } from 'controllers/trello';

const router = Router();
defineRoutes(router, [
	{
		method: 'get',
		route: '/card',
		controller: getTrelloController,
	},
	{
		method: 'post',
		route: '/card',
		controller: postTrelloCardController,
	},
]);

export default router;
