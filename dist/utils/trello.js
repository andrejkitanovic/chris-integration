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
exports.trelloDeleteCard = exports.trelloUpdateCustomFieldsCard = exports.trelloUpdateCard = exports.trelloCreateCard = exports.trelloGetCustomFieldsCard = exports.trelloSearchCard = void 0;
const axios_1 = __importDefault(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
const trelloAPI = axios_1.default.create({
    baseURL: 'https://api.trello.com',
    params: {
        key: process.env.TRELLO_API_KEY,
        token: process.env.TRELLO_OAUTH_TOKEN,
    },
});
const trelloCardFormat = (body) => {
    var _a, _b, _c, _d;
    return {
        name: body.title,
        desc: (_b = (_a = body.next_activity) === null || _a === void 0 ? void 0 : _a.public_description) !== null && _b !== void 0 ? _b : '',
        due: body.next_activity
            ? (0, dayjs_1.default)(`${(_c = body.next_activity) === null || _c === void 0 ? void 0 : _c.due_date} ${(_d = body.next_activity) === null || _d === void 0 ? void 0 : _d.due_time}`).subtract(1, 'day').toDate()
            : null,
    };
};
const trelloCustomFieldsFormat = (body) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    return {
        '633704728e0134015068a893': (_b = (_a = body === null || body === void 0 ? void 0 : body.next_activity) === null || _a === void 0 ? void 0 : _a.location) !== null && _b !== void 0 ? _b : '',
        '63370548efc8a70389777cfb': (_c = body === null || body === void 0 ? void 0 : body.owner_name) !== null && _c !== void 0 ? _c : '',
        '633705063358d800d391b693': (_d = body['780a109ebd42d15adcc56ab514ce100750ee132f']) !== null && _d !== void 0 ? _d : '',
        '63370443931e2701b93c4145': (_f = (_e = body === null || body === void 0 ? void 0 : body.person_name) === null || _e === void 0 ? void 0 : _e.split(' ')[0]) !== null && _f !== void 0 ? _f : '',
        '63370468acfe6205cae1b7ac': (_h = (_g = body === null || body === void 0 ? void 0 : body.person_name) === null || _g === void 0 ? void 0 : _g.split(' ')[1]) !== null && _h !== void 0 ? _h : '',
        '633704e56df6ca01205d85ad': (_k = (_j = body === null || body === void 0 ? void 0 : body.person_id) === null || _j === void 0 ? void 0 : _j.email[0].value) !== null && _k !== void 0 ? _k : '',
        '633704fe78625e0017de625d': (_m = (_l = body === null || body === void 0 ? void 0 : body.person_id) === null || _l === void 0 ? void 0 : _l.phone[0].value) !== null && _m !== void 0 ? _m : '',
        '63370510b7016f01cf86959a': (_o = body["0c711d5c32b9fe925888b7fc9b6bc287c60d1ed0"]) !== null && _o !== void 0 ? _o : "",
        '6337051e5a9e3d0045e504e6': (_p = body["d5969b61ed60673aa3143a212214d698fdc73cbc"]) !== null && _p !== void 0 ? _p : "",
        '633705294a7adf00d0530228': (_q = body["bda50d3b0dec33b4912759927970f53a140ed7f8"]) !== null && _q !== void 0 ? _q : "",
        '6337053160b5c9029d964a91': (_r = body["ec565cf910b4ede8f17f61146ac4949c61b20860"]) !== null && _r !== void 0 ? _r : "",
        '63370541ac93bf007756fc63': (_s = body["efdcb3fe17889df988d6f4ee668c65b14b05f276"]) !== null && _s !== void 0 ? _s : "", // Placering av elcentral/mätare
    };
};
const trelloGetListCards = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield trelloAPI.get(`/1/lists/${process.env.TRELLO_LIST_ID}/cards`);
    return data;
});
const trelloSearchCard = (name) => __awaiter(void 0, void 0, void 0, function* () {
    if (!name)
        return;
    const cards = yield trelloGetListCards();
    return cards.find((card) => card.name === name);
});
exports.trelloSearchCard = trelloSearchCard;
const trelloGetCustomFieldsCard = (cardId) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield trelloAPI.get(`/1/cards/${cardId}/customFieldItems`);
    return data;
});
exports.trelloGetCustomFieldsCard = trelloGetCustomFieldsCard;
const trelloCreateCard = (cardData) => __awaiter(void 0, void 0, void 0, function* () {
    const card = trelloCardFormat(cardData);
    const { data } = yield trelloAPI.post(`/1/cards`, Object.assign({ idList: process.env.TRELLO_LIST_ID }, card));
    return data;
});
exports.trelloCreateCard = trelloCreateCard;
const trelloUpdateCard = (cardId, cardData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!cardId)
        return;
    const card = trelloCardFormat(cardData);
    const { data } = yield trelloAPI.put(`/1/cards/${cardId}`, Object.assign({ idList: process.env.TRELLO_LIST_ID }, card));
    return data;
});
exports.trelloUpdateCard = trelloUpdateCard;
const trelloUpdateCustomFieldsCard = (cardId, customFieldsData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!cardId)
        return;
    const customFieldsObject = trelloCustomFieldsFormat(customFieldsData);
    const customFields = Object.keys(customFieldsObject).filter((key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return Boolean(customFieldsObject[key]);
    });
    customFields.forEach((key) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        yield trelloAPI.put(`/1/cards/${cardId}/customField/${key}/item`, {
            value: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                text: (_a = customFieldsObject[key]) !== null && _a !== void 0 ? _a : '',
            },
        });
    }));
    return;
});
exports.trelloUpdateCustomFieldsCard = trelloUpdateCustomFieldsCard;
const trelloDeleteCard = (cardId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!cardId)
        return;
    const { data } = yield trelloAPI.delete(`/1/cards/${cardId}`);
    return data;
});
exports.trelloDeleteCard = trelloDeleteCard;
