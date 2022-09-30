import { RequestHandler } from 'express';
import { writeInFile } from 'helpers/writeInFile';
import { pipedriveGetActivityById, pipedriveGetDealById, pipedriveSyncActivityUser } from 'utils/pipedrive';
import {
	trelloCreateComment,
	trelloGetCardComments,
	trelloSearchCard,
	trelloUpdateCard,
	trelloUpdateCustomFieldsCard,
} from 'utils/trello';

// [ACTIVITY] CREATED | UPDATED | MERGED | DELETED

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

		if (!current.deal_id) throw new Error();

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

// [DEAL] CREATED | UPDATED

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

		if (pipedriveActivity && current.user_id !== pipedriveActivity.user_id) {
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

// [NOTE] CREATED | UPDATED

export type PipedriveNoteBody = {
	deal: {
		title: string;
	};
	content: string;
	user_id: number;
	id: number;
	deal_id: number;
};

export const postWebhookNote: RequestHandler = async (req, res, next) => {
	try {
		const { current }: { current: PipedriveNoteBody } = req.body;
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify(current) });

		// [TRELLO][CARD] Find -> T: Update | F: Pass
		const trelloCard = await trelloSearchCard(current.deal.title);

		// [TRELLO][COMMENT] Create
		if (trelloCard) {
			const trelloComments = (await trelloGetCardComments(trelloCard.id)).map((card: any) => card.data.text);

			if (!trelloComments.some((comment: string) => comment === current.content)) {
				await trelloCreateComment(trelloCard.id, current.content);
			}
		}

		res.json({
			message: 'Success',
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};
