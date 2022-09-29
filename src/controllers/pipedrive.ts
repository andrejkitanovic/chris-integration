import { RequestHandler } from 'express';
import { writeInFile } from 'helpers/writeInFile';

export const postWebhookActivityUpdated: RequestHandler = async (req, res, next) => {
	try {
		const { current } = req.body;
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify(current) });

		res.json({
			message: 'Success',
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};
