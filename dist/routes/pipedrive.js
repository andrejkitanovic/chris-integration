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
        route: '/activity/created',
        controller: pipedrive_1.postWebhookActivityCreated,
    },
    {
        method: 'post',
        route: '/activity/updated',
        controller: pipedrive_1.postWebhookActivityUpdated,
    },
    {
        method: 'post',
        route: '/activity/deleted',
        controller: pipedrive_1.postWebhookActivityDeleted,
    },
]);
exports.default = router;
