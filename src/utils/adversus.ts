import axios from 'axios';
import { writeInFileSimple } from 'helpers/writeInFile';

const adversusAPI = axios.create({
	baseURL: 'https://api.adversus.dk/v1',
	auth: {
		username: process.env.ADVERSUS_USERNAME ?? '',
		password: process.env.ADVERSUS_PASSWORD ?? '',
	},
});

export const adversusSeachBooking = async (meetTime: string) => {
	const { data } = await adversusAPI.get(`/appointments`);

	await writeInFileSimple({ path: 'logs/test.log', context: JSON.stringify(data?.appointments) });
	return data?.appointments?.find((appointment: any) => appointment.start === meetTime);
};

export const adversusUpdateBooking = async (id: string) => {
	const { data } = await adversusAPI.patch(`/appointments/${id}`, {
		status: 'held',
		feedbackStatus: 'notInterested',
	});

	return { data };
};
