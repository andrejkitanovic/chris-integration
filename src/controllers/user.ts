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
