import { RequestHandler } from 'express';
import { writeInFile } from 'helpers/writeInFile';

export const postWebhookLog: RequestHandler = async (req, res, next) => {
	try {
		await writeInFile({ path: 'error.log', context: JSON.stringify(req.body) });

		res.json({
			message: 'Logged',
		});
	} catch (err) {
		next(err);
	}
};
