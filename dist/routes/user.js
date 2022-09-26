"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const defineRoutes_1 = __importDefault(require("helpers/defineRoutes"));
const user_1 = require("controllers/user");
const router = (0, express_1.Router)();
(0, defineRoutes_1.default)(router, [
    {
        method: 'get',
        route: '/',
        controller: user_1.getUsers,
    },
    {
        method: 'post',
        route: '/',
        controller: user_1.postUser,
    },
]);
exports.default = router;
