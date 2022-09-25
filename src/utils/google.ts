import axios from 'axios';
import { IUser } from 'models/user';

export const useGoogle = async (user: IUser) => {
	const {
		data: { access_token },
	} = await axios.post('https://oauth2.googleapis.com/token', {
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
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
			const { data } = await calendarGoogleAPI.get(`/users/me/calendarList`);

			return data;
		} catch (err: any) {
			throw new Error(err);
		}
	};

	const googleGetCalendarSearchEvent = async (calendarId: string) => {
		try {
			const { data } = await calendarGoogleAPI.get(`/calendars/${calendarId}/events`, {
				params: {
					maxResults: 1,
				},
			});

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
		googleGetCalendarSearchEvent,
		googleDeleteCalendarEvent,
	};
};
