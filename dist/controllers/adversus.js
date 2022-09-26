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
exports.postWebhookBookingDeleted = exports.postWebhookBookingUpdated = exports.postWebhookBookingCreated = void 0;
const writeInFile_1 = require("helpers/writeInFile");
const pipedrive_1 = require("utils/pipedrive");
const postWebhookBookingCreated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestBody = req.body;
        yield (0, writeInFile_1.writeInFile)({ path: 'logs/request.log', context: JSON.stringify(req.body) });
        // [PIPEDRIVE][CONTACT] Creartor Find -> T: Use | F: Create
        // [PIPEDRIVE][CONTACT] Find -> T: Use | F: Create
        let pipedriveContact = yield (0, pipedrive_1.pipedriveSearchContact)(requestBody.epost);
        if (!pipedriveContact) {
            pipedriveContact = yield (0, pipedrive_1.pipedriveCreateContact)(requestBody);
        }
        // [PIPEDRIVE][DEAL] Create
        yield (0, pipedrive_1.pipedriveCreateDeal)(Object.assign(Object.assign({}, requestBody), { pipedriveContactId: pipedriveContact === null || pipedriveContact === void 0 ? void 0 : pipedriveContact.id }));
        // [GOOGLE][MEETING] Find -> T: Delete | F: Pass
        // const user = await User.findOne({ email: requestBody.user_email });
        // if (user) {
        // 	const { googleGetCalendarSearchEvent } = await useGoogle(user);
        // }
        res.json({
            message: 'Success',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.postWebhookBookingCreated = postWebhookBookingCreated;
const postWebhookBookingUpdated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestBody = req.body;
        yield (0, writeInFile_1.writeInFile)({ path: 'logs/request.log', context: JSON.stringify(req.body) });
        // [PIPEDRIVE][CONTACT] Find -> T: Update | F: Pass
        let pipedriveContact = yield (0, pipedrive_1.pipedriveSearchContact)(requestBody.epost);
        if (pipedriveContact) {
            pipedriveContact = yield (0, pipedrive_1.pipedriveUpdateContact)(pipedriveContact === null || pipedriveContact === void 0 ? void 0 : pipedriveContact.id, requestBody);
        }
        // [PIPEDRIVE][DEAL] Update -> T: Update | F: Pass
        const pipedriveDeal = yield (0, pipedrive_1.pipedriveSearchDeal)(`${requestBody.namn} / ${requestBody.adress} (${requestBody.stad})`);
        if (pipedriveDeal) {
            yield (0, pipedrive_1.pipedriveUpdateDeal)(pipedriveDeal === null || pipedriveDeal === void 0 ? void 0 : pipedriveDeal.id, requestBody);
        }
        // [GOOGLE][MEETING] Delete
        // const user = await User.findOne({ email: requestBody.user_email });
        // if (user) {
        // 	const { googleGetCalendarSearchEvent } = await useGoogle(user);
        // }
        res.json({
            message: 'Success',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.postWebhookBookingUpdated = postWebhookBookingUpdated;
const postWebhookBookingDeleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestBody = req.body;
        yield (0, writeInFile_1.writeInFile)({ path: 'logs/request.log', context: JSON.stringify(req.body) });
        // [PIPEDRIVE][DEAL] Find -> T: Delete | F: Pass
        const pipedriveDeal = yield (0, pipedrive_1.pipedriveSearchDeal)(`${requestBody.namn} / ${requestBody.adress} (${requestBody.stad})`);
        if (pipedriveDeal) {
            yield (0, pipedrive_1.pipedriveDeleteDeal)(pipedriveDeal === null || pipedriveDeal === void 0 ? void 0 : pipedriveDeal.id);
        }
        // [GOOGLE][MEETING] Find -> T: Delete | F: Pass
        // const user = await User.findOne({ email: requestBody.user_email });
        // if (user) {
        // 	const { googleGetCalendarSearchEvent } = await useGoogle(user);
        // }
        res.json({
            message: 'Success',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.postWebhookBookingDeleted = postWebhookBookingDeleted;