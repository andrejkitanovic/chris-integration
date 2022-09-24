import axios from 'axios';
import { IUser } from 'models/user';

export const useGoogle = async (user: IUser) => {
	const tokenGoogleAPI = axios.create({
		baseURL: 'https://oauth2.googleapis.com/token',
	});
	const {
		data: { access_token },
	} = await tokenGoogleAPI.post('', {
		client_id: process.env.CLIENT_ID_GOOGLE,
		client_secret: process.env.CLIENT_SECRET_GOOGLE,
		grant_type: 'refresh_token',
		refresh_token: user.refreshToken,
	});

	const calendarGoogleAPI = axios.create({
		baseURL: 'https://www.googleapis.com/calendar/v3',
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});

	const googleGetCalendarList = async () => {
		try {
			const { data } = await calendarGoogleAPI.get(`/calendar/v3/users/me/calendarList`);

			return data;
		} catch (err: any) {
			throw new Error(err);
		}
	};

	const googleDeleteCalendarEvent = async (calendarId: string, eventId: string) => {
		try {
			const { data } = await calendarGoogleAPI.delete(`/calendars/${calendarId}/events/${eventId}`);

			return data;
		} catch (err: any) {
			throw new Error(err);
		}
	};

	return {
		googleGetCalendarList,
		googleDeleteCalendarEvent,
	};
};
