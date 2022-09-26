import { RequestHandler } from 'express';
import { writeInFile } from 'helpers/writeInFile';
import {
	pipedriveSearchDeal,
	pipedriveCreateDeal,
	pipedriveUpdateDeal,
	pipedriveDeleteDeal,
	pipedriveCreateContact,
	pipedriveUpdateContact,
	pipedriveSearchContact,
	pipedriveCreateActivity,
	pipedriveSearchUser,
} from 'utils/pipedrive';
import User from 'models/user';
import { useGoogle } from 'utils/google';

export type AdversusBody = {
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
	user_email: string; // Meeting with
	meeting_time: string;
};

export const postWebhookBookingCreated: RequestHandler = async (req, res, next) => {
	try {
		const requestBody: AdversusBody = req.body;
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify(req.body) });

		// [PIPEDRIVE][CONTACT] Creartor Find -> T: Use | F: Pass
		const pipedriveCreator = await pipedriveSearchUser(requestBody.user_email);

		// [PIPEDRIVE][CONTACT] Find -> T: Use | F: Create
		let pipedriveContact = await pipedriveSearchContact(requestBody.epost);

		if (!pipedriveContact) {
			pipedriveContact = await pipedriveCreateContact(requestBody);
		}

		// [PIPEDRIVE][DEAL] Create
		const deal = await pipedriveCreateDeal({ ...requestBody, pipedriveContactId: pipedriveContact?.id });

		// [GOOGLE][MEETING] Find -> T: Delete | F: Pass
		const user = await User.findOne({ email: requestBody.user_email });

		if (user) {
			const { googleGetCalendarSearchEvent, googleDeleteCalendarEvent } = await useGoogle(user);
			const meeting = await googleGetCalendarSearchEvent(requestBody.meeting_time);

			if (meeting) {
				await googleDeleteCalendarEvent(meeting.id);
			}
		}

		// [PIPEDRIVE][ACTIVITY] Create Meeting
		if (deal && pipedriveCreator && pipedriveContact) {
			await pipedriveCreateActivity({
				...requestBody,
				dealId: deal.id,
				creatorId: pipedriveCreator.id,
				userId: pipedriveContact.id,
			});
		}

		res.json({
			message: 'Success',
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const postWebhookBookingUpdated: RequestHandler = async (req, res, next) => {
	try {
		const requestBody: AdversusBody = req.body;
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify(req.body) });

		// [PIPEDRIVE][CONTACT] Find -> T: Update | F: Pass
		let pipedriveContact = await pipedriveSearchContact(requestBody.epost);

		if (pipedriveContact) {
			pipedriveContact = await pipedriveUpdateContact(pipedriveContact?.id, requestBody);
		}

		// [PIPEDRIVE][DEAL] Update -> T: Update | F: Pass
		const pipedriveDeal = await pipedriveSearchDeal(
			`${requestBody.namn} / ${requestBody.adress} (${requestBody.stad})`
		);

		if (pipedriveDeal) {
			await pipedriveUpdateDeal(pipedriveDeal?.id, requestBody);
		}

		// [GOOGLE][MEETING] Delete
		const user = await User.findOne({ email: requestBody.user_email });

		if (user) {
			const { googleGetCalendarSearchEvent, googleDeleteCalendarEvent } = await useGoogle(user);
			const meeting = await googleGetCalendarSearchEvent(requestBody.meeting_time);

			if (meeting) {
				await googleDeleteCalendarEvent(meeting.id);
			}
		}

		// [PIPEDRIVE][ACTIVITY] Update Meeting

		res.json({
			message: 'Success',
		});
	} catch (err) {
		next(err);
	}
};

export const postWebhookBookingDeleted: RequestHandler = async (req, res, next) => {
	try {
		const requestBody: AdversusBody = req.body;
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify(req.body) });

		// [PIPEDRIVE][ACTIVITY] Delete Meeting

		// [PIPEDRIVE][DEAL] Find -> T: Delete | F: Pass
		const pipedriveDeal = await pipedriveSearchDeal(
			`${requestBody.namn} / ${requestBody.adress} (${requestBody.stad})`
		);

		if (pipedriveDeal) {
			await pipedriveDeleteDeal(pipedriveDeal?.id);
		}

		// [GOOGLE][MEETING] Find -> T: Delete | F: Pass
		const user = await User.findOne({ email: requestBody.user_email });

		if (user) {
			const { googleGetCalendarSearchEvent, googleDeleteCalendarEvent } = await useGoogle(user);
			const meeting = await googleGetCalendarSearchEvent(requestBody.meeting_time);

			if (meeting) {
				await googleDeleteCalendarEvent(meeting.id);
			}
		}

		res.json({
			message: 'Success',
		});
	} catch (err) {
		next(err);
	}
};
