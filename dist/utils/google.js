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
exports.useGoogle = void 0;
const axios_1 = __importDefault(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
const useGoogle = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { data: { access_token }, } = yield axios_1.default.post('https://oauth2.googleapis.com/token', {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: user.refreshToken,
    });
    const calendarGoogleAPI = axios_1.default.create({
        baseURL: 'https://www.googleapis.com/calendar/v3',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    const calendarId = user.email;
    const googleGetCalendarSearchEvent = (meeting_time) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { data } = yield calendarGoogleAPI.get(`/calendars/${calendarId}/events`, {
                params: {
                    q: 'Möte med Mersol',
                    timeMin: meeting_time,
                },
            });
            if (data === null || data === void 0 ? void 0 : data.items) {
                const findMeeting = (_a = data === null || data === void 0 ? void 0 : data.items) === null || _a === void 0 ? void 0 : _a.find((item) => item.summary === 'Möte med Mersol' &&
                    (0, dayjs_1.default)(item.start.dateTime).diff((0, dayjs_1.default)(meeting_time)) === 0);
                return findMeeting;
            }
            return data === null || data === void 0 ? void 0 : data.items;
        }
        catch (err) {
            throw new Error(err);
        }
    });
    const googleDeleteCalendarEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { data } = yield calendarGoogleAPI.delete(`/calendars/${calendarId}/events/${eventId}`);
            return data;
        }
        catch (err) {
            throw new Error(err);
        }
    });
    return {
        googleGetCalendarSearchEvent,
        googleDeleteCalendarEvent,
    };
});
exports.useGoogle = useGoogle;
