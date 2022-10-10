import axios from 'axios';

const adversusAPI = axios.create({
	baseURL: 'https://api.adversus.dk/v1',
	auth: {
		username: 'christian@mersol.se',
		password: "Plznohack123#",
	},
});

export const adversusChangeBooking = async () => {
	const { data } = await adversusAPI.get(`/organization`);
	return { data };
};
