import { RequestHandler } from 'express';
import { writeInFile } from 'helpers/writeInFile';
import { pipedriveCreateNote, pipedriveSearchDeal, pipedriveUpdateDealStage } from 'utils/pipedrive';

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
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify({ action, model }), req });

		const deal = await pipedriveSearchDeal(model?.name);

		if (action?.type === 'addAttachmentToCard') {
			const attachment: { text: string; url: string } = action.display.entities.attachment;

			if (deal && attachment.url.includes('.pdf')) {
				await pipedriveCreateNote(deal.id, `[${attachment.url}] ${attachment.text}`);

				// [PIPEDRIVE] MOVE TO Redo för säljmöte
				if (deal.stage_id === 2) {
					await pipedriveUpdateDealStage(deal.id, 7);
				}
			}
		} else if (action?.type === 'updateCard') {
			if (
				action?.data?.listAfter &&
				action?.data?.listBefore &&
				action?.data.listAfter.name === 'Double-check - FÄRDIG'
			) {
				if (deal) {
					// [PIPEDRIVE] MOVE TO Double-check Färdig
					await pipedriveUpdateDealStage(deal.id, 11);
				}
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
