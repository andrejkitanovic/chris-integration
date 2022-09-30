import axios from 'axios';
import dayjs from 'dayjs';
import { PipedriveContactType, PipedriveDealType } from './pipedrive';

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

type TrelloCardCustomFieldsType = {
	'633704728e0134015068a893': string; // Address
	'63370548efc8a70389777cfb': string; // Owner
	'633705063358d800d391b693': string; // Huvudsäkring
	'63370443931e2701b93c4145': string; // Firstname
	'63370468acfe6205cae1b7ac': string; // Lastname
	'633704e56df6ca01205d85ad': string; // Email
	'633704fe78625e0017de625d': string; // Phone Number
	'63370510b7016f01cf86959a': string; // Taktyp
	'6337051e5a9e3d0045e504e6': string; // Årsförbrukning
	'633705294a7adf00d0530228': string; // Taklutning
	'6337053160b5c9029d964a91': string; // Anläggningsid
	'63370541ac93bf007756fc63': string; // Placering av elcentral/mätare
};

const trelloCustomFieldsFormat = (body: PipedriveDealType): TrelloCardCustomFieldsType => {
	return {
		'633704728e0134015068a893': body?.next_activity?.location ?? '', // Address
		'63370548efc8a70389777cfb': body?.owner_name ?? '', // Owner
		'633705063358d800d391b693': '', // Huvudsäkring
		'63370443931e2701b93c4145': body?.person_name?.split(' ')[0] ?? '', // Firstname
		'63370468acfe6205cae1b7ac': body?.person_name?.split(' ')[1] ?? '', // Lastname
		'633704e56df6ca01205d85ad': (body?.person_id as PipedriveContactType)?.email[0].value ?? '', // Email
		'633704fe78625e0017de625d': (body?.person_id as PipedriveContactType)?.phone[0].value ?? '', // Phone Number
		'63370510b7016f01cf86959a': '', // Taktyp
		'6337051e5a9e3d0045e504e6': '', // Årsförbrukning
		'633705294a7adf00d0530228': '', // Taklutning
		'6337053160b5c9029d964a91': '', // Anläggningsid
		'63370541ac93bf007756fc63': '', // Placering av elcentral/mätare
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

export const trelloGetCustomFieldsCard = async (cardId: string) => {
	const { data } = await trelloAPI.get(`/1/cards/${cardId}/customFieldItems`);
	return data;
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

export const trelloUpdateCustomFieldsCard = async (cardId: string, customFieldsData: PipedriveDealType) => {
	if (!cardId) return;

	const customFieldsObject = trelloCustomFieldsFormat(customFieldsData);
	const customFields = Object.keys(customFieldsObject).filter((key) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		return Boolean(customFieldsObject[key]);
	});

	customFields.forEach(async (key) => {
		await trelloAPI.put(`/1/cards/${cardId}/customField/${key}/item`, {
			value: {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				text: customFieldsObject[key] ?? '',
			},
		});
	});

	return;
};

export const trelloDeleteCard = async (cardId: string) => {
	if (!cardId) return;

	const { data } = await trelloAPI.delete(`/1/cards/${cardId}`);
	return data;
};
