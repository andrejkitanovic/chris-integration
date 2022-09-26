import { RequestHandler } from 'express';

export const getHomepage: RequestHandler = async (req, res, next) => {
	try {
		res.render('index');
	} catch (err) {
		next(err);
	}
};
