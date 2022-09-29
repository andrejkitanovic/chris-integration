import { RequestHandler } from 'express';
import { writeInFile } from 'helpers/writeInFile';
import { trelloDeleteCard, trelloSearchCard, trelloUpdateCard } from 'utils/trello';

type PipedriveActivityBody = {
	// last_notification_time: null;
	// location_street_number: null;
	type_name: 'Meeting';
	// reference_id: null;
	// location_route: null;
	public_description: string;
	// notification_language_id: null;
	subject: string;
	type: 'meeting';
	// project_id: null;
	deal_title: string;
	// original_start_time: null;
	id: number;
	deal_id: number;
	busy_flag: true | false | null;
	person_id: number;
	owner_name: string;
	// attendees: null;
	person_name: string;
	// project_title: null;
	// rec_rule_extension: null;
	done: boolean;
	created_by_user_id: number;
	// location_sublocality: null;
	// rec_rule: null;
	// location_admin_area_level_2: null;
	user_id: number;
	// location_admin_area_level_1: null;
	// org_id: null;
	// conference_meeting_client: null;
	note: string;
	due_time: string;
	// rec_master_activity_id: null;
	// location_country: null;
	active_flag: boolean;
	duration: string;
	// location_postal_code: null;
	update_time: string;
	update_user_id: number;
	// lead_title: null;
	// source_timezone: null;
	// conference_meeting_id: null;
	// org_name: null;
	// location_locality: null;
	assigned_to_user_id: number;
	// lead_id: null;
	// is_recurring: null;
	// participants: [
	// 	{
	// 		primary_flag: true;
	// 		person_id: 62;
	// 	}
	// ];
	// location_subpremise: null;
	company_id: number;
	due_date: string;
	// last_notification_user_id: null;
	// calendar_sync_include_context: null;
	// marked_as_done_time: '';
	location_formatted_address: string;
	// conference_meeting_url: null;
	location: string;
	add_time: string;
};

export const postWebhookActivityUpdated: RequestHandler = async (req, res, next) => {
	try {
		const { current }: { current: PipedriveActivityBody } = req.body;
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify(current) });

		// [TRELLO][CARD] Find -> T: Update | F: Pass
		const trelloCard = await trelloSearchCard(current.deal_title);

		if (trelloCard) {
			// await trelloUpdateCard(trelloCard.id, {});
		}

		res.json({
			message: 'Success',
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const postWebhookActivityDeleted: RequestHandler = async (req, res, next) => {
	try {
		const { current }: { current: PipedriveActivityBody } = req.body;
		await writeInFile({ path: 'logs/request.log', context: JSON.stringify(current) });

		// [TRELLO][CARD] Find -> T: Delete | F: Pass
		const trelloCard = await trelloSearchCard(current.deal_title);

		if (trelloCard) {
			await trelloDeleteCard(trelloCard.id);
		}

		res.json({
			message: 'Success',
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};
