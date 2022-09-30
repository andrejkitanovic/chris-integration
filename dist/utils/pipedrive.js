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
exports.pipedriveDeleteActivitiy = exports.pipedriveUpdateActivitiy = exports.pipedriveCreateActivity = exports.pipedriveSearchActivity = exports.pipedriveDeleteDeal = exports.pipedriveUpdateDeal = exports.pipedriveCreateDeal = exports.pipedriveSearchDeal = exports.pipedriveGetDealById = exports.pipedriveUpdateContact = exports.pipedriveCreateContact = exports.pipedriveSearchContact = exports.pipedriveGetContacts = exports.pipedriveSearchUser = void 0;
const axios_1 = __importDefault(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
const pipedriveAPI = axios_1.default.create({
    baseURL: 'https://api.pipedrive.com/v1',
    params: {
        api_token: process.env.PIPEDRIVE_API_KEY,
    },
});
// USERS
const pipedriveSearchUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email)
        return;
    const { data } = yield pipedriveAPI.get(`/users/find`, {
        params: {
            term: email,
            search_by_email: 1,
        },
    });
    if (data === null || data === void 0 ? void 0 : data.data) {
        return data.data[0];
    }
    return;
});
exports.pipedriveSearchUser = pipedriveSearchUser;
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
    if (!email)
        return;
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
    if (!contactId)
        return;
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
        '0c711d5c32b9fe925888b7fc9b6bc287c60d1ed0': body.typ_av_tak,
        d5969b61ed60673aa3143a212214d698fdc73cbc: body.energiforbruking,
        '780a109ebd42d15adcc56ab514ce100750ee132f': '',
        efdcb3fe17889df988d6f4ee668c65b14b05f276: body.placering_av_elcentral,
        bda50d3b0dec33b4912759927970f53a140ed7f8: body.lutning_pa_tak,
        ec565cf910b4ede8f17f61146ac4949c61b20860: '',
        '906a1b6df1074d69790595612fc913f66b76a57a': '',
        '341dfa743b5a35ab9362b5221305324b72ce577b': '',
        '53fac6375852b2f10ec97a6475a519aa26edeeb2': '',
        '3da634fe9832435a890dabc393ba028bb3bef916': '',
        d17b936aebb47ff47a952948480a8145b58f1920: '',
        cf494370dff95eaf4cfbfbfba800cac258eccbac: '',
        '112c9174964820a0c99b152382c2ee0af9f31071': '',
    };
};
const pipedriveGetDealById = (dealId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!dealId)
        return;
    const { data } = yield pipedriveAPI.get(`/deals/${dealId}`);
    if (data === null || data === void 0 ? void 0 : data.data) {
        return data.data;
    }
    return;
});
exports.pipedriveGetDealById = pipedriveGetDealById;
const pipedriveSearchDeal = (name) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    if (!name)
        return;
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
    if (!dealId)
        return;
    const deal = pipedriveDealFormat(dealData);
    const { data } = yield pipedriveAPI.put(`/deals/${dealId}`, Object.assign({ stage_id: process.env.PIPEDRIVE_STAGE_ID }, deal));
    return data === null || data === void 0 ? void 0 : data.data;
});
exports.pipedriveUpdateDeal = pipedriveUpdateDeal;
const pipedriveDeleteDeal = (dealId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!dealId)
        return;
    const { data } = yield pipedriveAPI.delete(`/deals/${dealId}`);
    return data === null || data === void 0 ? void 0 : data.data;
});
exports.pipedriveDeleteDeal = pipedriveDeleteDeal;
// ACTIVITY
const pipedriveActivityFormat = (body) => {
    return {
        due_date: (0, dayjs_1.default)(body.meeting_time).format('YYYY-MM-DD'),
        due_time: (0, dayjs_1.default)(body.meeting_time).format('HH:mm'),
        duration: '01:00',
        deal_id: body.dealId,
        person_id: body.userId,
        // note: `Fri konsultation: Mersol / ${body.namn}`,
        location: body.adress,
        // public_description:  `Fri konsultation: Mersol / ${body.namn}`,
        subject: `Fri konsultation: Mersol / ${body.namn}`,
        type: 'meeting',
        user_id: body.creatorId,
        attendees: [
            {
                email_address: body.epost,
            },
        ],
        busy_flag: true,
        done: 0,
    };
};
const pipedriveSearchActivity = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    if (!userId)
        return;
    const { data } = yield pipedriveAPI.get(`/activities`, {
        params: {
            type: 'meeting',
            user_id: userId,
            limit: 1,
        },
    });
    if ((_f = data === null || data === void 0 ? void 0 : data.data) === null || _f === void 0 ? void 0 : _f.length) {
        return data.data[0];
    }
    return;
});
exports.pipedriveSearchActivity = pipedriveSearchActivity;
const pipedriveCreateActivity = (activityData) => __awaiter(void 0, void 0, void 0, function* () {
    const activity = pipedriveActivityFormat(activityData);
    const { data } = yield pipedriveAPI.post(`/activities`, Object.assign({}, activity));
    return data === null || data === void 0 ? void 0 : data.data;
});
exports.pipedriveCreateActivity = pipedriveCreateActivity;
const pipedriveUpdateActivitiy = (activityId, activityData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!activityId)
        return;
    const activity = pipedriveActivityFormat(activityData);
    const { data } = yield pipedriveAPI.put(`/activities/${activityId}`, Object.assign({}, activity));
    return data === null || data === void 0 ? void 0 : data.data;
});
exports.pipedriveUpdateActivitiy = pipedriveUpdateActivitiy;
const pipedriveDeleteActivitiy = (activityId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!activityId)
        return;
    const { data } = yield pipedriveAPI.delete(`/activities/${activityId}`);
    return data === null || data === void 0 ? void 0 : data.data;
});
exports.pipedriveDeleteActivitiy = pipedriveDeleteActivitiy;
