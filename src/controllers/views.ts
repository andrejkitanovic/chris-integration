import { RequestHandler } from 'express';
import { google } from 'googleapis';

export const getHomepage: RequestHandler = async (req, res, next) => {
	try {
		const oauth2Client = new google.auth.OAuth2(
			process.env.GOOGLE_CLIENT_ID,
			process.env.GOOGLE_CLIENT_SECRET,
			'http://localhost:8080'
		);
		const scopes = [
			'https://www.googleapis.com/auth/userinfo.email',
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/calendar',
			'https://www.googleapis.com/auth/calendar.events',
            "openid"
		];
		const authorizationUrl = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: scopes,
			include_granted_scopes: true,
		});

		res.render('index', { authorizationUrl });
	} catch (err) {
		next(err);
	}
};
