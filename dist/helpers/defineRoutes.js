"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("middlewares/validator"));
const logger_1 = __importDefault(require("middlewares/logger"));
const defineRoutes = (router, routes) => {
    routes.forEach(({ method, route, validator, controller }) => {
        const additionalRoutes = [];
        if (validator) {
            additionalRoutes.push(validator, validator_1.default);
        }
        router[method](route, logger_1.default, ...additionalRoutes, controller);
    });
};
exports.default = defineRoutes;
