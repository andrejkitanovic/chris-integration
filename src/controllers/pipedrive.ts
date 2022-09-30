import { RequestHandler } from 'express';
import { writeInFile } from 'helpers/writeInFile';
import { pipedriveGetDealById, pipedriveSyncDealOwner } from 'utils/pipedrive';
import { trelloSearchCard, trelloUpdateCard, trelloUpdateCustomFieldsCard } from 'utils/trello';

export type PipedriveActivityBody = {
	type_name: 'Meeting';
	public_description: string;
	subject: string;
	type: 'meeting';
	deal_title: string;
	id: number;
	deal_id: number;
	busy_flag: true | false | null;
	person_id: number;
	owner_name: string;
	person_name: string;
	done: boolean;
	created_by_user_id: number;
	user_id: number;
	note: string;
	due_time: string;
	active_flag: boolean;
	duration: string;
	update_time: string;
	update_user_id: number;
	assigned_to_user_id: number;
	company_id: number;
	due_date: string;
	location_formatted_address: string;
	location: string;
	add_time: string;
};

export const postWebhookActivity: RequestHandler = async (req, res, next) => {
	try {
		const { current }: { current: PipedriveActivityBody } = req.body;
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify(current) });

		// [PIPEDRIVE][DEAL] Find
		const pipedriveDeal = await pipedriveGetDealById(current.deal_id);

		// [TRELLO][CARD] Find -> T: Update | F: Pass
		const trelloCard = await trelloSearchCard(pipedriveDeal.title);

		if (trelloCard) {
			await trelloUpdateCard(trelloCard.id, pipedriveDeal);
			await trelloUpdateCustomFieldsCard(trelloCard.id, pipedriveDeal);
		}

		res.json({
			message: 'Success',
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export type PipedriveDealBody = {
	// ec565cf910b4ede8f17f61146ac4949c61b20860: string;
	// email_messages_count: number;
	// cc_email: string;
	// products_count: number;
	// bda50d3b0dec33b4912759927970f53a140ed7f8: string;
	// next_activity_date: '2022-10-04';
	// next_activity_type: 'meeting';
	// next_activity_duration: '01:00:00';
	id: number;
	// person_id: 185;
	creator_user_id: number;
	// expected_close_date: null;
	// owner_name: 'simon';
	// participants_count: 1;
	// group_name: null;
	// stage_id: 2;
	// probability: null;
	// undone_activities_count: 1;
	// renewal_type: 'one_time';
	// d5969b61ed60673aa3143a212214d698fdc73cbc: '125612';
	// active: true;
	// person_name: 'BigDick Andrej';
	// last_activity_date: null;
	// '780a109ebd42d15adcc56ab514ce100750ee132f': '';
	// close_time: null;
	// org_hidden: false;
	// next_activity_id: 516;
	// weighted_value_currency: 'SEK';
	// stage_order_nr: 1;
	// next_activity_subject: 'Fri konsultation: Mersol / BigDick Andrej';
	// rotten_time: null;
	user_id: number;
	// visible_to: '1';
	// org_id: null;
	// notes_count: 0;
	// next_activity_time: '08:30:00';
	// formatted_value: '0 kr';
	// '0c711d5c32b9fe925888b7fc9b6bc287c60d1ed0': 'Tegel';
	// status: 'open';
	// formatted_weighted_value: '0 kr';
	// first_won_time: null;
	// last_outgoing_mail_time: null;
	title: string;
	// last_activity_id: null;
	// update_time: '2022-09-30 17:34:16';
	// activities_count: 1;
	// pipeline_id: 1;
	// lost_time: null;
	// currency: 'SEK';
	// weighted_value: 0;
	// org_name: null;
	// value: 0;
	// person_hidden: false;
	// next_activity_note: null;
	// efdcb3fe17889df988d6f4ee668c65b14b05f276: 'Nära elskåp';
	// files_count: 0;
	// last_incoming_mail_time: null;
	// label: null;
	// lost_reason: null;
	// deleted: false;
	// won_time: null;
	// group_id: null;
	// followers_count: 2;
	// stage_change_time: null;
	// add_time: '2022-09-30 14:22:40';
	// done_activities_count: 0;
};

export const postWebhookDealUpdated: RequestHandler = async (req, res, next) => {
	try {
		const { current }: { current: PipedriveDealBody } = req.body;
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify(current) });

		// [PIPEDRIVE][DEAL] Sync Creator -> User
		if (current.creator_user_id !== current.user_id) {
			await pipedriveSyncDealOwner(current.id, current.user_id)
		}

		res.json({
			message: 'Success',
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};
