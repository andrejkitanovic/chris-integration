"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const defineRoutes_1 = __importDefault(require("helpers/defineRoutes"));
const pipedrive_1 = require("controllers/pipedrive");
const router = (0, express_1.Router)();
(0, defineRoutes_1.default)(router, [
    {
        method: 'post',
        route: '/activity',
        controller: pipedrive_1.postWebhookActivity,
    },
    {
        method: 'post',
        route: '/deal',
        controller: pipedrive_1.postWebhookDeal,
    },
]);
exports.default = router;
