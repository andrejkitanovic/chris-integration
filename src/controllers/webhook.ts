import { RequestHandler } from 'express';
import { writeInFile } from 'helpers/writeInFile';

export const postWebhookLog: RequestHandler = async (req, res, next) => {
	try {
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify(req.body), req });

		res.json({
			message: 'Logged',
		});
	} catch (err) {
		next(err);
	}
};
