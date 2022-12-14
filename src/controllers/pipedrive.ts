import dayjs from 'dayjs';
import { RequestHandler } from 'express';
import { writeInFile } from 'helpers/writeInFile';
import { adversusSeachBooking, adversusUpdateBooking } from 'utils/adversus';
import {
	pipedriveGetActivityById,
	pipedriveGetActivityDealById,
	pipedriveGetDealById,
	pipedriveSyncActivityUser,
	pipedriveUpdateDealStage,
} from 'utils/pipedrive';
import {
	trelloCreateComment,
	trelloDeleteCard,
	trelloDeleteComment,
	trelloGetCardComments,
	trelloMoveCard,
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
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify(current), req });

		if (current?.deal_id) {
			// [PIPEDRIVE][DEAL] Find
			const pipedriveDeal = await pipedriveGetDealById(current.deal_id);

			// [TRELLO][CARD] Find -> T: Update | F: Pass
			const trelloCard = await trelloSearchCard(pipedriveDeal.title);

			if (trelloCard) {
				await trelloUpdateCard(trelloCard.id, pipedriveDeal);
				await trelloUpdateCustomFieldsCard(trelloCard.id, pipedriveDeal);
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

// [DEAL] CREATED | UPDATED | DELETED | MERGED

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
	stage_id?: number;
};

// Redo f??r s??ljm??te STAGE_ID = 3
export const postWebhookDeal: RequestHandler = async (req, res, next) => {
	try {
		const { current, previous }: { current: PipedriveDealBody; previous: PipedriveDealBody } = req.body;
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify(current), req });

		if (current) {
			// [PIPEDRIVE][DEAL] Sync User -> Activity User
			const pipedriveActivity = await pipedriveGetActivityById(current.next_activity_id);

			if (pipedriveActivity && current.user_id !== pipedriveActivity.user_id) {
				await pipedriveSyncActivityUser(current.next_activity_id, current.user_id);
			}

			// [PIPEDRIVE][DEAL] If Changed state
			if (previous?.stage_id !== current?.stage_id) {
				const trelloCard = await trelloSearchCard(current.title);

				if (current?.stage_id === 3 && trelloCard) {
					// If new stage id is 3 move to HELD in adversus [NOT POSSIBLE ATM]

					const formatDate = dayjs(`${pipedriveActivity.due_date} ${pipedriveActivity.due_time}`)
						.add(2, 'hour')
						.toISOString()
						.replace('.000Z', 'Z');
					const adversusBooking = await adversusSeachBooking(formatDate);

					if (adversusBooking) {
						await adversusUpdateBooking(adversusBooking.id);
					}
				}
				if (current?.stage_id === 10 && trelloCard) {
					// If new stage id is 10 move trello card to Double-check - BEH??VS
					await trelloMoveCard(trelloCard.id, '6322d940fd272403d017a3fe');
				}

				if (current?.stage_id === 4) {
					const activities = await pipedriveGetActivityDealById(current.id);

					if (activities && activities.related_objects && activities.related_objects['deal']) {
						// The contract is signed by person. Deal is moved to ???Avtal signerat???.
						if (Object.values(activities.related_objects['deal']).find((deal) => Boolean(deal))) {
							await pipedriveUpdateDealStage(current.id, 5);
							// Move the Trello card to another column ???Avtal signerat - Projekt redo
							await trelloMoveCard(trelloCard.id, '63297f5c7b90be017b4bac3f');
						}
					}
				}
			}
		} else if (previous) {
			const trelloCard = await trelloSearchCard(previous.title);

			if (trelloCard) {
				await trelloDeleteCard(trelloCard.id);
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
		const { current, previous }: { current: PipedriveNoteBody | null; previous: PipedriveNoteBody | null } = req.body;
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify({ current, previous }), req });

		if (previous) {
			// [TRELLO][CARD] Find -> T: Delete | F: Pass
			const trelloCard = await trelloSearchCard(previous.deal.title);

			if (trelloCard) {
				const trelloComment = (await trelloGetCardComments(trelloCard.id)).find(
					(card: any) => card.data.text === previous.content
				);

				if (trelloComment) {
					await trelloDeleteComment(trelloCard.id, trelloComment.id);
				}
			}
		}

		if (current) {
			// [TRELLO][CARD] Find -> T: Update | F: Pass
			const trelloCard = await trelloSearchCard(current.deal.title);

			// [TRELLO][COMMENT] Create
			if (trelloCard) {
				const trelloComments = (await trelloGetCardComments(trelloCard.id)).map((card: any) => card.data.text);

				if (!trelloComments.some((comment: string) => comment === current.content)) {
					await trelloCreateComment(trelloCard.id, current.content);
				}
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
