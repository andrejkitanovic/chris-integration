"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const defineRoutes_1 = __importDefault(require("helpers/defineRoutes"));
const trello_1 = require("controllers/trello");
const router = (0, express_1.Router)();
(0, defineRoutes_1.default)(router, [
    {
        method: 'get',
        route: '/',
        controller: trello_1.getTrello,
    },
    {
        method: 'post',
        route: '/card',
        controller: trello_1.postTrelloCard,
    },
]);
exports.default = router;
