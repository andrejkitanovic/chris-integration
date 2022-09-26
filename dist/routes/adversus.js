"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const defineRoutes_1 = __importDefault(require("helpers/defineRoutes"));
const adversus_1 = require("controllers/adversus");
const router = (0, express_1.Router)();
(0, defineRoutes_1.default)(router, [
    {
        method: 'post',
        route: '/created',
        controller: adversus_1.postWebhookBookingCreated,
    },
    {
        method: 'post',
        route: '/updated',
        controller: adversus_1.postWebhookBookingUpdated,
    },
    {
        method: 'post',
        route: '/deleted',
        controller: adversus_1.postWebhookBookingDeleted,
    },
]);
exports.default = router;
