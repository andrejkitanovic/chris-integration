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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipedriveDeleteDeal = exports.pipedriveUpdateDeal = exports.pipedriveCreateDeal = exports.pipedriveSearchDeal = exports.pipedriveUpdateContact = exports.pipedriveCreateContact = exports.pipedriveSearchContact = exports.pipedriveGetContacts = void 0;
const axios_1 = __importDefault(require("axios"));
const pipedriveAPI = axios_1.default.create({
    baseURL: 'https://api.pipedrive.com/v1',
    params: {
        api_token: process.env.PIPEDRIVE_API_KEY,
    },
});
// CONTACTS
const pipedriveContactFormat = (body) => {
    return {
        name: body.namn,
        email: [{ value: body.epost, primary: true, label: 'work' }],
        phone: [{ value: body.mobile, primary: true, label: 'work' }],
        f74cb56204d9608f9b8d4692ab034a135ae7389a: body.adress,
        f74cb56204d9608f9b8d4692ab034a135ae7389a_subpremise: '',
        f74cb56204d9608f9b8d4692ab034a135ae7389a_street_number: body.hem,
        f74cb56204d9608f9b8d4692ab034a135ae7389a_route: '',
        f74cb56204d9608f9b8d4692ab034a135ae7389a_sublocality: '',
        f74cb56204d9608f9b8d4692ab034a135ae7389a_locality: '',
        f74cb56204d9608f9b8d4692ab034a135ae7389a_admin_area_level_1: '',
        f74cb56204d9608f9b8d4692ab034a135ae7389a_admin_area_level_2: '',
        f74cb56204d9608f9b8d4692ab034a135ae7389a_country: 'Sweeden',
        f74cb56204d9608f9b8d4692ab034a135ae7389a_postal_code: body.postnummer,
        f74cb56204d9608f9b8d4692ab034a135ae7389a_formatted_address: body.adress,
    };
};
const pipedriveGetContacts = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield pipedriveAPI.get(`/persons`);
    return data === null || data === void 0 ? void 0 : data.data;
});
exports.pipedriveGetContacts = pipedriveGetContacts;
const pipedriveSearchContact = (email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { data } = yield pipedriveAPI.get(`/persons/search`, {
        params: {
            term: email,
            field: 'email',
            limit: 1,
        },
    });
    if ((_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length) {
        return (_c = data.data) === null || _c === void 0 ? void 0 : _c.items[0].item;
    }
    return;
});
exports.pipedriveSearchContact = pipedriveSearchContact;
const pipedriveCreateContact = (contactData) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = pipedriveContactFormat(contactData);
    const { data } = yield pipedriveAPI.post(`/persons`, Object.assign({}, contact));
    return data === null || data === void 0 ? void 0 : data.data;
});
exports.pipedriveCreateContact = pipedriveCreateContact;
const pipedriveUpdateContact = (contactId, contactData) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = pipedriveContactFormat(contactData);
    const { data } = yield pipedriveAPI.put(`/persons/${contactId}`, Object.assign({}, contact));
    return data === null || data === void 0 ? void 0 : data.data;
});
exports.pipedriveUpdateContact = pipedriveUpdateContact;
// DEALS
const pipedriveDealFormat = (body) => {
    return {
        title: `${body.namn} / ${body.adress} (${body.stad})`,
        person_id: body.pipedriveContactId,
        currency: 'SEK',
    };
};
const pipedriveSearchDeal = (name) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    const { data } = yield pipedriveAPI.get(`/deals/search`, {
        params: {
            stage_id: process.env.PIPEDRIVE_STAGE_ID,
            term: name,
            limit: 1,
        },
    });
    if ((_e = (_d = data === null || data === void 0 ? void 0 : data.data) === null || _d === void 0 ? void 0 : _d.items) === null || _e === void 0 ? void 0 : _e.length) {
        return data.data.items[0].item;
    }
    return;
});
exports.pipedriveSearchDeal = pipedriveSearchDeal;
const pipedriveCreateDeal = (dealData) => __awaiter(void 0, void 0, void 0, function* () {
    const deal = pipedriveDealFormat(dealData);
    const { data } = yield pipedriveAPI.post(`/deals`, Object.assign({ stage_id: process.env.PIPEDRIVE_STAGE_ID }, deal));
    return data === null || data === void 0 ? void 0 : data.data;
});
exports.pipedriveCreateDeal = pipedriveCreateDeal;
const pipedriveUpdateDeal = (dealId, dealData) => __awaiter(void 0, void 0, void 0, function* () {
    const deal = pipedriveDealFormat(dealData);
    const { data } = yield pipedriveAPI.put(`/deals/${dealId}`, Object.assign({ stage_id: process.env.PIPEDRIVE_STAGE_ID }, deal));
    return data === null || data === void 0 ? void 0 : data.data;
});
exports.pipedriveUpdateDeal = pipedriveUpdateDeal;
const pipedriveDeleteDeal = (dealId) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield pipedriveAPI.delete(`/deals/${dealId}`);
    return data === null || data === void 0 ? void 0 : data.data;
});
exports.pipedriveDeleteDeal = pipedriveDeleteDeal;
// ACTIVITY
