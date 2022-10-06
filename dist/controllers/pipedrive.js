"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postWebhookNote = exports.postWebhookDeal = exports.postWebhookActivity = void 0;
const writeInFile_1 = require("helpers/writeInFile");
const pipedrive_1 = require("utils/pipedrive");
const trello_1 = require("utils/trello");
const postWebhookActivity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { current } = req.body;
        yield (0, writeInFile_1.writeInFile)({ path: 'logs/request.log', context: JSON.stringify(current), req });
        if (!current.deal_id)
            throw new Error();
        // [PIPEDRIVE][DEAL] Find
        const pipedriveDeal = yield (0, pipedrive_1.pipedriveGetDealById)(current.deal_id);
        // [TRELLO][CARD] Find -> T: Update | F: Pass
        const trelloCard = yield (0, trello_1.trelloSearchCard)(pipedriveDeal.title);
        if (trelloCard) {
            yield (0, trello_1.trelloUpdateCard)(trelloCard.id, pipedriveDeal);
            yield (0, trello_1.trelloUpdateCustomFieldsCard)(trelloCard.id, pipedriveDeal);
        }
        res.json({
            message: 'Success',
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.postWebhookActivity = postWebhookActivity;
// Redo för säljmöte STAGE_ID = 3
const postWebhookDeal = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { current, previous } = req.body;
        yield (0, writeInFile_1.writeInFile)({ path: 'logs/request.log', context: JSON.stringify(current), req });
        // [PIPEDRIVE][DEAL] Sync User -> Activity User
        const pipedriveActivity = yield (0, pipedrive_1.pipedriveGetActivityById)(current.next_activity_id);
        if (pipedriveActivity && current.user_id !== pipedriveActivity.user_id) {
            yield (0, pipedrive_1.pipedriveSyncActivityUser)(current.next_activity_id, current.user_id);
        }
        // [PIPEDRIVE][DEAL] If Changed state
        if (previous.stage_id !== current.stage_id) {
            const trelloCard = yield (0, trello_1.trelloSearchCard)(current.title);
            if (current.stage_id === 3 && trelloCard) {
                // If new stage id is 3 move to HELD in adversus [NOT POSSIBLE ATM]
            }
            if (current.stage_id === 10 && trelloCard) {
                // If new stage id is 10 move trello card to Double-check - FÄRDIG
                yield (0, trello_1.trelloMoveCard)(trelloCard.id, '6322d967519c050472e8df7f');
            }
        }
        res.json({
            message: 'Success',
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.postWebhookDeal = postWebhookDeal;
const postWebhookNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { current, previous } = req.body;
        yield (0, writeInFile_1.writeInFile)({ path: 'logs/request.log', context: JSON.stringify({ current, previous }), req });
        if (previous) {
            // [TRELLO][CARD] Find -> T: Delete | F: Pass
            const trelloCard = yield (0, trello_1.trelloSearchCard)(previous.deal.title);
            if (trelloCard) {
                const trelloComment = (yield (0, trello_1.trelloGetCardComments)(trelloCard.id)).find((card) => card.data.text === previous.content);
                if (trelloComment) {
                    yield (0, trello_1.trelloDeleteComment)(trelloCard.id, trelloComment.id);
                }
            }
        }
        if (current) {
            // [TRELLO][CARD] Find -> T: Update | F: Pass
            const trelloCard = yield (0, trello_1.trelloSearchCard)(current.deal.title);
            // [TRELLO][COMMENT] Create
            if (trelloCard) {
                const trelloComments = (yield (0, trello_1.trelloGetCardComments)(trelloCard.id)).map((card) => card.data.text);
                if (!trelloComments.some((comment) => comment === current.content)) {
                    yield (0, trello_1.trelloCreateComment)(trelloCard.id, current.content);
                }
            }
        }
        res.json({
            message: 'Success',
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.postWebhookNote = postWebhookNote;
