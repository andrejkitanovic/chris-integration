import { RequestHandler } from 'express';
import { pipedriveSearchDeal, pipedriveCreateDeal, pipedriveUpdateDeal, pipedriveDeleteDeal } from 'utils/pipedrive';
import { trelloSearchCard, trelloCreateCard, trelloUpdateCard, trelloDeleteCard } from 'utils/trello';

export type PostAdversusBody = {
	adress: string;
	apartment: string;
	bekraftelse: string;
	building_year: string;
	energiforbruking: string;
	epost: string;
	har_du_fyllt_i_mobilfaltet: string;
	hem: string;
	land_area: string;
	living: string;
	living_area: string;
	lutning_pa_tak: string;
	mobile: string;
	mote_kommentar: string;
	mote_tid: string;
	namn: string;
	placering_av_elcentral: string;
	postnummer: string;
	stad: string;
	telefon: string;
	typ_av_tak: string;
	contact_id: string;
};

export const postWebhookBookingCreated: RequestHandler = async (req, res, next) => {
	try {
		// const {} = req.body;

		// [PIPEDRIVE][CONTACT] Create / Find

		// [PIPEDRIVE][DEAL] Create
		await pipedriveCreateDeal({
			title: '',
		});

		// [GOOGLE][MEETING] Cancel

		// [TRELLO][CARD] Create
		await trelloCreateCard({
			name: '',
		});

		res.json({
			message: 'Success',
		});
	} catch (err) {
		next(err);
	}
};

export const postWebhookBookingUpdated: RequestHandler = async (req, res, next) => {
	try {
		// const {} = req.body;

		// [PIPEDRIVE][CONTACT] Find

		// [PIPEDRIVE][DEAL] Update
		const pipedriveDeal = await pipedriveSearchDeal('');
		await pipedriveUpdateDeal(pipedriveDeal?.id, {
			title: '',
		});

		// [GOOGLE][MEETING] Cancel

		// [TRELLO][CARD] Update
		const trelloCardId = (await trelloSearchCard(''))?.id;
		await trelloUpdateCard(trelloCardId, {
			name: '',
		});

		res.json({
			message: 'Success',
		});
	} catch (err) {
		next(err);
	}
};

export const postWebhookBookingDeleted: RequestHandler = async (req, res, next) => {
	try {
		// const {} = req.body;

		// [PIPEDRIVE][DEAL] Delete
		const pipedriveDeal = await pipedriveSearchDeal('');
		await pipedriveDeleteDeal(pipedriveDeal?.id);

		// [GOOGLE][MEETING] Cancel

		// [TRELLO][CARD] Delete
		const trelloCardId = (await trelloSearchCard(''))?.id;
		await trelloDeleteCard(trelloCardId);

		res.json({
			message: 'Success',
		});
	} catch (err) {
		next(err);
	}
};
