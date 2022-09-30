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
const pipedrive_1 = require("utils/pipedrive");
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(yield (0, pipedrive_1.pipedriveSearchContact)(''));
        }
        catch (err) {
            console.log(err);
        }
    });
})();
