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
    try {
        const { action, model } = req.body;
        if ((action === null || action === void 0 ? void 0 : action.type) === 'addAttachmentToCard') {
            const attachment = action.display.entities.attachment;
            const deal = yield (0, pipedrive_1.pipedriveSearchDeal)(model.name);
            if (deal) {
                yield (0, pipedrive_1.pipedriveCreateNote)(deal.id, `[${attachment.url}] ${attachment.text}`);
            }
            // MOVE TO Redo för säljmöte
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
