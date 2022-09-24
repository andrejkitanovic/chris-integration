import axios from 'axios';
import { PostAdversusBody } from 'controllers/adversus';

const pipedriveAPI = axios.create({
	baseURL: 'https://api.pipedrive.com/v1',
	params: {
		api_token: process.env.PIPEDRIVE_API_KEY,
	},
});

type PipedriveContactType = {
	// title: string;
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

export const pipedriveSearchContact = async (email: string) => {
	try {
		const { data } = await pipedriveAPI.get(`/persons/search`, {
			params: {
				term: email,
				field: 'email',
				limit: 1,
			},
		});

		if (data?.data?.items) {
			return data.data?.items[0].item;
		}
		return;
	} catch (err: any) {
		throw new Error(err);
	}
};

export const pipedriveCreateContact = async (contactData: PipedriveContactType) => {
	try {
		const { data } = await pipedriveAPI.post(`/persons`, {
			body: {
				...contactData,
			},
		});

		return data;
	} catch (err: any) {
		throw new Error(err);
	}
};

export const pipedriveDealFormat = (body: PostAdversusBody): PipedriveDealType => {
	return {
		title: `${body.namn} / ${body.adress} (${body.stad})`,
	};
};

export const pipedriveSearchDeal = async (name: string) => {
	try {
		const { data } = await pipedriveAPI.get(`/deals/search`, {
			params: {
				stage_id: process.env.PIPEDRIVE_STAGE_ID,
				term: name,
				limit: 1,
			},
		});

		if (data?.items) {
			return data.items[0].item;
		}
		return;
	} catch (err: any) {
		throw new Error(err);
	}
};

export const pipedriveCreateDeal = async (dealData: PipedriveDealType) => {
	try {
		const { data } = await pipedriveAPI.post(`/deals`, {
			body: {
				stage_id: process.env.PIPEDRIVE_STAGE_ID,
				...dealData,
			},
		});

		return data;
	} catch (err: any) {
		throw new Error(err);
	}
};

export const pipedriveUpdateDeal = async (dealId: string, dealData: PipedriveDealType) => {
	try {
		const { data } = await pipedriveAPI.put(`/deals/${dealId}`, {
			stage_id: process.env.PIPEDRIVE_STAGE_ID,
			...dealData,
		});
		return data;
	} catch (err: any) {
		throw new Error(err);
	}
};

export const pipedriveDeleteDeal = async (dealId: string) => {
	try {
		const { data } = await pipedriveAPI.delete(`/deals/${dealId}`);
		return data;
	} catch (err: any) {
		throw new Error(err);
	}
};
