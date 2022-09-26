"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const logger = (req, res, next) => {
    const { method, baseUrl, headers } = req;
    const language = headers['accept-language'] || 'en';
    console.log(`[${method}] ${baseUrl} | ${language.toUpperCase()} | ${(0, dayjs_1.default)().format('HH:mm:ss DD/MM/YYYY')}`);
    next();
};
exports.default = logger;
