"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const module_alias_1 = __importDefault(require("module-alias"));
dotenv_1.default.config();
module_alias_1.default.addAliases({
    helpers: __dirname + '/helpers',
    routes: __dirname + '/routes',
    models: __dirname + '/models',
    controllers: __dirname + '/controllers',
    middlewares: __dirname + '/middlewares',
    validators: __dirname + '/validators',
    utils: __dirname + '/utils',
});
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const headers_1 = __importDefault(require("middlewares/headers"));
const error_1 = __importDefault(require("middlewares/error"));
const connection_1 = __importDefault(require("helpers/connection"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("routes"));
const app = (0, express_1.default)();
app.set('views', [path_1.default.join(__dirname, '/views')]);
app.set('view engine', 'pug');
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// storage(app);
app.use(headers_1.default);
app.use('/logs/requests', express_1.default.static('logs/request.log'));
app.use('/logs/errors', express_1.default.static('logs/error.log'));
(0, routes_1.default)(app);
app.use(error_1.default);
(0, connection_1.default)(app);
// import { useGoogle } from 'utils/google';
// import User, { IUser } from 'models/user';
// (async function () {
// 	const user = (await User.findOne({ email: 'christian@mersol.se' })) as IUser;
// 	const { googleGetCalendarSearchEvent, googleDeleteCalendarEvent } = await useGoogle(user);
// 	// console.log(await googleDeleteCalendarEvent("2022-09-27T12:45:00Z"));
// 	const meeting = await googleGetCalendarSearchEvent("2022-09-27T12:45:00Z");
// 	await googleDeleteCalendarEvent(meeting.id);
// 	console.log(meeting)
// })();
