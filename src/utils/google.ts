import axios from 'axios';
import { IUser } from 'models/user';
import dayjs from 'dayjs';

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
	const calendarId = user.email;

	const googleGetCalendarSearchEvent = async (meeting_time: string) => {
		try {
			const { data } = await calendarGoogleAPI.get(`/calendars/${calendarId}/events`, {
				params: {
					q: 'Möte med Mersol',
					timeMin: meeting_time,
				},
			});

			if (data?.items) {
				const findMeeting = data?.items?.find(
					(item: any) =>
						item.summary === 'Möte med Mersol' &&
						dayjs(item.start.dateTime).diff(dayjs(meeting_time)) === 0
				);

				return findMeeting;
			}

			return data?.items;
		} catch (err: any) {
			throw new Error(err);
		}
	};

	const googleDeleteCalendarEvent = async (eventId: string) => {
		try {
			const { data } = await calendarGoogleAPI.delete(`/calendars/${calendarId}/events/${eventId}`);

			return data;
		} catch (err: any) {
			throw new Error(err);
		}
	};

	return {
		googleGetCalendarSearchEvent,
		googleDeleteCalendarEvent,
	};
};
