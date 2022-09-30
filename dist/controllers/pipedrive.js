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
exports.postWebhookActivityDeleted = exports.postWebhookActivityUpdated = exports.postWebhookActivityCreated = void 0;
const writeInFile_1 = require("helpers/writeInFile");
const pipedrive_1 = require("utils/pipedrive");
const trello_1 = require("utils/trello");
const postWebhookActivityCreated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { current } = req.body;
        yield (0, writeInFile_1.writeInFile)({ path: 'logs/request.log', context: JSON.stringify(current) });
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
exports.postWebhookActivityCreated = postWebhookActivityCreated;
const postWebhookActivityUpdated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { current } = req.body;
        yield (0, writeInFile_1.writeInFile)({ path: 'logs/request.log', context: JSON.stringify(current) });
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
exports.postWebhookActivityUpdated = postWebhookActivityUpdated;
const postWebhookActivityDeleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { current } = req.body;
        yield (0, writeInFile_1.writeInFile)({ path: 'logs/request.log', context: JSON.stringify(current) });
        // [PIPEDRIVE][DEAL] Find
        const pipedriveDeal = yield (0, pipedrive_1.pipedriveGetDealById)(current.deal_id);
        // [TRELLO][CARD] Find -> T: Delete | F: Pass
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
exports.postWebhookActivityDeleted = postWebhookActivityDeleted;
