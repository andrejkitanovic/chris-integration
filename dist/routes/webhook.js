"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const defineRoutes_1 = __importDefault(require("helpers/defineRoutes"));
const webhook_1 = require("controllers/webhook");
const router = (0, express_1.Router)();
(0, defineRoutes_1.default)(router, [
    {
        method: 'post',
        route: '/',
        controller: webhook_1.postWebhookLog,
    },
]);
exports.default = router;
