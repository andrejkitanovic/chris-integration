import axios from 'axios';

const trelloAPI = axios.create({
	baseURL: 'https://api.trello.com',
	params: {
		key: process.env.TRELLO_API_KEY,
		token: process.env.TRELLO_OAUTH_TOKEN,
	},
});

type TrelloCardType = {
	name: string;
	desc?: string;
	pos?: 'top' | 'bottom' | number;
	due?: Date | null;
	start?: Date | null;
	dueComplete?: boolean;
	idMembers?: string[];
	idLabels?: string[];
	urlSource?: string;
	fileSource?: string;
	idCardSource?: string;
	keepFromSource?: string;
};

const trelloGetListCards = async () => {
	const { data } = await trelloAPI.get(`/1/lists/${process.env.TRELLO_LIST_ID}/cards`);
	return data;
};

export const trelloSearchCard = async (name: string) => {
	const cards = await trelloGetListCards();
	return cards.find((card: TrelloCardType) => card.name === name);
};

export const trelloCreateCard = async (cardData: TrelloCardType) => {
	const { data } = await trelloAPI.post(`/1/cards`, { idList: process.env.TRELLO_LIST_ID, ...cardData });
	return data;
};

export const trelloUpdateCard = async (cardId: string, cardData: TrelloCardType) => {
	const { data } = await trelloAPI.put(`/1/cards/${cardId}`, { idList: process.env.TRELLO_LIST_ID, ...cardData });
	return data;
};

export const trelloDeleteCard = async (cardId: string) => {
	const { data } = await trelloAPI.delete(`/1/cards/${cardId}`);
	return data;
};
