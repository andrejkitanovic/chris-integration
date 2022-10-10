import axios from 'axios';
import { AdversusBody } from 'controllers/adversus';
import dayjs from 'dayjs';

const pipedriveAPI = axios.create({
	baseURL: 'https://api.pipedrive.com/v1',
	params: {
		api_token: process.env.PIPEDRIVE_API_KEY,
	},
});

export type PipedriveContactType = {
	name: string;
	primary_email?: string;
	email: {
		value: string;
		primary: boolean;
		label: string;
	}[];
	phone: {
		value: string;
		primary: boolean;
		label: string;
	}[];
	adress?: string;
	f74cb56204d9608f9b8d4692ab034a135ae7389a?: string; // address
	f74cb56204d9608f9b8d4692ab034a135ae7389a_subpremise?: string;
	f74cb56204d9608f9b8d4692ab034a135ae7389a_street_number?: string;
	f74cb56204d9608f9b8d4692ab034a135ae7389a_route?: string;
	f74cb56204d9608f9b8d4692ab034a135ae7389a_sublocality?: string;
	f74cb56204d9608f9b8d4692ab034a135ae7389a_locality?: string;
	f74cb56204d9608f9b8d4692ab034a135ae7389a_admin_area_level_1?: string;
	f74cb56204d9608f9b8d4692ab034a135ae7389a_admin_area_level_2?: string;
	f74cb56204d9608f9b8d4692ab034a135ae7389a_country?: string;
	f74cb56204d9608f9b8d4692ab034a135ae7389a_postal_code?: string;
	f74cb56204d9608f9b8d4692ab034a135ae7389a_formatted_address?: string; // address
};

export type PipedriveDealType = {
	title: string;
	value?: string;
	currency?: string;
	user_id?: number;
	person_id?: number | PipedriveContactType;
	org_id?: number;
	pipeline_id?: number;
	status?: string;
	expected_close_date?: Date;
	probability?: number;
	lost_reason?: string;
	visible_to?: string;
	add_time?: string;
	'0c711d5c32b9fe925888b7fc9b6bc287c60d1ed0'?: string;
	d5969b61ed60673aa3143a212214d698fdc73cbc?: string;
	'780a109ebd42d15adcc56ab514ce100750ee132f'?: string;
	efdcb3fe17889df988d6f4ee668c65b14b05f276?: string;
	bda50d3b0dec33b4912759927970f53a140ed7f8?: string;
	ec565cf910b4ede8f17f61146ac4949c61b20860?: string;
	'906a1b6df1074d69790595612fc913f66b76a57a'?: string;
	'341dfa743b5a35ab9362b5221305324b72ce577b'?: string;
	'53fac6375852b2f10ec97a6475a519aa26edeeb2'?: string;
	'3da634fe9832435a890dabc393ba028bb3bef916'?: string;
	d17b936aebb47ff47a952948480a8145b58f1920?: string;
	cf494370dff95eaf4cfbfbfba800cac258eccbac?: string;
	'112c9174964820a0c99b152382c2ee0af9f31071'?: string;

	next_activity?: PipedriveActivityType;
	owner_name?: string;
	person_name?: string;
};

type PipedriveActivityType = {
	due_date: string;
	due_time: string;
	duration: string;
	deal_id: number;
	// lead_id: '<string>',
	person_id: number;
	// org_id: '<integer>',
	note?: string;
	location: string;
	public_description?: string;
	subject: string;
	type: 'meeting';
	user_id: number;
	participants?: {
		person_id: number;
		primary_flag: boolean;
	}[];
	busy_flag?: boolean;
	attendees?: {
		email_address: string;
	}[];
	done: 0 | 1;
};

// USERS

export const pipedriveSearchUser = async (email: string) => {
	if (!email) return;

	const { data } = await pipedriveAPI.get(`/users/find`, {
		params: {
			term: email,
			search_by_email: 1,
		},
	});

	if (data?.data) {
		return data.data[0];
	}
	return;
};

// CONTACTS

const pipedriveContactFormat = (body: AdversusBody): PipedriveContactType => {
	console.log('EMAIL:', body.epost);
	return {
		name: body.namn,
		email: [{ value: body.epost, primary: true, label: 'work' }],
		phone: [{ value: body.mobile, primary: true, label: 'work' }],
		f74cb56204d9608f9b8d4692ab034a135ae7389a: body.adress,
		f74cb56204d9608f9b8d4692ab034a135ae7389a_subpremise: '',
		f74cb56204d9608f9b8d4692ab034a135ae7389a_street_number: body.hem,
		f74cb56204d9608f9b8d4692ab034a135ae7389a_route: '',
		f74cb56204d9608f9b8d4692ab034a135ae7389a_sublocality: '',
		f74cb56204d9608f9b8d4692ab034a135ae7389a_locality: '',
		f74cb56204d9608f9b8d4692ab034a135ae7389a_admin_area_level_1: '',
		f74cb56204d9608f9b8d4692ab034a135ae7389a_admin_area_level_2: '',
		f74cb56204d9608f9b8d4692ab034a135ae7389a_country: 'Sweeden',
		f74cb56204d9608f9b8d4692ab034a135ae7389a_postal_code: body.postnummer,
		f74cb56204d9608f9b8d4692ab034a135ae7389a_formatted_address: body.adress,
	};
};

export const pipedriveGetContacts = async () => {
	const { data } = await pipedriveAPI.get(`/persons`);

	return data?.data;
};

export const pipedriveSearchContact = async (email: string) => {
	if (!email) return;

	const { data } = await pipedriveAPI.get(`/persons/search`, {
		params: {
			term: email,
			field: 'email',
			limit: 1,
		},
	});

	if (data?.data?.items?.length) {
		return data.data?.items[0].item;
	}
	return;
};

export const pipedriveCreateContact = async (contactData: AdversusBody) => {
	const contact = pipedriveContactFormat(contactData);
	const { data } = await pipedriveAPI.post(`/persons`, {
		...contact,
	});

	return data?.data;
};

export const pipedriveUpdateContact = async (contactId: number | string, contactData: AdversusBody) => {
	if (!contactId) return;

	const contact = pipedriveContactFormat(contactData);
	const { data } = await pipedriveAPI.put(`/persons/${contactId}`, {
		...contact,
	});

	return data?.data;
};

// DEALS

const pipedriveDealFormat = (body: AdversusBody & { pipedriveContactId?: number }): PipedriveDealType => {
	return {
		title: `${body.namn} / ${body.adress} (${body.stad})`,
		person_id: body.pipedriveContactId,
		currency: 'SEK',
		'780a109ebd42d15adcc56ab514ce100750ee132f': body.hem,
		'0c711d5c32b9fe925888b7fc9b6bc287c60d1ed0': body.typ_av_tak,
		bda50d3b0dec33b4912759927970f53a140ed7f8: body.lutning_pa_tak,
		d5969b61ed60673aa3143a212214d698fdc73cbc: body.energiforbruking,
		efdcb3fe17889df988d6f4ee668c65b14b05f276: body.placering_av_elcentral,
		ec565cf910b4ede8f17f61146ac4949c61b20860: body.har_du_fyllt_i_mobilfaltet,
	};
};

export const pipedriveGetDealById = async (dealId: number) => {
	if (!dealId) return;

	const { data } = await pipedriveAPI.get(`/deals/${dealId}`);

	if (data?.data) {
		return data.data;
	}
	return;
};

export const pipedriveSearchDeal = async (name: string) => {
	if (!name) return;

	const { data } = await pipedriveAPI.get(`/deals/search`, {
		params: {
			term: name,
			limit: 1,
		},
	});

	if (data?.data?.items?.length) {
		return data.data.items[0].item;
	}
	return;
};

export const pipedriveCreateDeal = async (dealData: AdversusBody & { pipedriveContactId: number }) => {
	const deal = pipedriveDealFormat(dealData);
	const { data } = await pipedriveAPI.post(`/deals`, {
		stage_id: process.env.PIPEDRIVE_STAGE_ID,
		...deal,
	});

	return data?.data;
};

export const pipedriveUpdateDeal = async (dealId: number | string, dealData: AdversusBody) => {
	if (!dealId) return;

	const deal = pipedriveDealFormat(dealData);
	const { data } = await pipedriveAPI.put(`/deals/${dealId}`, {
		...deal,
	});

	return data?.data;
};

export const pipedriveUpdateDealStage = async (dealId: number | string, stageId: number | string) => {
	if (!dealId || !stageId) return;

	const { data } = await pipedriveAPI.put(`/deals/${dealId}`, {
		stage_id: stageId,
	});

	return data?.data;
};

// export const pipedriveSyncDealOwner = async (dealId: number | string, ownerId: number | string) => {
// 	if (!dealId || !ownerId) return;

// 	const { data } = await pipedriveAPI.put(`/deals/${dealId}`, {
// 		user_id: ownerId,
// 	});

// 	return data?.data;
// };

export const pipedriveDeleteDeal = async (dealId: number | string) => {
	if (!dealId) return;

	const { data } = await pipedriveAPI.delete(`/deals/${dealId}`);

	return data?.data;
};

// ACTIVITY

const pipedriveActivityFormat = (
	body: AdversusBody & { dealId: number; creatorId: number; userId: number }
): PipedriveActivityType => {
	return {
		due_date: dayjs(body.meeting_time).format('YYYY-MM-DD'),
		due_time: dayjs(body.meeting_time).format('HH:mm'),
		duration: '01:00',
		deal_id: body.dealId,
		person_id: body.userId,
		// note: `Fri konsultation: Mersol / ${body.namn}`,
		location: body.adress,
		public_description: `
		Header of invitation:
		Fri konsultation: Mersol x ${body.namn}
		
		Description of invitation:
		Till mötet så vill vi att ni tar fram en el-faktura, så att vi kan göra en kalkyl på era förutsättningar.
		
		Agenda:
		- Så fungerar solceller
		- Investeringskalkyl
		- Kontroll av fastighet (edited)
		`,
		subject: `Fri konsultation: Mersol x ${body.namn}`,
		type: 'meeting',
		user_id: body.creatorId,
		attendees: [
			{
				email_address: body.epost,
			},
		],
		busy_flag: true,
		done: 0,
	};
};

export const pipedriveGetActivityById = async (activityId: string | number) => {
	if (!activityId) return;

	const { data } = await pipedriveAPI.get(`/activities/${activityId}`);

	return data?.data;
};

export const pipedriveSearchActivity = async (userId: string | number) => {
	if (!userId) return;

	const { data } = await pipedriveAPI.get(`/activities`, {
		params: {
			type: 'meeting',
			user_id: userId,
			limit: 1,
		},
	});

	if (data?.data?.length) {
		return data.data[0];
	}
	return;
};

export const pipedriveCreateActivity = async (
	activityData: AdversusBody & { dealId: number; creatorId: number; userId: number }
) => {
	const activity = pipedriveActivityFormat(activityData);
	const { data } = await pipedriveAPI.post(`/activities`, {
		...activity,
	});

	return data?.data;
};

export const pipedriveUpdateActivity = async (
	activityId: string,
	activityData: AdversusBody & { dealId: number; creatorId: number; userId: number }
) => {
	if (!activityId) return;

	const activity = pipedriveActivityFormat(activityData);
	const { data } = await pipedriveAPI.put(`/activities/${activityId}`, {
		...activity,
	});

	return data?.data;
};

export const pipedriveSyncActivityUser = async (activityId: string | number, user_id: string | number) => {
	if (!activityId || !user_id) return;

	const { data } = await pipedriveAPI.put(`/activities/${activityId}`, {
		user_id,
	});

	return data?.data;
};

export const pipedriveDeleteActivitiy = async (activityId: string | number) => {
	if (!activityId) return;

	const { data } = await pipedriveAPI.delete(`/activities/${activityId}`);

	return data?.data;
};

// NOTES

export const pipedriveCreateNote = async (dealId: number | string, content: string) => {
	const { data } = await pipedriveAPI.post(`/notes`, {
		content,
		deal_id: dealId,
	});

	return data?.data;
};
