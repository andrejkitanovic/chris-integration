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
exports.postTrelloCard = exports.getTrello = void 0;
const pipedrive_1 = require("utils/pipedrive");
const getTrello = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            message: '[WEBHOOK] Active',
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.getTrello = getTrello;
const postTrelloCard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { action, model } = req.body;
        const deal = yield (0, pipedrive_1.pipedriveSearchDeal)(model === null || model === void 0 ? void 0 : model.name);
        if ((action === null || action === void 0 ? void 0 : action.type) === 'addAttachmentToCard') {
            const attachment = action.display.entities.attachment;
            if (deal) {
                yield (0, pipedrive_1.pipedriveCreateNote)(deal.id, `[${attachment.url}] ${attachment.text}`);
                // [PIPEDRIVE] MOVE TO Redo för säljmöte
                if (deal.stage_id === 2) {
                    yield (0, pipedrive_1.pipedriveUpdateDealStage)(deal.id, 7);
                }
            }
        }
        else if ((action === null || action === void 0 ? void 0 : action.type) === 'updateCard') {
            if (((_a = action === null || action === void 0 ? void 0 : action.data) === null || _a === void 0 ? void 0 : _a.listAfter) &&
                ((_b = action === null || action === void 0 ? void 0 : action.data) === null || _b === void 0 ? void 0 : _b.listBefore) &&
                (action === null || action === void 0 ? void 0 : action.data.listAfter.name) === 'Double-check - FÄRDIG') {
                if (deal) {
                    // [PIPEDRIVE] MOVE TO Double-check Färdig
                    yield (0, pipedrive_1.pipedriveUpdateDealStage)(deal.id, 11);
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
exports.postTrelloCard = postTrelloCard;
