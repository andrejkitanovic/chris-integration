import { ErrorRequestHandler } from 'express';
import { writeInFile } from 'helpers/writeInFile';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const error: ErrorRequestHandler = async (err, req, res, next) => {
	await writeInFile({ path: 'file.log', context: '[ERROR]\n' + JSON.stringify(err) });
	const status = err.statusCode || 500;

	if (err?.response?.data) {
		res.status(status).json(err.response.data);
	} else {
		const { message, data } = err;
		res.status(status).json({ message, data });
	}
};

export default error;
