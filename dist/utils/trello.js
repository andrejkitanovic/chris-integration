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
exports.trelloDeleteCard = exports.trelloUpdateCard = exports.trelloCreateCard = exports.trelloSearchCard = void 0;
const axios_1 = __importDefault(require("axios"));
const trelloAPI = axios_1.default.create({
    baseURL: 'https://api.trello.com',
    params: {
        key: process.env.TRELLO_API_KEY,
        token: process.env.TRELLO_OAUTH_TOKEN,
    },
});
const trelloGetListCards = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield trelloAPI.get(`/1/lists/${process.env.TRELLO_LIST_ID}/cards`);
        return data;
    }
    catch (err) {
        throw new Error(err);
    }
});
const trelloSearchCard = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cards = yield trelloGetListCards();
        return cards.find((card) => card.name === name);
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.trelloSearchCard = trelloSearchCard;
const trelloCreateCard = (cardData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield trelloAPI.post(`/1/cards`, Object.assign({ idList: process.env.TRELLO_LIST_ID }, cardData));
        return data;
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
});
exports.trelloCreateCard = trelloCreateCard;
const trelloUpdateCard = (cardId, cardData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield trelloAPI.put(`/1/cards/${cardId}`, Object.assign({ idList: process.env.TRELLO_LIST_ID }, cardData));
        return data;
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.trelloUpdateCard = trelloUpdateCard;
const trelloDeleteCard = (cardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield trelloAPI.delete(`/1/cards/${cardId}`);
        return data;
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.trelloDeleteCard = trelloDeleteCard;
