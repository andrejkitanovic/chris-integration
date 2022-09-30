import { RequestHandler } from 'express';
import { writeInFile } from 'helpers/writeInFile';
import { pipedriveGetActivityById, pipedriveGetDealById, pipedriveSyncActivityUser } from 'utils/pipedrive';
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
	id: number;
	person_id: number;
	creator_user_id: number;
	owner_name: string;
	active: boolean;
	person_name: string;
	next_activity_id: number;
	user_id: number;
	notes_count: number;
	title: string;
};

export const postWebhookDeal: RequestHandler = async (req, res, next) => {
	try {
		const { current }: { current: PipedriveDealBody } = req.body;
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify(current) });

		// [PIPEDRIVE][DEAL] Sync User -> Activity User
		const pipedriveActivity = await pipedriveGetActivityById(current.next_activity_id);

		if (current.user_id !== pipedriveActivity.user_id) {
			await pipedriveSyncActivityUser(current.next_activity_id, current.user_id);
		}

		res.json({
			message: 'Success',
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};
