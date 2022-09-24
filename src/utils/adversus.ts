import axios from 'axios';

const adversusAPI = axios.create({
	baseURL: 'https://api.adversus.io',
	params: {},
});

export const adversusGetLeads = async (boardId: string) => {
	try {
		const { data } = await adversusAPI.get(`/1/boards/${boardId}/lists`);
		return { data };
	} catch (err: any) {
		throw new Error(err);
	}
};
