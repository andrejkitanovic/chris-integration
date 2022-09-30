import axios from 'axios';
import dayjs from 'dayjs';
import { PipedriveDealType } from './pipedrive';

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

const trelloCardFormat = (body: PipedriveDealType): TrelloCardType => {
	return {
		name: body.title,
		desc: body.next_activity?.public_description ?? '',
		due: body.next_activity
			? dayjs(`${body.next_activity?.due_date} ${body.next_activity?.due_time}`).subtract(1, 'day').toDate()
			: null,
	};
};

const trelloGetListCards = async () => {
	const { data } = await trelloAPI.get(`/1/lists/${process.env.TRELLO_LIST_ID}/cards`);
	return data;
};

export const trelloSearchCard = async (name: string) => {
	if (!name) return;

	const cards = await trelloGetListCards();
	return cards.find((card: TrelloCardType) => card.name === name);
};

export const trelloCreateCard = async (cardData: PipedriveDealType) => {
	const card = trelloCardFormat(cardData);
	const { data } = await trelloAPI.post(`/1/cards`, { idList: process.env.TRELLO_LIST_ID, ...card });
	return data;
};

export const trelloUpdateCard = async (cardId: string, cardData: PipedriveDealType) => {
	if (!cardId) return;

	const card = trelloCardFormat(cardData);
	const { data } = await trelloAPI.put(`/1/cards/${cardId}`, { idList: process.env.TRELLO_LIST_ID, ...card });
	return data;
};

export const trelloDeleteCard = async (cardId: string) => {
	if (!cardId) return;
	
	const { data } = await trelloAPI.delete(`/1/cards/${cardId}`);
	return data;
};
