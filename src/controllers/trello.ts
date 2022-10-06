import { RequestHandler } from 'express';
import { pipedriveCreateNote, pipedriveSearchDeal } from 'utils/pipedrive';

export const getTrello: RequestHandler = async (req, res, next) => {
	try {
		res.json({
			message: '[WEBHOOK] Active',
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const postTrelloCard: RequestHandler = async (req, res, next) => {
	try {
		const { action, model } = req.body;

		if (action?.type === 'addAttachmentToCard') {
			const attachment: { text: string; url: string } = action.display.entities.attachment;

			const deal = await pipedriveSearchDeal(model.name);

			if (deal) {
				await pipedriveCreateNote(deal.id, `[${attachment.url}] ${attachment.text}`);
			}

			// [PIPEDRIVE] MOVE TO Redo för säljmöte
		} else if (action?.type === 'updateCard') {

			if (action?.data?.listAfter && action?.data?.listBefore && action?.data.listAfter.name === 'Double-check - FÄRDIG') {
				// [PIPEDRIVE] MOVE TO Double-check Färdig
			}
		}

		res.json({
			message: 'Success',
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};
