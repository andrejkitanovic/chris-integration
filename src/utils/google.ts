import axios from 'axios';

const calendarGoogleAPI = axios.create({
	baseURL: 'https://www.googleapis.com/calendar/v3',
	params: {
		key: process.env.GOOGLE_API_KEY,
	},
});

export const googleGetCalendarList = async () => {
	try {
		const { data } = await calendarGoogleAPI.get(`/calendar/v3/users/me/calendarList`);

		return data;
	} catch (err: any) {
		throw new Error(err);
	}
};

export const googleDeleteCalendarEvent = async (calendarId: string, eventId: string) => {
	try {
		const { data } = await calendarGoogleAPI.delete(`/calendars/${calendarId}/events/${eventId}`);

		return data;
	} catch (err: any) {
		throw new Error(err);
	}
};
