import { RequestHandler } from 'express';
import User from 'models/user';

export const getUsers: RequestHandler = async (req, res, next) => {
	try {
		const users = await User.find();
		const count = await User.count();

		res.json({
			data: users,
			meta: {
				count,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const postUser: RequestHandler = async (req, res, next) => {
	try {
		const { id, name, email, token, exp } = req.body;

		res.json({
			message: 'Success',
		});
	} catch (err) {
		next(err);
	}
};
