import axios from 'axios';
import { AdversusBody } from 'controllers/adversus';

const pipedriveAPI = axios.create({
	baseURL: 'https://api.pipedrive.com/v1',
	params: {
		api_token: process.env.PIPEDRIVE_API_KEY,
	},
});

type PipedriveContactType = {
	name: string;
	primary_email?: string;
	email?: {
		value: string;
		primary: boolean;
		label: string;
	}[];
	phone?: {
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

type PipedriveDealType = {
	title: string;
	value?: string;
	currency?: string;
	user_id?: number;
	person_id?: number;
	org_id?: number;
	pipeline_id?: number;
	status?: string;
	expected_close_date?: Date;
	probability?: number;
	lost_reason?: string;
	visible_to?: string;
	add_time?: string;
};

// CONTACTS

const pipedriveContactFormat = (body: AdversusBody): PipedriveContactType => {
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

export const pipedriveUpdateContact = async (contactId: string, contactData: AdversusBody) => {
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
	};
};

export const pipedriveSearchDeal = async (name: string) => {
	const { data } = await pipedriveAPI.get(`/deals/search`, {
		params: {
			stage_id: process.env.PIPEDRIVE_STAGE_ID,
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

export const pipedriveUpdateDeal = async (dealId: string, dealData: AdversusBody) => {
	const deal = pipedriveDealFormat(dealData);
	const { data } = await pipedriveAPI.put(`/deals/${dealId}`, {
		stage_id: process.env.PIPEDRIVE_STAGE_ID,
		...deal,
	});

	return data?.data;
};

export const pipedriveDeleteDeal = async (dealId: string) => {
	const { data } = await pipedriveAPI.delete(`/deals/${dealId}`);

	return data?.data;
};

// ACTIVITY