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
exports.postUser = exports.getUsers = void 0;
const user_1 = __importDefault(require("models/user"));
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const oauth = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find();
        const count = yield user_1.default.count();
        res.json({
            data: users,
            meta: {
                count,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUsers = getUsers;
const postUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.body;
        const { data: tokenData } = yield axios_1.default.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: 'https://webhook.mersol.se',
            grant_type: 'authorization_code',
            code,
        });
        const ticket = yield oauth.verifyIdToken({
            idToken: tokenData.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload)
            throw new Error();
        if (!tokenData.refresh_token)
            throw new Error();
        console.log({
            name: payload.name,
            email: payload.email,
            clientId: payload.sub,
            refreshToken: tokenData.refresh_token,
        });
        yield user_1.default.create({
            name: payload.name,
            email: payload.email,
            clientId: payload.sub,
            refreshToken: tokenData.refresh_token,
        });
        res.json({
            message: 'Success',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.postUser = postUser;
