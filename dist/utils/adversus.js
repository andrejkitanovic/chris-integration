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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.adversusUpdateBooking = exports.adversusSeachBooking = void 0;
const axios_1 = __importDefault(require("axios"));
const writeInFile_1 = require("helpers/writeInFile");
const adversusAPI = axios_1.default.create({
    baseURL: 'https://api.adversus.dk/v1',
    auth: {
        username: (_a = process.env.ADVERSUS_USERNAME) !== null && _a !== void 0 ? _a : '',
        password: (_b = process.env.ADVERSUS_PASSWORD) !== null && _b !== void 0 ? _b : '',
    },
});
const adversusSeachBooking = (meetTime) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { data } = yield adversusAPI.get(`/appointments`);
    yield (0, writeInFile_1.writeInFileSimple)({ path: 'logs/test.log', context: JSON.stringify(data === null || data === void 0 ? void 0 : data.appointments) });
    return (_c = data === null || data === void 0 ? void 0 : data.appointments) === null || _c === void 0 ? void 0 : _c.find((appointment) => appointment.start === meetTime);
});
exports.adversusSeachBooking = adversusSeachBooking;
const adversusUpdateBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield adversusAPI.patch(`/appointments/${id}`, {
        status: 'held',
        feedbackStatus: 'notInterested',
    });
    return { data };
});
exports.adversusUpdateBooking = adversusUpdateBooking;
