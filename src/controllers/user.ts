import { RequestHandler } from 'express';
import User from 'models/user';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const oauth = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
		const { code } = req.body;

		const { data: tokenData } = await axios.post('https://oauth2.googleapis.com/token', {
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			redirect_uri: 'https://webhook.mersol.se',
			grant_type: 'authorization_code',
			code,
		});

		const ticket = await oauth.verifyIdToken({
			idToken: tokenData.id_token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});
		const payload = ticket.getPayload();

		if (!payload) throw new Error();
		if (!tokenData.refresh_token) throw new Error();

		console.log({
			name: payload.name,
			email: payload.email,
			clientId: payload.sub,
			refreshToken: tokenData.refresh_token,
		});

		await User.create({
			name: payload.name,
			email: payload.email,
			clientId: payload.sub,
			refreshToken: tokenData.refresh_token,
		});

		res.json({
			message: 'Success',
		});
	} catch (err) {
		next(err);
	}
};
